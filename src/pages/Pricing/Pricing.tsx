import { Check, X, Crown, Sparkles, Star } from 'lucide-react';

const plans = [
  {
    name: 'FREE',
    price: '₱0',
    period: '',
    description: 'Get started with essential tools',
    icon: Sparkles,
    color: 'border-border',
    buttonVariant: 'outline' as const,
    features: [
      { text: 'All basic calculators', included: true },
      { text: 'Basic comparisons', included: true },
      { text: 'Tool search & discovery', included: true },
      { text: 'Mobile-first design', included: true },
      { text: 'Ads-ready', included: true },
      { text: 'Saved history', included: false },
      { text: 'Favorites & alerts', included: false },
      { text: 'Advanced comparisons', included: false },
    ],
  },
  {
    name: 'PLUS',
    price: '₱49',
    period: '/month',
    description: 'Power user features',
    icon: Star,
    color: 'border-primary',
    popular: true,
    buttonVariant: 'primary' as const,
    features: [
      { text: 'Everything in FREE', included: true },
      { text: 'No ads', included: true },
      { text: 'Saved history', included: true },
      { text: 'Favorites', included: true },
      { text: 'Alerts & notifications', included: true },
      { text: 'More comparisons', included: true },
      { text: 'Custom trackers', included: false },
      { text: 'Early access tools', included: false },
    ],
  },
  {
    name: 'PRO',
    price: '₱99',
    period: '/month',
    description: 'Full power for serious users',
    icon: Crown,
    color: 'border-accent',
    buttonVariant: 'outline' as const,
    features: [
      { text: 'Everything in PLUS', included: true },
      { text: 'Advanced comparisons', included: true },
      { text: 'Unlimited alerts', included: true },
      { text: 'Custom trackers', included: true },
      { text: 'Early access tools', included: true },
      { text: 'API access (future)', included: true },
      { text: 'Priority support', included: true },
      { text: 'Exclusive features', included: true },
    ],
  },
];

export default function Pricing() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text mb-2">Simple, Transparent Pricing</h1>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          Start free, upgrade when you need more power. No hidden fees.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.name}
              className={`relative bg-white dark:bg-slate-800 border-2 ${plan.color} rounded-2xl p-6 ${
                plan.popular ? 'md:-translate-y-2 card-shadow-lg' : 'card-shadow'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Icon size={16} />
                </div>
                <h3 className="font-bold text-text">{plan.name}</h3>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-text">{plan.price}</span>
                {plan.period && (
                  <span className="text-sm text-text-muted">{plan.period}</span>
                )}
              </div>
              <p className="text-xs text-text-secondary mb-4">{plan.description}</p>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-center gap-2 text-sm">
                    {feature.included ? (
                      <Check size={14} className="text-green-500 shrink-0" />
                    ) : (
                      <X size={14} className="text-text-muted/40 shrink-0" />
                    )}
                    <span className={feature.included ? 'text-text' : 'text-text-muted/50'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  plan.buttonVariant === 'primary'
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'border border-border text-text hover:bg-surface-alt'
                }`}
              >
                {plan.price === '₱0' ? 'Get Started' : 'Coming Soon'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Founders */}
      <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 text-center mb-8">
        <h3 className="font-bold text-text mb-1">🏆 PHCorner Founders</h3>
        <p className="text-2xl font-bold text-accent mb-2">₱299 Lifetime</p>
        <p className="text-xs text-text-secondary mb-4">
          One-time payment. All features. Forever. Limited slots for early supporters.
        </p>
        <button className="bg-accent hover:bg-accent-light text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
          Coming Soon
        </button>
      </div>

      <div className="text-center text-xs text-text-muted">
        <p>All payment integration is coming soon. No payment is processed at this time.</p>
        <p className="mt-1">Basic tools are always free. No signup required.</p>
      </div>
    </div>
  );
}
