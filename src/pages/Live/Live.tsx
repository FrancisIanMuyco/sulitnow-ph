import { AlertCircle, Wifi, Clock, Info } from 'lucide-react';

interface LiveService {
  id: string;
  name: string;
  category: string;
  status: 'operational' | 'issues' | 'major' | 'no-data';
  lastUpdated?: string;
  reports: number;
}

const services: LiveService[] = [
  { id: 'smart', name: 'Smart', category: 'Network', status: 'no-data', reports: 0 },
  { id: 'tnt', name: 'TNT', category: 'Network', status: 'no-data', reports: 0 },
  { id: 'globe', name: 'Globe', category: 'Network', status: 'no-data', reports: 0 },
  { id: 'tm', name: 'TM', category: 'Network', status: 'no-data', reports: 0 },
  { id: 'dito', name: 'DITO', category: 'Network', status: 'no-data', reports: 0 },
  { id: 'gcash', name: 'GCash', category: 'E-Wallet', status: 'no-data', reports: 0 },
  { id: 'maya', name: 'Maya', category: 'E-Wallet', status: 'no-data', reports: 0 },
  { id: 'bdo', name: 'BDO', category: 'Bank', status: 'no-data', reports: 0 },
  { id: 'bpi', name: 'BPI', category: 'Bank', status: 'no-data', reports: 0 },
  { id: 'landbank', name: 'Landbank', category: 'Bank', status: 'no-data', reports: 0 },
];

const statusConfig = {
  operational: { icon: '🟢', label: 'Operational', color: 'bg-green-50 border-green-200 text-green-800' },
  issues: { icon: '🟡', label: 'Possible Issues', color: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
  major: { icon: '🔴', label: 'Major Reports', color: 'bg-red-50 border-red-200 text-red-800' },
  'no-data': { icon: '⚪', label: 'No Current Data', color: 'bg-gray-50 border-gray-200 text-gray-600' },
};

export default function Live() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text mb-1 flex items-center gap-2">
          <Wifi size={24} className="text-primary" />
          LIVE PH
        </h1>
        <p className="text-sm text-text-secondary">
          Check the status of networks, e-wallets, banks, and popular services
        </p>
      </div>

      {/* Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6 flex items-start gap-3">
        <Info size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
        <div className="text-sm text-blue-800 dark:text-blue-300">
          <p className="font-medium mb-1">No live source connected yet.</p>
          <p className="text-xs">Live status data will be available when community reports and API sources are connected. Currently showing placeholder architecture.</p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="space-y-4">
        {['Network', 'E-Wallet', 'Bank'].map((category) => (
          <div key={category}>
            <h2 className="text-sm font-semibold text-text mb-3">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services
                .filter((s) => s.category === category)
                .map((service) => {
                  const config = statusConfig[service.status];
                  return (
                    <div
                      key={service.id}
                      className={`border rounded-xl p-4 ${config.color}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{service.name}</span>
                        <span className="text-sm">{config.icon}</span>
                      </div>
                      <p className="text-xs mt-1 opacity-80">{config.label}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs opacity-60">
                        <Clock size={10} />
                        <span>No data source</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* Community Reports Section */}
      <div className="mt-8 bg-surface-alt border border-border rounded-xl p-6 text-center">
        <AlertCircle size={32} className="text-text-muted mx-auto mb-3" />
        <h3 className="font-semibold text-sm text-text mb-1">Community Reports</h3>
        <p className="text-xs text-text-muted max-w-md mx-auto">
          Report outages and issues to help the community. Community reporting will be available when the backend is connected.
        </p>
        <p className="text-xs text-primary mt-3 font-medium">Coming Soon</p>
      </div>
    </div>
  );
}
