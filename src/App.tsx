import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Lazy load pages
const Home = lazy(() => import('./pages/Home/Home'));
const Tools = lazy(() => import('./pages/Tools/Tools'));
const Live = lazy(() => import('./pages/Live/Live'));
const Deals = lazy(() => import('./pages/Deals/Deals'));
const Raket = lazy(() => import('./pages/Raket/Raket'));
const Pricing = lazy(() => import('./pages/Pricing/Pricing'));
const About = lazy(() => import('./pages/About'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Lazy load tools
const SalaryCalculator = lazy(() => import('./tools/money/salary/SalaryCalculator'));
const DailyWageCalculator = lazy(() => import('./tools/money/daily-wage/DailyWageCalculator'));
const OTCalculator = lazy(() => import('./tools/money/ot/OTCalculator'));
const NightDifferentialCalculator = lazy(() => import('./tools/money/night-diff/NightDifferentialCalculator'));
const HolidayPayCalculator = lazy(() => import('./tools/money/holiday/HolidayPayCalculator'));
const ThirteenthMonthCalculator = lazy(() => import('./tools/money/13th-month/ThirteenthMonthCalculator'));
const GcashFeeCalculator = lazy(() => import('./tools/money/gcash/GcashFeeCalculator'));
const MayaFeeCalculator = lazy(() => import('./tools/money/maya/MayaFeeCalculator'));
const LoanCalculator = lazy(() => import('./tools/money/loan/LoanCalculator'));
const InstallmentCalculator = lazy(() => import('./tools/money/installment/InstallmentCalculator'));
const SavingsGoalCalculator = lazy(() => import('./tools/money/savings/SavingsGoalCalculator'));
const DailyBudgetCalculator = lazy(() => import('./tools/money/budget/DailyBudgetCalculator'));
const PercentageCalculator = lazy(() => import('./tools/money/percentage/PercentageCalculator'));
const DiscountCalculator = lazy(() => import('./tools/shopping/discount/DiscountCalculator'));
const UnitPriceComparator = lazy(() => import('./tools/shopping/unit-price/UnitPriceComparator'));
const FuelCalculator = lazy(() => import('./tools/daily/fuel/FuelCalculator'));
const DataUsageCalculator = lazy(() => import('./tools/mobile/data/DataUsageCalculator'));
const GWACalculator = lazy(() => import('./tools/students/gwa/GWACalculator'));
const BillSplitter = lazy(() => import('./tools/food/bill-splitter/BillSplitter'));
const ElectricityCalculator = lazy(() => import('./tools/bills/electricity/ElectricityCalculator'));
const CommuteCostCalculator = lazy(() => import('./tools/transport/commute/CommuteCostCalculator'));
const GenericTool = lazy(() => import('./components/tool/GenericTool'));
const LoadPromoFinder = lazy(() => import('./tools/mobile/promo/LoadPromoFinder'));

function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-surface-alt rounded w-1/3" />
        <div className="h-4 bg-surface-alt rounded w-2/3" />
        <div className="h-48 bg-surface-alt rounded-xl" />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Suspense fallback={<Loading />}><Home /></Suspense>} />
          <Route path="tools" element={<Suspense fallback={<Loading />}><Tools /></Suspense>} />
          <Route path="live" element={<Suspense fallback={<Loading />}><Live /></Suspense>} />
          <Route path="deals" element={<Suspense fallback={<Loading />}><Deals /></Suspense>} />
          <Route path="raket" element={<Suspense fallback={<Loading />}><Raket /></Suspense>} />
          <Route path="pricing" element={<Suspense fallback={<Loading />}><Pricing /></Suspense>} />
          <Route path="about" element={<Suspense fallback={<Loading />}><About /></Suspense>} />
          <Route path="privacy" element={<Suspense fallback={<Loading />}><Privacy /></Suspense>} />
          <Route path="terms" element={<Suspense fallback={<Loading />}><Terms /></Suspense>} />
          <Route path="disclaimer" element={<Suspense fallback={<Loading />}><Disclaimer /></Suspense>} />

          {/* Money Tools */}
          <Route path="tools/salary-calculator" element={<Suspense fallback={<Loading />}><SalaryCalculator /></Suspense>} />
          <Route path="tools/daily-wage-calculator" element={<Suspense fallback={<Loading />}><DailyWageCalculator /></Suspense>} />
          <Route path="tools/ot-calculator" element={<Suspense fallback={<Loading />}><OTCalculator /></Suspense>} />
          <Route path="tools/night-differential" element={<Suspense fallback={<Loading />}><NightDifferentialCalculator /></Suspense>} />
          <Route path="tools/holiday-pay" element={<Suspense fallback={<Loading />}><HolidayPayCalculator /></Suspense>} />
          <Route path="tools/thirteenth-month" element={<Suspense fallback={<Loading />}><ThirteenthMonthCalculator /></Suspense>} />
          <Route path="tools/gcash-fee-calculator" element={<Suspense fallback={<Loading />}><GcashFeeCalculator /></Suspense>} />
          <Route path="tools/maya-fee-calculator" element={<Suspense fallback={<Loading />}><MayaFeeCalculator /></Suspense>} />
          <Route path="tools/loan-calculator" element={<Suspense fallback={<Loading />}><LoanCalculator /></Suspense>} />
          <Route path="tools/installment-calculator" element={<Suspense fallback={<Loading />}><InstallmentCalculator /></Suspense>} />
          <Route path="tools/savings-goal" element={<Suspense fallback={<Loading />}><SavingsGoalCalculator /></Suspense>} />
          <Route path="tools/daily-budget" element={<Suspense fallback={<Loading />}><DailyBudgetCalculator /></Suspense>} />
          <Route path="tools/percentage-calculator" element={<Suspense fallback={<Loading />}><PercentageCalculator /></Suspense>} />

          {/* Shopping Tools */}
          <Route path="tools/discount-calculator" element={<Suspense fallback={<Loading />}><DiscountCalculator /></Suspense>} />
          <Route path="tools/unit-price-comparator" element={<Suspense fallback={<Loading />}><UnitPriceComparator /></Suspense>} />
          <Route path="tools/installment-vs-cash" element={<Suspense fallback={<Loading />}><GenericTool toolId="installment-vs-cash" /></Suspense>} />
          <Route path="tools/voucher-savings" element={<Suspense fallback={<Loading />}><GenericTool toolId="voucher-savings" /></Suspense>} />
          <Route path="tools/marketplace-fee" element={<Suspense fallback={<Loading />}><GenericTool toolId="marketplace-fee" /></Suspense>} />
          <Route path="tools/grocery-comparator" element={<Suspense fallback={<Loading />}><GenericTool toolId="grocery-comparator" /></Suspense>} />

          {/* Daily / Bills */}
          <Route path="tools/electricity-calculator" element={<Suspense fallback={<Loading />}><ElectricityCalculator /></Suspense>} />
          <Route path="tools/appliance-cost" element={<Suspense fallback={<Loading />}><GenericTool toolId="appliance-cost" /></Suspense>} />
          <Route path="tools/monthly-expenses" element={<Suspense fallback={<Loading />}><GenericTool toolId="monthly-expenses" /></Suspense>} />
          <Route path="tools/savings-challenge" element={<Suspense fallback={<Loading />}><GenericTool toolId="savings-challenge" /></Suspense>} />
          <Route path="tools/subscription-tracker" element={<Suspense fallback={<Loading />}><GenericTool toolId="subscription-tracker" /></Suspense>} />

          {/* Transport */}
          <Route path="tools/fuel-calculator" element={<Suspense fallback={<Loading />}><FuelCalculator /></Suspense>} />
          <Route path="tools/fuel-consumption" element={<Suspense fallback={<Loading />}><GenericTool toolId="fuel-consumption" /></Suspense>} />
          <Route path="tools/commute-cost" element={<Suspense fallback={<Loading />}><CommuteCostCalculator /></Suspense>} />

          {/* Mobile */}
          <Route path="tools/load-promo-finder" element={<Suspense fallback={<Loading />}><LoadPromoFinder /></Suspense>} />
          <Route path="tools/promo-comparator" element={<Suspense fallback={<Loading />}><GenericTool toolId="promo-comparator" /></Suspense>} />
          <Route path="tools/data-usage-calculator" element={<Suspense fallback={<Loading />}><DataUsageCalculator /></Suspense>} />
          <Route path="tools/cost-per-gb" element={<Suspense fallback={<Loading />}><GenericTool toolId="cost-per-gb" /></Suspense>} />
          <Route path="tools/internet-plan-comparator" element={<Suspense fallback={<Loading />}><GenericTool toolId="internet-plan-comparator" /></Suspense>} />
          <Route path="tools/mobile-data-budget" element={<Suspense fallback={<Loading />}><GenericTool toolId="mobile-data-budget" /></Suspense>} />

          {/* Students */}
          <Route path="tools/gwa-calculator" element={<Suspense fallback={<Loading />}><GWACalculator /></Suspense>} />

          {/* Food */}
          <Route path="tools/bill-splitter" element={<Suspense fallback={<Loading />}><BillSplitter /></Suspense>} />

          {/* Safety */}
          <Route path="tools/url-checker" element={<Suspense fallback={<Loading />}><GenericTool toolId="url-checker" /></Suspense>} />
          <Route path="tools/website-risk" element={<Suspense fallback={<Loading />}><GenericTool toolId="website-risk" /></Suspense>} />

          {/* Raket */}
          <Route path="tools/raketcheck" element={<Suspense fallback={<Loading />}><GenericTool toolId="raketcheck" /></Suspense>} />

          {/* 404 */}
          <Route path="*" element={<Suspense fallback={<Loading />}><NotFound /></Suspense>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
