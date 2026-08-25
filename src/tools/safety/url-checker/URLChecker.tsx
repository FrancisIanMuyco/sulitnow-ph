import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';
import { toolRegistry } from '../../../constants/toolRegistry';
import { ShieldAlert, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const tool = toolRegistry.find(t => t.id === 'url-checker')!;

const SCAM_KEYWORDS = ['pay', 'send', 'gcash', 'cashapp', 'winner', 'congratulations', 'claim', 'prize', 'lottery', 'inheritance', 'crypto', 'bitcoin', 'invest', 'guaranteed', 'risk-free'];
const SUSPICIOUS_TLDS = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.club', '.icu', '.buzz'];
const PHISHING_PATTERNS = ['login', 'verify', 'account', 'secure', 'update', 'confirm', 'suspend', 'urgent'];

export default function URLChecker() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<null | {
    url: string;
    risk: 'low' | 'medium' | 'high';
    score: number;
    signals: { label: string; status: 'safe' | 'warning' | 'danger'; detail: string }[];
  }>(null);

  const checkURL = () => {
    if (!url.trim()) return;
    let input = url.trim();
    if (!input.startsWith('http://') && !input.startsWith('https://')) input = 'https://' + input;

    let parsed: URL;
    try { parsed = new URL(input); } catch { return; }

    const hostname = parsed.hostname.toLowerCase();
    const fullUrl = input.toLowerCase();
    const signals: { label: string; status: 'safe' | 'warning' | 'danger'; detail: string }[] = [];
    let riskScore = 0;

    // HTTPS check
    if (parsed.protocol === 'https:') {
      signals.push({ label: 'HTTPS', status: 'safe', detail: 'Site uses HTTPS encryption' });
    } else {
      signals.push({ label: 'HTTPS', status: 'danger', detail: 'No HTTPS — data may not be secure' });
      riskScore += 25;
    }

    // Suspicious TLD
    const tld = '.' + hostname.split('.').pop();
    if (SUSPICIOUS_TLDS.includes(tld)) {
      signals.push({ label: 'Domain Extension', status: 'danger', detail: `${tld} is commonly used by scam/phishing sites` });
      riskScore += 25;
    } else {
      signals.push({ label: 'Domain Extension', status: 'safe', detail: `${tld} is a common extension` });
    }

    // IP address instead of domain
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
      signals.push({ label: 'IP Address', status: 'danger', detail: 'Using IP address instead of a domain name — suspicious' });
      riskScore += 20;
    } else {
      signals.push({ label: 'Domain Name', status: 'safe', detail: 'Uses a domain name' });
    }

    // Too many subdomains
    const subdomains = hostname.split('.').length - 2;
    if (subdomains > 2) {
      signals.push({ label: 'Subdomains', status: 'warning', detail: `Unusually many subdomains (${subdomains})` });
      riskScore += 10;
    }

    // Phishing patterns in URL
    const phishingHits = PHISHING_PATTERNS.filter(p => fullUrl.includes(p));
    if (phishingHits.length > 0) {
      signals.push({ label: 'Phishing Keywords', status: 'warning', detail: `Contains: ${phishingHits.join(', ')}` });
      riskScore += 10;
    }

    // Scam keywords
    const scamHits = SCAM_KEYWORDS.filter(k => fullUrl.includes(k));
    if (scamHits.length > 0) {
      signals.push({ label: 'Scam Keywords', status: 'warning', detail: `Contains: ${scamHits.join(', ')}` });
      riskScore += 5 * scamHits.length;
    }

    // URL length
    if (input.length > 100) {
      signals.push({ label: 'URL Length', status: 'warning', detail: `Very long URL (${input.length} chars)` });
      riskScore += 5;
    }

    // Known legitimate domains
    const knownLegit = ['google.com', 'facebook.com', 'youtube.com', 'shopee.ph', 'lazada.ph', 'gcash.com', 'maya.ph', 'bpi.com.ph', 'bdo.com.ph', 'metrobank.com.ph'];
    const isLegit = knownLegit.some(d => hostname.endsWith(d));
    if (isLegit) {
      riskScore = 0;
      signals.push({ label: 'Known Domain', status: 'safe', detail: 'This is a recognized legitimate website' });
    }

    const risk = riskScore >= 40 ? 'high' : riskScore >= 15 ? 'medium' : 'low';
    setResult({ url: input, risk, score: riskScore, signals });
  };

  return (
    <ToolLayout tool={tool}>
      <div className="p-4 space-y-4">
        <div className="bg-surface-alt rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert size={18} className="text-primary" />
            <h3 className="text-sm font-semibold text-text">Suspicious URL Checker</h3>
          </div>
          <div className="text-[10px] text-text-muted mb-3">⚠️ This tool checks URL characteristics only. It does not verify actual site content.</div>
          <div className="flex gap-2">
            <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="Enter URL to check..." className="flex-1 px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary" onKeyDown={e => e.key === 'Enter' && checkURL()} />
            <button onClick={checkURL} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition">Check</button>
          </div>
        </div>

        {result && (
          <div className="space-y-3">
            <div className={`rounded-xl p-4 border ${result.risk === 'low' ? 'bg-green-500/10 border-green-500/20' : result.risk === 'medium' ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
              <div className="flex items-center gap-2 mb-2">
                {result.risk === 'low' ? <CheckCircle size={20} className="text-green-500" /> : result.risk === 'medium' ? <AlertTriangle size={20} className="text-yellow-500" /> : <XCircle size={20} className="text-red-500" />}
                <div>
                  <div className={`text-sm font-bold ${result.risk === 'low' ? 'text-green-500' : result.risk === 'medium' ? 'text-yellow-500' : 'text-red-500'}`}>
                    {result.risk === 'low' ? 'LOW RISK' : result.risk === 'medium' ? 'MEDIUM RISK' : 'HIGH RISK'}
                  </div>
                  <div className="text-[10px] text-text-muted truncate max-w-[250px]">{result.url}</div>
                </div>
              </div>
            </div>

            <div className="bg-surface-alt rounded-xl p-4 border border-border">
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Signals Found</h4>
              <div className="space-y-2">
                {result.signals.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-surface border border-border">
                    {s.status === 'safe' ? <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" /> : s.status === 'warning' ? <AlertTriangle size={14} className="text-yellow-500 mt-0.5 shrink-0" /> : <XCircle size={14} className="text-red-500 mt-0.5 shrink-0" />}
                    <div>
                      <div className="text-xs font-semibold text-text">{s.label}</div>
                      <div className="text-[10px] text-text-muted">{s.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-surface-alt rounded-xl border border-border text-[10px] text-text-muted text-center">
              🔒 Always verify URLs independently. This is not a substitute for professional security assessment.
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
