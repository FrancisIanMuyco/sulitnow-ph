import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingBar from './components/common/LoadingBar';

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
const CurrencyConverter = lazy(() => import('./tools/money/currency/CurrencyConverter'));
const DiscountCalculator = lazy(() => import('./tools/shopping/discount/DiscountCalculator'));
const UnitPriceComparator = lazy(() => import('./tools/shopping/unit-price/UnitPriceComparator'));
const FuelCalculator = lazy(() => import('./tools/daily/fuel/FuelCalculator'));
const DataUsageCalculator = lazy(() => import('./tools/mobile/data/DataUsageCalculator'));
const GWACalculator = lazy(() => import('./tools/students/gwa/GWACalculator'));
const BillSplitter = lazy(() => import('./tools/food/bill-splitter/BillSplitter'));
const ElectricityCalculator = lazy(() => import('./tools/bills/electricity/ElectricityCalculator'));
const CommuteCostCalculator = lazy(() => import('./tools/transport/commute/CommuteCostCalculator'));
const LoadPromoFinder = lazy(() => import('./tools/mobile/promo/LoadPromoFinder'));

// New tools
const InstallmentVsCash = lazy(() => import('./tools/shopping/installment-vs-cash/InstallmentVsCash'));
const VoucherSavings = lazy(() => import('./tools/shopping/voucher-savings/VoucherSavings'));
const MarketplaceFeeCalculator = lazy(() => import('./tools/shopping/marketplace-fee/MarketplaceFeeCalculator'));
const GroceryComparator = lazy(() => import('./tools/shopping/grocery/GroceryComparator'));
const ApplianceCostCalculator = lazy(() => import('./tools/daily/appliance/ApplianceCostCalculator'));
const MonthlyExpenses = lazy(() => import('./tools/daily/monthly-expenses/MonthlyExpenses'));
const SavingsChallenge = lazy(() => import('./tools/daily/savings-challenge/SavingsChallenge'));
const SubscriptionTracker = lazy(() => import('./tools/daily/subscription/SubscriptionTracker'));
const FuelConsumptionCalculator = lazy(() => import('./tools/daily/fuel-consumption/FuelConsumptionCalculator'));
const MobileDataBudget = lazy(() => import('./tools/mobile/mobile-data-budget/MobileDataBudget'));
const PromoComparator = lazy(() => import('./tools/mobile/promo-comparator/PromoComparator'));
const CostPerGB = lazy(() => import('./tools/mobile/cost-per-gb/CostPerGB'));
const InternetPlanComparator = lazy(() => import('./tools/mobile/internet-plan/InternetPlanComparator'));
const URLChecker = lazy(() => import('./tools/safety/url-checker/URLChecker'));
const WebsiteRisk = lazy(() => import('./tools/safety/website-risk/WebsiteRisk'));
const RaketCheck = lazy(() => import('./tools/raket/raketcheck/RaketCheck'));
const TakeHomePayCalculator = lazy(() => import('./tools/money/take-home-pay/TakeHomePayCalculator'));
const TransportFareCalculator = lazy(() => import('./tools/transport/fare/TransportFareCalculator'));
const LTOFeeCalculator = lazy(() => import('./tools/transport/lto/LTOFeeCalculator'));
const WeatherChecker = lazy(() => import('./tools/daily/weather/WeatherChecker'));
const SellerFeeCalculator = lazy(() => import('./tools/shopping/seller-fees/SellerFeeCalculator'));

// Additional tools
const TipCalculator = lazy(() => import('./tools/daily/tip/TipCalculator'));
const BMICalculator = lazy(() => import('./tools/daily/bmi/BMICalculator'));
const AgeCalculator = lazy(() => import('./tools/daily/age/AgeCalculator'));
const EmergencyFundCalculator = lazy(() => import('./tools/money/emergency-fund/EmergencyFundCalculator'));
const DebtPayoffCalculator = lazy(() => import('./tools/money/debt-payoff/DebtPayoffCalculator'));
const SalaryIncreaseCalculator = lazy(() => import('./tools/money/salary-increase/SalaryIncreaseCalculator'));
const CompoundInterestCalculator = lazy(() => import('./tools/money/compound-interest/CompoundInterestCalculator'));
const RoomAreaCalculator = lazy(() => import('./tools/daily/room-area/RoomAreaCalculator'));
const FreightCalculator = lazy(() => import('./tools/shopping/freight/FreightCalculator'));
const BodyFatCalculator = lazy(() => import('./tools/daily/body-fat/BodyFatCalculator'));

