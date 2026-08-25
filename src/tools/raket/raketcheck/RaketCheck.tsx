import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';
import { toolRegistry } from '../../../constants/toolRegistry';
import { Briefcase, Search, Star, AlertTriangle, CheckCircle } from 'lucide-react';

const tool = toolRegistry.find(t => t.id === 'raketcheck')!;

interface Platform {
  name: string;
  category: string;
  payoutMin: string;
  paymentMethods: string[];
  trustScore: number;
  status: 'verified' | 'mixed' | 'caution' | 'unverified';
  reports: { success: number; failed: number; pending: number };
  description: string;
  pros: string[];
  cons: string[];
  lastUpdated: string;
}

const PLATFORMS: Platform[] = [
  { name: 'Upwork', category: 'Freelance', payoutMin: '$100', paymentMethods: ['PayPal', 'Bank', 'Wire'], trustScore: 9, status: 'verified', reports: { success: 500, failed: 20, pending: 30 }, description: 'Global freelance marketplace', pros: ['High-paying projects', 'Escrow protection', 'Wide categories'], cons: ['Competitive', 'Service fees', 'Takes time to build profile'], lastUpdated: 'Aug 2026' },
  { name: 'Fiverr', category: 'Freelance', payoutMin: '$50', paymentMethods: ['PayPal', 'Bank'], trustScore: 8.5, status: 'verified', reports: { success: 400, failed: 15, pending: 25 }, description: 'Freelance services marketplace', pros: ['Easy to start', 'Various skill levels', 'Quick first earnings'], cons: ['20% fee', 'Race to bottom pricing', 'High competition'], lastUpdated: 'Aug 2026' },
  { name: 'Remotasks', category: 'Microtasks', payoutMin: '$5', paymentMethods: ['PayPal', 'GCash'], trustScore: 7, status: 'verified', reports: { success: 300, failed: 50, pending: 40 }, description: 'AI training tasks and data labeling', pros: ['No experience needed', 'Flexible hours', 'GCash payout'], cons: ['Low pay per task', 'Task availability varies', 'Can be repetitive'], lastUpdated: 'Aug 2026' },
  { name: 'Swagbucks', category: 'Surveys', payoutMin: '$5', paymentMethods: ['PayPal', 'Gift Cards'], trustScore: 7.5, status: 'verified', reports: { success: 250, failed: 30, pending: 20 }, description: 'Surveys, watching videos, shopping rewards', pros: ['Multiple earning methods', 'Low payout threshold', 'Established since 2008'], cons: ['Low pay per survey', 'Disqualification common', 'Gift cards more common than cash'], lastUpdated: 'Aug 2026' },
  { name: 'GCash GForest', category: 'Microtasks', payoutMin: '₱0', paymentMethods: ['GCash'], trustScore: 9, status: 'verified', reports: { success: 200, failed: 5, pending: 0 }, description: 'Earn green energy through GCash transactions', pros: ['Zero risk', 'Earn from normal spending', 'Plant real trees'], cons: ['Small rewards only', 'Tied to GCash usage'], lastUpdated: 'Aug 2026' },
  { name: 'Shopee Affiliate', category: 'Affiliate', payoutMin: '₱300', paymentMethods: ['Shopee Wallet', 'Bank'], trustScore: 8, status: 'verified', reports: { success: 180, failed: 10, pending: 15 }, description: 'Earn commission from Shopee product referrals', pros: ['Trusted platform', 'Many products', 'Easy sharing'], cons: ['Commission varies', 'Need social following', 'Approval process'], lastUpdated: 'Aug 2026' },
  { name: 'TikTok Creator Fund', category: 'Content', payoutMin: '$50', paymentMethods: ['PayPal'], trustScore: 6, status: 'mixed', reports: { success: 100, failed: 80, pending: 50 }, description: 'Earn from TikTok content creation', pros: ['Fun to create', 'Viral potential', 'Growing platform'], cons: ['Requires large following', 'Inconsistent earnings', 'Algorithm changes'], lastUpdated: 'Aug 2026' },
  { name: 'Philippine Survey Apps', category: 'Surveys', payoutMin: '₱100', paymentMethods: ['GCash', 'PayMaya'], trustScore: 5, status: 'mixed', reports: { success: 120, failed: 100, pending: 30 }, description: 'Various PH survey apps (Toluna, Mobrog, etc)', pros: ['Pay in PHP', 'GCash payout', 'No skills needed'], cons: ['Very low pay', 'High disqualification rate', 'Time-consuming'], lastUpdated: 'Aug 2026' },
];

