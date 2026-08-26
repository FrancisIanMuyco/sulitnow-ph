import type { Tool } from '../types';

export const toolRegistry: Tool[] = [
  // === MONEY ===
  { id: 'salary-calculator', name: 'Salary Calculator', slug: 'salary-calculator', description: 'Calculate your net salary after SSS, PhilHealth, and Pag-IBIG deductions', category: 'money', keywords: ['salary', 'sweldo', 'pay', 'income', 'net', 'gross', 'deduction', 'sss', 'philhealth', 'pag-ibig'], icon: 'Banknote', status: 'active', path: '/tools/salary-calculator', requiresApi: false },
  { id: 'daily-wage-calculator', name: 'Daily Wage Calculator', slug: 'daily-wage-calculator', description: 'Calculate your daily, hourly, and weekly wage rate', category: 'money', keywords: ['daily', 'wage', 'per', 'day', 'sweldo', 'hourly'], icon: 'Clock', status: 'active', path: '/tools/daily-wage-calculator', requiresApi: false },
  { id: 'ot-calculator', name: 'Overtime Calculator', slug: 'ot-calculator', description: 'Calculate overtime pay at 125% (regular) or 130% (rest day)', category: 'money', keywords: ['overtime', 'ot', 'extra', 'hours', 'pay', 'rest day'], icon: 'Timer', status: 'active', path: '/tools/ot-calculator', requiresApi: false },
  { id: 'night-differential', name: 'Night Differential Calculator', slug: 'night-differential', description: 'Calculate night differential pay (10% premium for 10PM-6AM work)', category: 'money', keywords: ['night', 'differential', 'graveyard', 'shift', 'pay', 'nd'], icon: 'Moon', status: 'active', path: '/tools/night-differential', requiresApi: false },
  { id: 'holiday-pay', name: 'Holiday Pay Calculator', slug: 'holiday-pay', description: 'Calculate regular holiday, special holiday, and rest day pay', category: 'money', keywords: ['holiday', 'rest', 'day', 'special', 'regular', 'pay', 'christmas'], icon: 'CalendarDays', status: 'active', path: '/tools/holiday-pay', requiresApi: false },
  { id: 'thirteenth-month', name: '13th Month Pay Estimate', slug: 'thirteenth-month', description: 'Estimate your mandatory 13th month pay', category: 'money', keywords: ['13th', 'month', 'bonus', 'estimate', 'year', 'mandatory'], icon: 'Gift', status: 'active', path: '/tools/thirteenth-month', requiresApi: false },
  { id: 'gcash-fee-calculator', name: 'GCash Fee Calculator', slug: 'gcash-fee-calculator', description: 'Calculate GCash transfer, bank, and cash-out fees', category: 'money', keywords: ['gcash', 'fee', 'transfer', 'cashout', 'send', 'money', 'bank'], icon: 'Wallet', status: 'active', path: '/tools/gcash-fee-calculator', requiresApi: false },
  { id: 'maya-fee-calculator', name: 'Maya Fee Calculator', slug: 'maya-fee-calculator', description: 'Calculate Maya transfer and cash-out fees', category: 'money', keywords: ['maya', 'paymaya', 'fee', 'transfer', 'cashout', 'send'], icon: 'Wallet', status: 'active', path: '/tools/maya-fee-calculator', requiresApi: false },
  { id: 'loan-calculator', name: 'Loan Calculator', slug: 'loan-calculator', description: 'Calculate monthly amortization with full schedule breakdown', category: 'money', keywords: ['loan', 'amortization', 'monthly', 'payment', 'interest', 'utang', 'bank'], icon: 'Landmark', status: 'active', path: '/tools/loan-calculator', requiresApi: false },
  { id: 'installment-calculator', name: 'Installment True Cost Calculator', slug: 'installment-calculator', description: 'See the real total cost of installment purchases including interest', category: 'money', keywords: ['installment', 'true', 'cost', 'interest', 'monthly', 'hulugan'], icon: 'CreditCard', status: 'active', path: '/tools/installment-calculator', requiresApi: false },
  { id: 'savings-goal', name: 'Savings Goal Calculator', slug: 'savings-goal', description: 'Plan how much to save daily, weekly, or monthly to reach your goal', category: 'money', keywords: ['savings', 'goal', 'plan', 'save', 'target', 'ipon'], icon: 'PiggyBank', status: 'active', path: '/tools/savings-goal', requiresApi: false },
  { id: 'daily-budget', name: 'Daily Budget Calculator', slug: 'daily-budget', description: 'Calculate your daily spending budget from monthly income', category: 'money', keywords: ['daily', 'budget', 'spend', 'allowance', 'per', 'day', 'gastos'], icon: 'Receipt', status: 'active', path: '/tools/daily-budget', requiresApi: false },
  { id: 'percentage-calculator', name: 'Percentage Calculator', slug: 'percentage-calculator', description: 'Quick percentage, increase, and decrease calculations', category: 'money', keywords: ['percentage', '%', 'percent', 'calculate', 'increase', 'decrease'], icon: 'Percent', status: 'active', path: '/tools/percentage-calculator', requiresApi: false },
  { id: 'currency-converter', name: 'Currency Converter', slug: 'currency-converter', description: 'Convert PHP to USD, EUR, JPY, and 15+ currencies with live BSP rates', category: 'money', keywords: ['currency', 'convert', 'exchange', 'usd', 'eur', 'dollar', 'euro', 'peso', 'forex', 'palitan'], icon: 'ArrowRightLeft', status: 'active', path: '/tools/currency-converter', requiresApi: false },

  // === SHOPPING ===
  { id: 'discount-calculator', name: 'Discount Calculator', slug: 'discount-calculator', description: 'Calculate discounts, double discounts, and final prices', category: 'shopping', keywords: ['discount', 'sale', 'promo', 'price', 'off', 'percent', 'diskwento'], icon: 'Tag', status: 'active', path: '/tools/discount-calculator', requiresApi: false },
  { id: 'unit-price-comparator', name: 'Unit Price Comparator', slug: 'unit-price-comparator', description: 'Compare products by unit price to find the best deal', category: 'shopping', keywords: ['unit', 'price', 'compare', 'per', 'kg', 'ml', 'best', 'deal', 'sulit'], icon: 'Scale', status: 'active', path: '/tools/unit-price-comparator', requiresApi: false },
  { id: 'installment-vs-cash', name: 'Installment vs Cash Comparator', slug: 'installment-vs-cash', description: 'Should you pay cash or installment? Compare the real cost', category: 'shopping', keywords: ['installment', 'cash', 'compare', 'versus', 'vs', 'buy', 'hulugan'], icon: 'ArrowLeftRight', status: 'active', path: '/tools/installment-vs-cash', requiresApi: false },
  { id: 'voucher-savings', name: 'Voucher Savings Calculator', slug: 'voucher-savings', description: 'Calculate savings from vouchers and promo codes', category: 'shopping', keywords: ['voucher', 'promo', 'code', 'coupon', 'save', 'discount'], icon: 'Ticket', status: 'active', path: '/tools/voucher-savings', requiresApi: false },
  { id: 'marketplace-fee', name: 'Marketplace Fee Calculator', slug: 'marketplace-fee', description: 'Calculate selling fees on Shopee, Lazada, and other marketplaces', category: 'shopping', keywords: ['marketplace', 'shopee', 'lazada', 'fee', 'seller', 'commission'], icon: 'Store', status: 'active', path: '/tools/marketplace-fee', requiresApi: false },
  { id: 'grocery-comparator', name: 'Grocery Price Comparator', slug: 'grocery-comparator', description: 'Compare grocery prices by unit to save more', category: 'shopping', keywords: ['grocery', 'price', 'compare', 'groceries', 'market', 'palengke'], icon: 'ShoppingCart', status: 'active', path: '/tools/grocery-comparator', requiresApi: false },

  // === DAILY / BILLS ===
  { id: 'fuel-calculator', name: 'Fuel Cost Calculator', slug: 'fuel-calculator', description: 'Estimate daily, weekly, and monthly fuel expenses', category: 'daily', keywords: ['fuel', 'gas', 'gasoline', 'diesel', 'trip', 'cost', 'gasolina'], icon: 'Fuel', status: 'active', path: '/tools/fuel-calculator', requiresApi: false },
  { id: 'fuel-consumption', name: 'Fuel Consumption Calculator', slug: 'fuel-consumption', description: 'Calculate your vehicle fuel efficiency (km/L)', category: 'daily', keywords: ['fuel', 'consumption', 'efficiency', 'km', 'per', 'liter', 'mpg'], icon: 'Gauge', status: 'active', path: '/tools/fuel-consumption', requiresApi: false },
  { id: 'electricity-calculator', name: 'Electricity Cost Calculator', slug: 'electricity-calculator', description: 'Estimate monthly electricity cost from kWh usage', category: 'daily', keywords: ['electricity', 'electric', 'bill', 'kwh', 'power', 'kuryente', 'meralco'], icon: 'Zap', status: 'active', path: '/tools/electricity-calculator', requiresApi: false },
  { id: 'appliance-cost', name: 'Appliance Electricity Cost', slug: 'appliance-cost', description: 'Calculate how much each appliance costs to run per month', category: 'daily', keywords: ['appliance', 'electricity', 'cost', 'run', 'watt', 'power', 'kuryente'], icon: 'Plug', status: 'active', path: '/tools/appliance-cost', requiresApi: false },
  { id: 'monthly-expenses', name: 'Monthly Expense Planner', slug: 'monthly-expenses', description: 'Plan and track your monthly expenses', category: 'daily', keywords: ['monthly', 'expense', 'plan', 'track', 'budget', 'bills', 'gastos'], icon: 'ClipboardList', status: 'active', path: '/tools/monthly-expenses', requiresApi: false },
  { id: 'savings-challenge', name: 'Savings Challenge', slug: 'savings-challenge', description: 'Follow savings challenges to build your savings', category: 'daily', keywords: ['savings', 'challenge', 'save', 'money', 'goal', 'ipon'], icon: 'Trophy', status: 'active', path: '/tools/savings-challenge', requiresApi: false },
  { id: 'subscription-tracker', name: 'Subscription Cost Tracker', slug: 'subscription-tracker', description: 'Track all your monthly subscription costs', category: 'daily', keywords: ['subscription', 'tracker', 'monthly', 'cost', 'streaming', 'apps'], icon: 'ListChecks', status: 'active', path: '/tools/subscription-tracker', requiresApi: false },

  // === MOBILE ===
  { id: 'load-promo-finder', name: 'Load Promo Finder', slug: 'load-promo-finder', description: 'Find the best load promos for Smart, TNT, Globe, TM, DITO', category: 'mobile', keywords: ['load', 'promo', 'smart', 'globe', 'tnt', 'tm', 'dito', 'mobile', 'internet', 'prepaid'], icon: 'Smartphone', status: 'active', path: '/tools/load-promo-finder', requiresApi: false },
  { id: 'promo-comparator', name: 'Promo Comparator', slug: 'promo-comparator', description: 'Compare mobile promos side by side to find the most sulit', category: 'mobile', keywords: ['compare', 'promo', 'side', 'side', 'best', 'sulit', 'compare'], icon: 'ArrowLeftRight', status: 'active', path: '/tools/promo-comparator', requiresApi: false },
  { id: 'data-usage-calculator', name: 'Data Usage Calculator', slug: 'data-usage-calculator', description: 'Calculate how much mobile data you actually need per month', category: 'mobile', keywords: ['data', 'usage', 'calculator', 'gb', 'mb', 'internet', 'mobile'], icon: 'Wifi', status: 'active', path: '/tools/data-usage-calculator', requiresApi: false },
  { id: 'cost-per-gb', name: 'Cost Per GB Calculator', slug: 'cost-per-gb', description: 'Find out how much you pay per GB of mobile data', category: 'mobile', keywords: ['cost', 'gb', 'price', 'per', 'value', 'compare', 'data'], icon: 'Calculator', status: 'active', path: '/tools/cost-per-gb', requiresApi: false },
  { id: 'internet-plan-comparator', name: 'Internet Plan Comparator', slug: 'internet-plan-comparator', description: 'Compare home internet plans by price per Mbps', category: 'mobile', keywords: ['internet', 'plan', 'compare', 'fiber', 'home', 'broadband', 'wifi'], icon: 'Globe', status: 'active', path: '/tools/internet-plan-comparator', requiresApi: false },
  { id: 'mobile-data-budget', name: 'Mobile Data Budget Planner', slug: 'mobile-data-budget', description: 'Plan your monthly mobile data spending', category: 'mobile', keywords: ['budget', 'plan', 'monthly', 'spending', 'data', 'load'], icon: 'Wallet', status: 'active', path: '/tools/mobile-data-budget', requiresApi: false },

  // === TRANSPORT ===
  { id: 'commute-cost', name: 'Commute Cost Calculator', slug: 'commute-cost', description: 'Compare daily commute costs: jeep, bus, train, motorcycle', category: 'daily', keywords: ['commute', 'jeep', 'bus', 'train', 'motor', 'fare', 'travel', 'biyahe'], icon: 'Bus', status: 'active', path: '/tools/commute-cost', requiresApi: false },

  // === FOOD ===
  { id: 'bill-splitter', name: 'Bill Splitter', slug: 'bill-splitter', description: 'Split restaurant bills evenly including tip', category: 'daily', keywords: ['bill', 'split', 'restaurant', 'tip', 'share', 'food', 'kaon'], icon: 'Users', status: 'active', path: '/tools/bill-splitter', requiresApi: false },

  // === STUDENTS ===
  { id: 'gwa-calculator', name: 'GWA Calculator', slug: 'gwa-calculator', description: 'Calculate your General Weighted Average (GWA) for school', category: 'money', keywords: ['gwa', 'general', 'weighted', 'average', 'grade', 'school', 'student', 'college', 'university'], icon: 'GraduationCap', status: 'active', path: '/tools/gwa-calculator', requiresApi: false },

  // === SAFETY ===
  { id: 'url-checker', name: 'Suspicious URL Checker', slug: 'url-checker', description: 'Check if a URL has suspicious characteristics', category: 'safety', keywords: ['url', 'check', 'suspicious', 'scam', 'phishing', 'link', 'fake'], icon: 'ShieldAlert', status: 'active', path: '/tools/url-checker', requiresApi: false },
  { id: 'website-risk', name: 'Website Risk Signals', slug: 'website-risk', description: 'Identify risk signals on websites before you trust them', category: 'safety', keywords: ['website', 'risk', 'signals', 'check', 'safe', 'trust'], icon: 'ShieldCheck', status: 'active', path: '/tools/website-risk', requiresApi: false },

  // === RAKET ===
  { id: 'raketcheck', name: 'RaketCheck PH', slug: 'raketcheck', description: 'Check earning platforms, side hustles, and online jobs', category: 'raket', keywords: ['raket', 'earn', 'side', 'hustle', 'income', 'job', 'online', 'freelance'], icon: 'Briefcase', status: 'active', path: '/tools/raketcheck', requiresApi: false },

  // === NEW TOOLS (2026 Data) ===
  { id: 'take-home-pay', name: 'Take-Home Pay Calculator', slug: 'take-home-pay', description: 'Compute net salary after SSS, PhilHealth, Pag-IBIG, and BIR tax using 2026 tables', category: 'money', keywords: ['take-home', 'net', 'pay', 'salary', 'sss', 'philhealth', 'pag-ibig', 'tax', 'bir', 'deduction', 'sweldo', 'neto'], icon: 'Calculator', status: 'active', path: '/tools/take-home-pay', requiresApi: false },
  { id: 'transport-fare', name: 'Transport Fare Calculator', slug: 'transport-fare', description: 'Check jeepney, LRT-1, LRT-2, MRT-3 fares and monthly commute cost', category: 'daily', keywords: ['transport', 'fare', 'jeepney', 'lrt', 'mrt', 'train', 'commute', 'biyahe', 'pamasahe', 'lrt-1', 'lrt-2', 'mrt-3'], icon: 'Train', status: 'active', path: '/tools/transport-fare', requiresApi: false },
  { id: 'lto-fee-calculator', name: 'LTO Registration Fee Calculator', slug: 'lto-fee-calculator', description: 'Estimate LTO vehicle registration fees for motorcycle, car, or PUV', category: 'daily', keywords: ['lto', 'registration', 'vehicle', 'car', 'motorcycle', 'renewal', 'mvuc', 'plate'], icon: 'Car', status: 'active', path: '/tools/lto-fee-calculator', requiresApi: false },
  { id: 'weather-checker', name: 'PAGASA Weather Checker', slug: 'weather-checker', description: 'Check current Philippine weather, typhoon signals, and forecasts', category: 'daily', keywords: ['weather', 'pagasa', 'typhoon', 'signal', 'rain', 'ulan', 'bagyo', 'forecast'], icon: 'CloudRain', status: 'active', path: '/tools/weather-checker', requiresApi: false },
  { id: 'seller-fee-calculator', name: 'Shopee/Lazada Seller Fee Calculator', slug: 'seller-fee-calculator', description: 'Compute seller fees and net profit for Shopee, Lazada, TikTok Shop', category: 'shopping', keywords: ['shopee', 'lazada', 'tiktok', 'seller', 'fee', 'commission', 'net', 'profit', 'marketplace'], icon: 'Store', status: 'active', path: '/tools/seller-fee-calculator', requiresApi: false },

  // === ADDITIONAL TOOLS ===
  { id: 'tip-calculator', name: 'Tip Calculator', slug: 'tip-calculator', description: 'Calculate tip amount and split bills with friends', category: 'daily', keywords: ['tip', 'bill', 'split', 'restaurant', 'food', 'kaon', 'gratuity'], icon: 'Utensils', status: 'active', path: '/tools/tip-calculator', requiresApi: false },
  { id: 'bmi-calculator', name: 'BMI Calculator', slug: 'bmi-calculator', description: 'Calculate your Body Mass Index and weight category', category: 'daily', keywords: ['bmi', 'body', 'mass', 'index', 'weight', 'health', 'fitness'], icon: 'Activity', status: 'active', path: '/tools/bmi-calculator', requiresApi: false },
  { id: 'age-calculator', name: 'Age Calculator', slug: 'age-calculator', description: 'Calculate your exact age in years, months, days, and more', category: 'daily', keywords: ['age', 'birthday', 'years', 'old', 'zodiac', 'calculator'], icon: 'Cake', status: 'active', path: '/tools/age-calculator', requiresApi: false },
  { id: 'emergency-fund', name: 'Emergency Fund Calculator', slug: 'emergency-fund', description: 'Calculate how much you need for an emergency fund', category: 'money', keywords: ['emergency', 'fund', 'savings', 'safety', 'ipon', 'reserve'], icon: 'Shield', status: 'active', path: '/tools/emergency-fund', requiresApi: false },
  { id: 'debt-payoff', name: 'Debt Payoff Calculator', slug: 'debt-payoff', description: 'Plan your debt payoff with snowball or avalanche strategy', category: 'money', keywords: ['debt', 'payoff', 'credit', 'card', 'loan', 'utang', 'snowball'], icon: 'TrendingDown', status: 'active', path: '/tools/debt-payoff', requiresApi: false },
  { id: 'salary-increase', name: 'Salary Increase Calculator', slug: 'salary-increase', description: 'See the impact of a salary raise on your income', category: 'money', keywords: ['salary', 'increase', 'raise', 'sweldo', 'hike', 'promotion'], icon: 'TrendingUp', status: 'active', path: '/tools/salary-increase', requiresApi: false },
  { id: 'compound-interest', name: 'Compound Interest Calculator', slug: 'compound-interest', description: 'See how your money grows with compound interest', category: 'money', keywords: ['compound', 'interest', 'invest', 'grow', 'money', 'ipon', 'bank'], icon: 'LineChart', status: 'active', path: '/tools/compound-interest', requiresApi: false },
  { id: 'room-area', name: 'Room Area & Paint Calculator', slug: 'room-area', description: 'Calculate room area, wall area, and paint needed', category: 'daily', keywords: ['room', 'area', 'paint', 'wall', 'floor', 'sqm', 'square', 'meter'], icon: 'Ruler', status: 'active', path: '/tools/room-area', requiresApi: false },
  { id: 'freight-calculator', name: 'Shipping Cost Calculator', slug: 'freight-calculator', description: 'Compare shipping rates across J&T, Flash, JRS, Grab, Lalamove', category: 'shopping', keywords: ['shipping', 'freight', 'courier', 'delivery', 'j&t', 'flash', 'jrs'], icon: 'Truck', status: 'active', path: '/tools/freight-calculator', requiresApi: false },
  { id: 'body-fat', name: 'Body Fat Calculator', slug: 'body-fat', description: 'Estimate body fat percentage using the US Navy method', category: 'daily', keywords: ['body', 'fat', 'percentage', 'navy', 'health', 'fitness'], icon: 'Activity', status: 'active', path: '/tools/body-fat', requiresApi: false },

  // === BATCH 3 TOOLS ===
  { id: 'water-bill-calculator', name: 'Water Bill Calculator', slug: 'water-bill', description: 'Estimate your monthly water bill based on consumption', category: 'daily', keywords: ['water', 'bill', 'manila water', 'maynilad', 'consumption', 'tubig', 'utility'], icon: 'Droplets', status: 'active', path: '/tools/water-bill', requiresApi: false },
  { id: 'ideal-weight-calculator', name: 'Ideal Weight Calculator', slug: 'ideal-weight', description: 'Find your ideal body weight using multiple proven formulas', category: 'daily', keywords: ['ideal', 'weight', 'body', 'mass', 'health', 'bmi', 'timbang'], icon: 'Scale', status: 'active', path: '/tools/ideal-weight', requiresApi: false },
  { id: 'calorie-calculator', name: 'Calorie & Macro Calculator', slug: 'calorie-calculator', description: 'Calculate your daily calorie needs and macro breakdown', category: 'daily', keywords: ['calorie', 'calories', 'macro', 'protein', 'carbs', 'fat', 'diet', 'nutrition'], icon: 'Flame', status: 'active', path: '/tools/calorie-calculator', requiresApi: false },
  { id: 'travel-budget', name: 'Travel Budget Planner', slug: 'travel-budget', description: 'Plan and estimate the total cost of your trip in the Philippines', category: 'daily', keywords: ['travel', 'budget', 'trip', 'vacation', 'tour', 'biyahe', 'lakbay'], icon: 'Map', status: 'active', path: '/tools/travel-budget', requiresApi: false },
  { id: 'vehicle-trip-cost', name: 'Vehicle Trip Cost Calculator', slug: 'vehicle-trip-cost', description: 'Estimate fuel + toll + parking cost for your road trip', category: 'daily', keywords: ['vehicle', 'trip', 'road', 'fuel', 'toll', 'parking', 'cost', 'driving'], icon: 'Car', status: 'active', path: '/tools/vehicle-trip-cost', requiresApi: false },
  { id: 'time-zone-converter', name: 'Time Zone Converter', slug: 'time-zone-converter', description: 'Convert Philippine time to other countries — for OFWs and freelancers', category: 'daily', keywords: ['time', 'zone', 'timezone', 'ofw', 'freelancer', 'clock', 'oraa'], icon: 'Clock', status: 'active', path: '/tools/time-zone-converter', requiresApi: false },
  { id: 'password-strength', name: 'Password Strength Checker', slug: 'password-strength', description: 'Check how strong your password is and estimated crack time', category: 'safety', keywords: ['password', 'strength', 'security', 'crack', 'hack', 'safe', 'protect'], icon: 'Key', status: 'active', path: '/tools/password-strength', requiresApi: false },
  { id: 'income-tax-calculator', name: 'Income Tax Calculator (BIR TRAIN)', slug: 'income-tax', description: 'Calculate your income tax under the BIR TRAIN Law (2026)', category: 'money', keywords: ['income', 'tax', 'bir', 'train', 'withholding', 'taxes', 'buwis'], icon: 'FileText', status: 'active', path: '/tools/income-tax', requiresApi: false },
  { id: 'retirement-calculator', name: 'Retirement Calculator', slug: 'retirement-calculator', description: 'Plan when you can retire and how much you need to save', category: 'money', keywords: ['retirement', 'retire', 'pension', 'savings', 'future', 'old age'], icon: 'Sunset', status: 'active', path: '/tools/retirement-calculator', requiresApi: false },
  { id: 'parking-cost-calculator', name: 'Parking Cost Calculator', slug: 'parking-cost', description: 'Compare parking rates across SM, Ayala, Robinsons, airports', category: 'daily', keywords: ['parking', 'cost', 'sm', 'ayala', 'robinsons', 'mall', 'airport', 'parada'], icon: 'ParkingSquare', status: 'active', path: '/tools/parking-cost', requiresApi: false },
];

