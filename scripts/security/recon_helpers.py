#!/usr/bin/env python3
"""
SulitNow PH — Recon/Reliability Helper Library
==============================================
Shared utility for the newly installed security & recon tools so that every
scraper can route through them and stay reliable while scraping.

What this module does
---------------------
1. Tracks which of the installed tools are actually available on PATH
   (nuclei, subfinder, httpx, naabu, katana, amass, ffuf, gobuster, sqlmap,
   nikto, nmap, hydra, bettercap, mitmproxy ...) and never crashes if one is
   missing.
2. `check_source()` — probes a scrape target URL and tells the caller whether
   it is UP, DOWN or BLOCKED (WAF/Cloudflare/captcha/403).
3. `detect_waf()` — uses nuclei + header fingerprinting to detect if a target
   is protected by Cloudflare/other WAFs.
4. `healthy_proxies()` — tests the current proxy pool against a light target
   and returns only the working ones, so scraping can rotate through valid
   proxies instead of dead ones.
5. `run_tool()` — safe wrapper to invoke any of the CLI tools with a timeout.
"""

import json
import os
import re
import shutil
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

# ---------------------------------------------------------------------------
# Tool registry: what we installed and where it usually lives.
# ---------------------------------------------------------------------------
GO_BIN = os.path.expanduser("~/go/bin")
EXTRA_PATH = GO_BIN

def _path_with_go():
    return os.pathsep.join([EXTRA_PATH, os.environ.get("PATH", "")])

TOOL_PATHS = {}
for _tool in [
    "nuclei", "subfinder", "httpx", "naabu", "katana", "amass", "ffuf",
    "gobuster", "sqlmap", "nikto", "nmap", "hydra", "bettercap", "mitmproxy",
    "tshark", "john", "hashcat",
]:
    _found = shutil.which(_tool, path=_path_with_go())
    if _found:
        TOOL_PATHS[_tool] = _found

def require_path():
    """Ensures ~/go/bin is on PATH for subprocess calls."""
    env = dict(os.environ)
    env["PATH"] = _path_with_go()
    return env

# ---------------------------------------------------------------------------
# Small public API
# ---------------------------------------------------------------------------

def available_tools() -> dict:
    """Return {tool_name: bool} for every tool in our registry."""
    return {t: t in TOOL_PATHS for t in [
        "nuclei", "subfinder", "httpx", "naabu", "katana", "amass", "ffuf",
        "gobuster", "sqlmap", "nikto", "nmap", "hydra", "bettercap",
        "mitmproxy", "tshark", "john", "hashcat",
    ]}


def run_tool(name: str, args: list, timeout: int = 60, cwd: str = None,
             capture: bool = True) -> subprocess.CompletedProcess:
    """Run one of the installed CLI tools safely.

    Returns a CompletedProcess with stdout/stderr populated (or empty if the
    tool is missing / times out). Never raises.
    """
    exe = TOOL_PATHS.get(name)
    if not exe:
        return subprocess.CompletedProcess(
            args, -1, stdout="", stderr=f"{name} not installed")
    env = require_path()
    try:
        return subprocess.run(
            [exe] + list(args), timeout=timeout, cwd=cwd, env=env,
            capture_output=True, text=True,
        )
    except subprocess.TimeoutExpired:
        return subprocess.CompletedProcess(
            args, -1, stdout="", stderr=f"{name} timed out ({timeout}s)")
    except Exception as e:  # noqa: BLE001
        return subprocess.CompletedProcess(
            args, -1, stdout="", stderr=f"{name} error: {e}")


# ---------------------------------------------------------------------------
# Proxy health check
# ---------------------------------------------------------------------------

def _probe_proxy(proxy, target="https://httpbin.org/ip", timeout=8):
    """Return (healthy: bool, latency_ms: float|None)."""
    import httpx
    http = httpx.Client(proxy=proxy, timeout=timeout, follow_redirects=True)
    try:
        t0 = time.time()
        r = http.get(target)
        lat = (time.time() - t0) * 1000
        return (200 <= r.status_code < 500, round(lat, 1))
    except Exception:
        return (False, None)
    finally:
        try:
            http.close()
        except Exception:
            pass


def healthy_proxies(proxy_list, test_url="https://httpbin.org/ip",
                    max_workers=10, min_ok=3):
    """Test a list of proxy URLs and return those that work.

    proxy_list: list of strings like "http://user:pass@ip:port"
    Returns a list of (proxy, latency_ms, ok) tuples sorted by latency.
    """
    if not proxy_list:
        return []
    results = []
    with ThreadPoolExecutor(max_workers=max_workers) as ex:
        futs = {ex.submit(_probe_proxy, p, test_url): p for p in proxy_list}
        for fut in as_completed(futs):
            p = futs[fut]
            try:
                ok, lat = fut.result()
            except Exception:
                ok, lat = False, None
            results.append((p, lat, ok))
    results.sort(key=lambda x: x[1] if x[1] is not None else 1e9)
    good = [(p, lat) for p, lat, ok in results if ok]
    return good[:max(min_ok, len(good))] if good else good


# ---------------------------------------------------------------------------
# Source availability + WAF detection
# ---------------------------------------------------------------------------

_WAF_HEADER_HINTS = [
    (re.compile(r"cloudflare", re.I), "Cloudflare"),
    (re.compile(r"akamai", re.I), "Akamai"),
    (re.compile(r"incapsula|imperva", re.I), "Imperva/Incapsula"),
    (re.compile(r"aws.?waf", re.I), "AWS WAF"),
    (re.compile(r"sqreen|datadog", re.I), "Datadog/Sqreen"),
    (re.compile(r"vercel", re.I), "Vercel"),
]

