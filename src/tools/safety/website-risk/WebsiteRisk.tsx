import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';
import { toolRegistry } from '../../../constants/toolRegistry';
import { ShieldCheck, CheckCircle, XCircle } from 'lucide-react';

const tool = toolRegistry.find(t => t.id === 'website-risk')!;

const CHECKLIST = [
  { id: 'https', label: 'Uses HTTPS', category: 'Security', weight: 15, desc: 'Secure connection' },
  { id: 'contact', label: 'Has Contact Information', category: 'Trust', weight: 10, desc: 'Visible email, phone, or address' },
  { id: 'about', label: 'Has About Us Page', category: 'Trust', weight: 8, desc: 'Company background info' },
  { id: 'privacy', label: 'Has Privacy Policy', category: 'Trust', weight: 10, desc: 'Data handling disclosure' },
  { id: 'terms', label: 'Has Terms of Service', category: 'Trust', weight: 8, desc: 'Legal terms available' },
  { id: 'social', label: 'Has Social Media Links', category: 'Trust', weight: 7, desc: 'Verifiable social presence' },
  { id: 'reviews', label: 'Has Customer Reviews', category: 'Trust', weight: 10, desc: 'User feedback visible' },
  { id: 'age', label: 'Domain Age > 1 Year', category: 'Trust', weight: 12, desc: 'Established presence' },
  { id: 'no-popups', label: 'No Excessive Popups', category: 'UX', weight: 5, desc: 'Clean browsing experience' },
  { id: 'grammar', label: 'Professional Language', category: 'Trust', weight: 5, desc: 'Well-written content' },
  { id: 'payment', label: 'Recognized Payment Methods', category: 'Security', weight: 10, desc: 'GCash, Maya, PayPal, cards' },
  { id: 'https-lock', label: 'Valid SSL Certificate', category: 'Security', weight: 10, desc: 'Padlock in address bar' },
];

export default function WebsiteRisk() {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [siteName, setSiteName] = useState('');

  const toggle = (id: string) => setAnswers(prev => ({ ...prev, [id]: prev[id] === true ? false : prev[id] === false ? null : true }));

  const answered = Object.keys(answers).filter(k => answers[k] !== null);
  const checked = answered.filter(k => answers[k] === true);
  const unchecked = answered.filter(k => answers[k] === false);
  const totalWeight = CHECKLIST.reduce((sum, c) => sum + c.weight, 0);
  const earnedWeight = checked.reduce((sum, id) => sum + (CHECKLIST.find(c => c.id === id)?.weight || 0), 0);
  const trustScore = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
  const riskLevel = trustScore >= 80 ? 'Low Risk' : trustScore >= 50 ? 'Medium Risk' : trustScore >= 25 ? 'High Risk' : 'Unanswered';
  const riskColor = trustScore >= 80 ? 'text-green-500' : trustScore >= 50 ? 'text-yellow-500' : trustScore >= 25 ? 'text-red-500' : 'text-text-muted';

  const categories = [...new Set(CHECKLIST.map(c => c.category))];

  return (
    <ToolLayout tool={tool}>
      <div className="p-4 space-y-4">
        <div className="bg-surface-alt rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={18} className="text-primary" />
            <h3 className="text-sm font-semibold text-text">Website Risk Assessment</h3>
          </div>
          <div className="text-[10px] text-text-muted mb-3">Check each signal you observe on the website. This helps you evaluate trustworthiness.</div>
          <input value={siteName} onChange={e => setSiteName(e.target.value)} placeholder="Website name (optional)" className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>

        {categories.map(cat => (
          <div key={cat} className="bg-surface-alt rounded-xl p-4 border border-border">
            <h4 className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">{cat}</h4>
            <div className="space-y-2">
              {CHECKLIST.filter(c => c.category === cat).map(c => (
                <button key={c.id} onClick={() => toggle(c.id)} className={`w-full text-left flex items-center gap-3 p-3 rounded-lg border transition ${answers[c.id] === true ? 'border-green-500 bg-green-500/5' : answers[c.id] === false ? 'border-red-500 bg-red-500/5' : 'border-border bg-surface hover:border-primary/50'}`}>
                  <div className="shrink-0">
                    {answers[c.id] === true ? <CheckCircle size={18} className="text-green-500" /> : answers[c.id] === false ? <XCircle size={18} className="text-red-500" /> : <div className="w-[18px] h-[18px] rounded-full border-2 border-border" />}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-text">{c.label}</div>
                    <div className="text-[10px] text-text-muted">{c.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {answered.length > 0 && (
          <div className="bg-surface-alt rounded-xl p-4 border border-border">
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Trust Assessment</h4>
            <div className="text-center mb-3">
              <div className="text-3xl font-bold text-primary">{trustScore}%</div>
              <div className={`text-sm font-semibold ${riskColor}`}>{riskLevel}</div>
              {siteName && <div className="text-[10px] text-text-muted mt-1">for {siteName}</div>}
            </div>
            <div className="w-full bg-surface rounded-full h-3 mb-3">
              <div className={`h-3 rounded-full transition-all ${trustScore >= 80 ? 'bg-green-500' : trustScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${trustScore}%` }} />
            </div>
            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between"><span className="text-green-500">✅ Passed: {checked.length}/{CHECKLIST.length}</span></div>
              {unchecked.length > 0 && <div className="flex justify-between"><span className="text-red-500">❌ Failed: {unchecked.length}/{CHECKLIST.length}</span></div>}
            </div>
            {trustScore < 50 && <p className="text-xs text-red-500 mt-2 text-center">⚠️ Exercise caution with this site. Several trust signals are missing.</p>}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