export const categories = [
  { id: 'money' as const, name: 'Money', icon: 'Banknote', description: 'Salary, fees, loans, and financial calculators' },
  { id: 'shopping' as const, name: 'Shopping', icon: 'ShoppingBag', description: 'Discounts, comparisons, and deal finders' },
  { id: 'daily' as const, name: 'Bills & Daily', icon: 'Home', description: 'Electricity, fuel, commute, and expense tools' },
  { id: 'mobile' as const, name: 'Mobile & Internet', icon: 'Smartphone', description: 'Load promos, data plans, and network tools' },
  { id: 'safety' as const, name: 'Safety', icon: 'Shield', description: 'URL checks, scam reports, and trust scores' },
  { id: 'raket' as const, name: 'Raket / Earning', icon: 'Briefcase', description: 'Side hustles, online jobs, and earning platforms' },
] as const;

export const popularTools = [
  'salary-calculator',
  'gwa-calculator',
  'discount-calculator',
  'gcash-fee-calculator',
  'loan-calculator',
  'fuel-calculator',
  'data-usage-calculator',
  'unit-price-comparator',
  'daily-budget',
  'bill-splitter',
  'electricity-calculator',
  'percentage-calculator',
];

export const quickActions = [
  { toolId: 'take-home-pay', label: 'Take-Home Pay', icon: 'Calculator' },
  { toolId: 'salary-calculator', label: 'Calculate Salary', icon: 'Banknote' },
  { toolId: 'gwa-calculator', label: 'Calculate GWA', icon: 'GraduationCap' },
  { toolId: 'load-promo-finder', label: 'Find Load Promo', icon: 'Smartphone' },
  { toolId: 'discount-calculator', label: 'Check Discount', icon: 'Tag' },
  { toolId: 'fuel-calculator', label: 'Fuel Cost', icon: 'Fuel' },
  { toolId: 'weather-checker', label: 'Weather', icon: 'CloudRain' },
  { toolId: 'transport-fare', label: 'Transport Fare', icon: 'Train' },
];