_CAPTCHA_SNIPPETS = [
    b"cf-browser-verification", b"challenge-platform", b"captcha",
    b"just a moment", b"checking your browser", b"attention required",
    b"access denied", b"enable javascript and cookies",
]


def check_source(url: str, timeout: int = 12, proxy=None) -> dict:
    """Probe a scrape target and classify it.

    Returns a dict with keys:
      url, reachable(bool), status(int|None), blocked(bool), reason(str),
      waf(str|None), latency_ms(int|None)
    """
    import httpx
    result = {
        "url": url, "reachable": False, "status": None, "blocked": False,
        "reason": "unknown", "waf": None, "latency_ms": None,
    }
    headers = {
        "User-Agent": ("Mozilla/5.0 (Linux; Android 13; SM-G991B) "
                       "AppleWebKit/537.36 (KHTML, like Gecko) "
                       "Chrome/120.0.0.0 Mobile Safari/537.36"),
        "Accept-Language": "en-PH,en;q=0.9",
    }
    try:
        client = httpx.Client(timeout=timeout, follow_redirects=True,
                              headers=headers, proxy=proxy)
        t0 = time.time()
        r = client.get(url)
        result["latency_ms"] = round((time.time() - t0) * 1000, 1)
        result["status"] = r.status_code
        result["reachable"] = r.status_code < 500

        # WAF detection from response headers
        for header_name, header_val in (r.headers.items()):
            for pat, name in _WAF_HEADER_HINTS:
                if pat.search(header_val):
                    result["waf"] = name

        body = r.content[:60000].lower()
        for snip in _CAPTCHA_SNIPPETS:
            if snip in body:
                result["blocked"] = True
                result["waf"] = result["waf"] or "Cloudflare/challenge"
                result["reason"] = "challenge/captcha detected"
                break

        if r.status_code in (403, 429):
            result["blocked"] = True
            result["waf"] = result["waf"] or "rate-limited"
            result["reason"] = f"HTTP {r.status_code} (blocked/rate-limited)"
        elif r.status_code in (401,):
            result["blocked"] = True
            result["reason"] = "HTTP 401 unauthorized"

        client.close()
    except httpx.TimeoutException:
        result["reason"] = "timeout"
    except Exception as e:  # noqa: BLE001
        result["reason"] = str(e)[:120]
    return result


def detect_waf(target: str, timeout: int = 120) -> list:
    """Run nuclei against a single target and return warnings relating to
    WAF/tech stack. Returns a list of {template, info} dicts."""
    if "nuclei" not in TOOL_PATHS:
        return []
    out = []
    # --silent to keep output compact; use -jsonl snippet parse
    res = run_tool("nuclei", ["-u", target, "-silent", "-jsonl", "-timeout", "10"],
                   timeout=timeout)
    for line in res.stdout.splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            obj = json.loads(line)
        except Exception:
            continue
        matched = obj.get("matched-at") or obj.get("host") or target
        info = obj.get("info", {})
        tags = info.get("tags", "")
        if any(t in tags for t in ["waf", "tech", "cloudflare", "misconfig"]):
            out.append({
                "template": obj.get("template-id"),
                "name": info.get("name"),
                "severity": info.get("severity"),
                "tags": tags,
                "matched": matched,
            })
    return out


# ---------------------------------------------------------------------------
# Convenience: recommend a strategy for each source before scraping
# ---------------------------------------------------------------------------

def recommend_strategy(check: dict) -> str:
    """Return a short human/script-readable recommendation given check_source output."""
    if not check.get("reachable"):
        return "SKIP"          # down / timeout -> don't waste the scrape
    if check.get("blocked"):
        return "NEED_PROXY"    # WAF/captcha/403 -> route through proxy
    if check.get("waf"):
        return "ROTATE_UA"     # WAF up but reachable -> rotate UA/headless
    return "SCRAPE"            # good to go directly


def smart_scrape_decision(url: str, proxies=None, timeout: int = 10) -> dict:
    """One-shot decision helper for the scrapers.

    Checks a target and returns:
      { url, strategy, proxy (a working proxy or None), check }

    strategy is one of SCRAPE / ROTATE_UA / NEED_PROXY / SKIP.
    When NEED_PROXY, a live proxy from `proxies` is returned (if any work).
    """
    chk = check_source(url, timeout=timeout)
    strat = recommend_strategy(chk)
    proxy = None
    check_level = "reachability"
    if strat == "NEED_PROXY" and proxies:
        good = healthy_proxies(proxies, min_ok=1)
        if good:
            proxy = good[0][0]
        if proxy:
            strat = "SCRAPE"      # we have a working proxy, go ahead
        else:
            strat = "SKIP"        # blocked and no live proxy -> skip
        check_level += "+proxy"
    return {
        "url": url,
        "strategy": strat,
        "proxy": proxy,
        "check": chk,
        "checkLevel": check_level,
    }


if __name__ == "__main__":
    print("=" * 60)
    print("SulitNow PH — Recon Helper self-test")
    print("=" * 60)
    print("\nAvailable tools:")
    for t, ok in available_tools().items():
        print(f"  {'✅' if ok else '❌'} {t}")
    print("\nChecking a sample source (httpbin):")
    c = check_source("https://httpbin.org/ip")
    print(f"  {c}")
    print(f"  => recommend: {recommend_strategy(c)}")