// New tools batch 3
const WaterBillCalculator = lazy(() => import('./tools/daily/water-bill/WaterBillCalculator'));
const IdealWeightCalculator = lazy(() => import('./tools/daily/ideal-weight/IdealWeightCalculator'));
const CalorieCalculator = lazy(() => import('./tools/daily/calorie/CalorieCalculator'));
const TravelBudgetPlanner = lazy(() => import('./tools/daily/travel-budget/TravelBudgetPlanner'));
const VehicleTripCostCalculator = lazy(() => import('./tools/daily/trip-cost/VehicleTripCostCalculator'));
const TimeZoneConverter = lazy(() => import('./tools/daily/timezone/TimeZoneConverter'));
const PasswordStrengthChecker = lazy(() => import('./tools/safety/password-strength/PasswordStrengthChecker'));
const IncomeTaxCalculator = lazy(() => import('./tools/money/income-tax/IncomeTaxCalculator'));
const RetirementCalculator = lazy(() => import('./tools/money/retirement/RetirementCalculator'));
const ParkingCostCalculator = lazy(() => import('./tools/daily/parking/ParkingCostCalculator'));
const GoldPriceCalculator = lazy(() => import('./tools/money/gold-price/GoldPriceCalculator'));
const CryptoPriceChecker = lazy(() => import('./tools/money/crypto/CryptoPriceChecker'));
const EarthquakeMonitor = lazy(() => import('./tools/safety/earthquake/EarthquakeMonitor'));

function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-10 h-10 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-sm text-gray-400 dark:text-gray-500 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

function ToolLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading tool...</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">This should only take a moment</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <LoadingBar />
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
            <Route path="tools/salary-calculator" element={<Suspense fallback={<ToolLoading />}><SalaryCalculator /></Suspense>} />
            <Route path="tools/daily-wage-calculator" element={<Suspense fallback={<ToolLoading />}><DailyWageCalculator /></Suspense>} />
            <Route path="tools/ot-calculator" element={<Suspense fallback={<ToolLoading />}><OTCalculator /></Suspense>} />
            <Route path="tools/night-differential" element={<Suspense fallback={<ToolLoading />}><NightDifferentialCalculator /></Suspense>} />
            <Route path="tools/holiday-pay" element={<Suspense fallback={<ToolLoading />}><HolidayPayCalculator /></Suspense>} />
            <Route path="tools/thirteenth-month" element={<Suspense fallback={<ToolLoading />}><ThirteenthMonthCalculator /></Suspense>} />
            <Route path="tools/gcash-fee-calculator" element={<Suspense fallback={<ToolLoading />}><GcashFeeCalculator /></Suspense>} />
            <Route path="tools/maya-fee-calculator" element={<Suspense fallback={<ToolLoading />}><MayaFeeCalculator /></Suspense>} />
            <Route path="tools/loan-calculator" element={<Suspense fallback={<ToolLoading />}><LoanCalculator /></Suspense>} />
            <Route path="tools/installment-calculator" element={<Suspense fallback={<ToolLoading />}><InstallmentCalculator /></Suspense>} />
            <Route path="tools/savings-goal" element={<Suspense fallback={<ToolLoading />}><SavingsGoalCalculator /></Suspense>} />
            <Route path="tools/daily-budget" element={<Suspense fallback={<ToolLoading />}><DailyBudgetCalculator /></Suspense>} />
            <Route path="tools/percentage-calculator" element={<Suspense fallback={<ToolLoading />}><PercentageCalculator /></Suspense>} />
            <Route path="tools/currency-converter" element={<Suspense fallback={<ToolLoading />}><CurrencyConverter /></Suspense>} />

            {/* Shopping Tools */}
            <Route path="tools/discount-calculator" element={<Suspense fallback={<ToolLoading />}><DiscountCalculator /></Suspense>} />
            <Route path="tools/unit-price-comparator" element={<Suspense fallback={<ToolLoading />}><UnitPriceComparator /></Suspense>} />
            <Route path="tools/installment-vs-cash" element={<Suspense fallback={<ToolLoading />}><InstallmentVsCash /></Suspense>} />
            <Route path="tools/voucher-savings" element={<Suspense fallback={<ToolLoading />}><VoucherSavings /></Suspense>} />
            <Route path="tools/marketplace-fee" element={<Suspense fallback={<ToolLoading />}><MarketplaceFeeCalculator /></Suspense>} />
            <Route path="tools/grocery-comparator" element={<Suspense fallback={<ToolLoading />}><GroceryComparator /></Suspense>} />

            {/* Daily / Bills */}
            <Route path="tools/electricity-calculator" element={<Suspense fallback={<ToolLoading />}><ElectricityCalculator /></Suspense>} />
            <Route path="tools/appliance-cost" element={<Suspense fallback={<ToolLoading />}><ApplianceCostCalculator /></Suspense>} />
            <Route path="tools/monthly-expenses" element={<Suspense fallback={<ToolLoading />}><MonthlyExpenses /></Suspense>} />
            <Route path="tools/savings-challenge" element={<Suspense fallback={<ToolLoading />}><SavingsChallenge /></Suspense>} />
            <Route path="tools/subscription-tracker" element={<Suspense fallback={<ToolLoading />}><SubscriptionTracker /></Suspense>} />

            {/* Transport */}
            <Route path="tools/fuel-calculator" element={<Suspense fallback={<ToolLoading />}><FuelCalculator /></Suspense>} />
            <Route path="tools/fuel-consumption" element={<Suspense fallback={<ToolLoading />}><FuelConsumptionCalculator /></Suspense>} />
            <Route path="tools/commute-cost" element={<Suspense fallback={<ToolLoading />}><CommuteCostCalculator /></Suspense>} />

            {/* Mobile */}
            <Route path="tools/load-promo-finder" element={<Suspense fallback={<ToolLoading />}><LoadPromoFinder /></Suspense>} />
            <Route path="tools/promo-comparator" element={<Suspense fallback={<ToolLoading />}><PromoComparator /></Suspense>} />
            <Route path="tools/data-usage-calculator" element={<Suspense fallback={<ToolLoading />}><DataUsageCalculator /></Suspense>} />
            <Route path="tools/cost-per-gb" element={<Suspense fallback={<ToolLoading />}><CostPerGB /></Suspense>} />
            <Route path="tools/internet-plan-comparator" element={<Suspense fallback={<ToolLoading />}><InternetPlanComparator /></Suspense>} />
            <Route path="tools/mobile-data-budget" element={<Suspense fallback={<ToolLoading />}><MobileDataBudget /></Suspense>} />

            {/* Students */}
            <Route path="tools/gwa-calculator" element={<Suspense fallback={<ToolLoading />}><GWACalculator /></Suspense>} />

            {/* Food */}
            <Route path="tools/bill-splitter" element={<Suspense fallback={<ToolLoading />}><BillSplitter /></Suspense>} />

            {/* Safety */}
            <Route path="tools/url-checker" element={<Suspense fallback={<ToolLoading />}><URLChecker /></Suspense>} />
            <Route path="tools/website-risk" element={<Suspense fallback={<ToolLoading />}><WebsiteRisk /></Suspense>} />

            {/* New Tools */}
            <Route path="tools/take-home-pay" element={<Suspense fallback={<ToolLoading />}><TakeHomePayCalculator /></Suspense>} />
            <Route path="tools/transport-fare" element={<Suspense fallback={<ToolLoading />}><TransportFareCalculator /></Suspense>} />
            <Route path="tools/lto-fee-calculator" element={<Suspense fallback={<ToolLoading />}><LTOFeeCalculator /></Suspense>} />
            <Route path="tools/weather-checker" element={<Suspense fallback={<ToolLoading />}><WeatherChecker /></Suspense>} />
            <Route path="tools/seller-fee-calculator" element={<Suspense fallback={<ToolLoading />}><SellerFeeCalculator /></Suspense>} />

            {/* Additional Tools */}
            <Route path="tools/tip-calculator" element={<Suspense fallback={<ToolLoading />}><TipCalculator /></Suspense>} />
            <Route path="tools/bmi-calculator" element={<Suspense fallback={<ToolLoading />}><BMICalculator /></Suspense>} />
            <Route path="tools/age-calculator" element={<Suspense fallback={<ToolLoading />}><AgeCalculator /></Suspense>} />
            <Route path="tools/emergency-fund" element={<Suspense fallback={<ToolLoading />}><EmergencyFundCalculator /></Suspense>} />
            <Route path="tools/debt-payoff" element={<Suspense fallback={<ToolLoading />}><DebtPayoffCalculator /></Suspense>} />
            <Route path="tools/salary-increase" element={<Suspense fallback={<ToolLoading />}><SalaryIncreaseCalculator /></Suspense>} />
            <Route path="tools/compound-interest" element={<Suspense fallback={<ToolLoading />}><CompoundInterestCalculator /></Suspense>} />
            <Route path="tools/room-area" element={<Suspense fallback={<ToolLoading />}><RoomAreaCalculator /></Suspense>} />
            <Route path="tools/freight-calculator" element={<Suspense fallback={<ToolLoading />}><FreightCalculator /></Suspense>} />
            <Route path="tools/body-fat" element={<Suspense fallback={<ToolLoading />}><BodyFatCalculator /></Suspense>} />

            {/* Batch 3 Tools */}
            <Route path="tools/water-bill" element={<Suspense fallback={<ToolLoading />}><WaterBillCalculator /></Suspense>} />
            <Route path="tools/ideal-weight" element={<Suspense fallback={<ToolLoading />}><IdealWeightCalculator /></Suspense>} />
            <Route path="tools/calorie-calculator" element={<Suspense fallback={<ToolLoading />}><CalorieCalculator /></Suspense>} />
            <Route path="tools/travel-budget" element={<Suspense fallback={<ToolLoading />}><TravelBudgetPlanner /></Suspense>} />
            <Route path="tools/vehicle-trip-cost" element={<Suspense fallback={<ToolLoading />}><VehicleTripCostCalculator /></Suspense>} />
            <Route path="tools/time-zone-converter" element={<Suspense fallback={<ToolLoading />}><TimeZoneConverter /></Suspense>} />
            <Route path="tools/password-strength" element={<Suspense fallback={<ToolLoading />}><PasswordStrengthChecker /></Suspense>} />
            <Route path="tools/income-tax" element={<Suspense fallback={<ToolLoading />}><IncomeTaxCalculator /></Suspense>} />
            <Route path="tools/retirement-calculator" element={<Suspense fallback={<ToolLoading />}><RetirementCalculator /></Suspense>} />
            <Route path="tools/parking-cost" element={<Suspense fallback={<ToolLoading />}><ParkingCostCalculator /></Suspense>} />

            {/* Real-time Tools */}
            <Route path="tools/gold-price" element={<Suspense fallback={<ToolLoading />}><GoldPriceCalculator /></Suspense>} />
            <Route path="tools/crypto-prices" element={<Suspense fallback={<ToolLoading />}><CryptoPriceChecker /></Suspense>} />
            <Route path="tools/earthquake-monitor" element={<Suspense fallback={<ToolLoading />}><EarthquakeMonitor /></Suspense>} />

            {/* Raket */}
            <Route path="tools/raketcheck" element={<Suspense fallback={<ToolLoading />}><RaketCheck /></Suspense>} />

            {/* 404 */}
            <Route path="*" element={<Suspense fallback={<Loading />}><NotFound /></Suspense>} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