const CATEGORIES = ['All', 'Freelance', 'Microtasks', 'Surveys', 'Affiliate', 'Content'];

export default function RaketCheck() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = PLATFORMS.filter(p => {
    if (filter !== 'All' && p.category !== filter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusConfig = {
    verified: { icon: <CheckCircle size={14} className="text-green-500" />, label: 'Verified', color: 'text-green-500' },
    mixed: { icon: <AlertTriangle size={14} className="text-yellow-500" />, label: 'Mixed Reports', color: 'text-yellow-500' },
    caution: { icon: <AlertTriangle size={14} className="text-red-500" />, label: 'Use Caution', color: 'text-red-500' },
    unverified: { icon: <AlertTriangle size={14} className="text-text-muted" />, label: 'Unverified', color: 'text-text-muted' },
  };

  return (
    <ToolLayout tool={tool}>
      <div className="p-4 space-y-4">
        <div className="bg-surface-alt rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase size={18} className="text-primary" />
            <h3 className="text-sm font-semibold text-text">RaketCheck PH</h3>
          </div>
          <div className="text-[10px] text-text-muted mb-3">⚠️ Always verify earning claims independently. No guaranteed income.</div>
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search platforms..." className="w-full pl-8 pr-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border ${filter === c ? 'bg-primary text-white border-primary' : 'bg-surface text-text-muted border-border'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filtered.map(p => {
            const sc = statusConfig[p.status];
            const isOpen = expanded === p.name;
            return (
              <div key={p.name} className="bg-surface-alt rounded-xl border border-border overflow-hidden">
                <button onClick={() => setExpanded(isOpen ? null : p.name)} className="w-full p-3 text-left">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-text">{p.name}</span>
                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">{p.category}</span>
                      </div>
                      <div className="text-[10px] text-text-muted mt-0.5">{p.description}</div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <div className="flex items-center gap-1">{sc.icon}<span className={`text-[10px] font-semibold ${sc.color}`}>{sc.label}</span></div>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        <Star size={10} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold text-text">{p.trustScore}/10</span>
                      </div>
                    </div>
                  </div>
                </button>
                {isOpen && (
                  <div className="px-3 pb-3 space-y-3 border-t border-border pt-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-surface rounded-lg p-2 text-center border border-border">
                        <div className="text-[10px] text-text-muted">Payout Min</div>
                        <div className="text-xs font-bold text-text">{p.payoutMin}</div>
                      </div>
                      <div className="bg-surface rounded-lg p-2 text-center border border-border">
                        <div className="text-[10px] text-text-muted">Success</div>
                        <div className="text-xs font-bold text-green-500">{p.reports.success}</div>
                      </div>
                      <div className="bg-surface rounded-lg p-2 text-center border border-border">
                        <div className="text-[10px] text-text-muted">Failed</div>
                        <div className="text-xs font-bold text-red-500">{p.reports.failed}</div>
                      </div>
                    </div>
                    <div className="text-[10px]">
                      <div className="font-semibold text-text-muted mb-1">Payment: {p.paymentMethods.join(', ')}</div>
                      <div className="font-semibold text-green-500 mb-1">✅ {p.pros.join(' • ')}</div>
                      <div className="font-semibold text-red-500">❌ {p.cons.join(' • ')}</div>
                      <div className="text-text-muted mt-1">Updated: {p.lastUpdated}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-surface-alt rounded-xl border border-border text-[10px] text-text-muted text-center">
          📊 Data from community reports. Always do your own research before joining any platform.
        </div>
      </div>
    </ToolLayout>
  );
}
