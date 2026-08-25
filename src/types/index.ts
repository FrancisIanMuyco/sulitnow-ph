export type ToolCategory = 'mobile' | 'money' | 'shopping' | 'daily' | 'safety' | 'raket';

export type ToolStatus = 'active' | 'coming-soon' | 'demo' | 'beta';

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ToolCategory;
  keywords: string[];
  icon: string;
  status: ToolStatus;
  path: string;
  requiresApi: boolean;
  dataFreshness?: string;
}

export interface SulitScore {
  score: number;
  factors: SulitFactor[];
  explanation: string;
}

export interface SulitFactor {
  name: string;
  value: number;
  weight: number;
  description: string;
}

export interface Promo {
  id: string;
  network: string;
  name: string;
  price: number;
  data?: string;
  calls?: string;
  texts?: string;
  validity: number; // days
  description?: string;
}

export interface CalculatorInput {
  [key: string]: number | string;
}

export interface CalculatorResult {
  value: number;
  unit: string;
  label: string;
  recommendation?: string;
}

export interface ComparisonResult {
  best: ComparisonOption;
  alternatives: ComparisonOption[];
  savings?: number;
  explanation: string;
}

export interface ComparisonOption {
  id: string;
  name: string;
  price: number;
  value: number;
  unit: string;
  costPerUnit: number;
  sulitScore: number;
}

export interface ServiceStatus {
  id: string;
  name: string;
  category: string;
  status: 'operational' | 'issues' | 'major' | 'no-data';
  lastUpdated?: string;
  reports: StatusReport[];
}

export interface StatusReport {
  id: string;
  message: string;
  timestamp: string;
  source: 'community' | 'official';
}

export interface RaketPlatform {
  id: string;
  name: string;
  category: string;
  minPayout: string;
  paymentMethods: string[];
  communityReports: {
    successful: number;
    failed: number;
  };
  trustScore: number;
  lastUpdated: string;
  description: string;
}
