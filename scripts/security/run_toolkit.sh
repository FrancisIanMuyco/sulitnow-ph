#!/bin/bash
# =============================================================================
# SulitNow PH — Security & Recon Toolkit (uses newly installed tools)
# =============================================================================
# Runs, in one shot:
#   1. check_sources.py   -> security audit of every scrape source
#                             (nuclei + nikto + reachability/WAF pre-check)
#   2. discover_sources.py -> optional recon to find new API/data endpoints
#                             (subfinder + httpx + katana + gobuster + nmap)
#
# All output lands in public/data/ so the frontend can surface a "source
# health" panel if desired. Safe to run manually or from CI/cron.
#
# Usage:
#   ./scripts/security/run_toolkit.sh                         # full security check
#   ./scripts/security/run_toolkit.sh --quick                 # security, no nikto/slow
#   ./scripts/security/run_toolkit.sh --discover --domain grid,smart.com.ph
# =============================================================================
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
SEC_DIR="$PROJECT_DIR/scripts/security"
MODE="${1:-}"

mkdir -p "$SEC_DIR/recon-out"

echo "=============================================================="
echo " SulitNow PH — Security & Recon Toolkit"
echo " Project : $PROJECT_DIR"
echo " Date    : $(date '+%Y-%m-%d %H:%M:%S')"
echo "=============================================================="

# --- Phase 1: Security check of scrape sources ------------------------------
echo ""
echo ">>> Phase 1: Scrape-source security audit"
ARGS=()
if [ "$MODE" = "--quick" ]; then
  # skip the slow network scans (nuclei/nikto); reachability+WAF report only
  ARGS+=(--offline)
fi
python3 "$SEC_DIR/check_sources.py" "${ARGS[@]}"
echo ""
echo "SecAudit exit: $?"

# --- Phase 2 (optional): recon / new-source discovery ------------------------
if [ "$MODE" = "--discover" ]; then
  echo ""
  echo ">>> Phase 2: Recon — discovering new data sources"
  shift || true
  python3 "$SEC_DIR/discover_sources.py" "$@"
  echo ""
  echo "Recon exit: $?"
fi

echo ""
echo "=============================================================="
echo " Done. Reports:"
echo "   public/data/security-report.json"
[ -f "$PROJECT_DIR/public/data/recon-sources.json" ] && echo "   public/data/recon-sources.json"
echo "=============================================================="
