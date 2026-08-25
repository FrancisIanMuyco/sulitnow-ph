import { useState } from 'react';
import { toolRegistry } from '../../../constants/toolRegistry';
import ToolLayout from '../../../components/tool/ToolLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { formatPeso } from '../../../utils/format';

// 2026 Philippine deduction tables (approximate)
const SSS_TABLE = [
  { min: 0, max: 3250, er: 135.00, ee: 135.00 },
  { min: 3250, max: 3750, er: 157.50, ee: 157.50 },
  { min: 3750, max: 4250, er: 180.00, ee: 180.00 },
  { min: 4250, max: 4750, er: 202.50, ee: 202.50 },
  { min: 4750, max: 5250, er: 225.00, ee: 225.00 },
  { min: 5250, max: 5750, er: 247.50, ee: 247.50 },
  { min: 5750, max: 6250, er: 270.00, ee: 270.00 },
  { min: 6250, max: 6750, er: 292.50, ee: 292.50 },
  { min: 6750, max: 7250, er: 315.00, ee: 315.00 },
  { min: 7250, max: 7750, er: 337.50, ee: 337.50 },
  { min: 7750, max: 8250, er: 360.00, ee: 360.00 },
  { min: 8250, max: 8750, er: 382.50, ee: 382.50 },
  { min: 8750, max: 9250, er: 405.00, ee: 405.00 },
  { min: 9250, max: 9750, er: 427.50, ee: 427.50 },
  { min: 9750, max: 10250, er: 450.00, ee: 450.00 },
  { min: 10250, max: 10750, er: 472.50, ee: 472.50 },
  { min: 10750, max: 11250, er: 495.00, ee: 495.00 },
  { min: 11250, max: 11750, er: 517.50, ee: 517.50 },
  { min: 11750, max: 12250, er: 540.00, ee: 540.00 },
  { min: 12250, max: 12750, er: 562.50, ee: 562.50 },
  { min: 12750, max: 13250, er: 585.00, ee: 585.00 },
  { min: 13250, max: 13750, er: 607.50, ee: 607.50 },
  { min: 13750, max: 14250, er: 630.00, ee: 630.00 },
  { min: 14250, max: 14750, er: 652.50, ee: 652.50 },
  { min: 14750, max: 15250, er: 675.00, ee: 675.00 },
  { min: 15250, max: 15750, er: 697.50, ee: 697.50 },
  { min: 15750, max: 16250, er: 720.00, ee: 720.00 },
  { min: 16250, max: 16750, er: 742.50, ee: 742.50 },
  { min: 16750, max: 17250, er: 765.00, ee: 765.00 },
  { min: 17250, max: 17750, er: 787.50, ee: 787.50 },
  { min: 17750, max: 18250, er: 810.00, ee: 810.00 },
  { min: 18250, max: 18750, er: 832.50, ee: 832.50 },
  { min: 18750, max: 19250, er: 855.00, ee: 855.00 },
  { min: 19250, max: 19750, er: 877.50, ee: 877.50 },
  { min: 19750, max: 20250, er: 900.00, ee: 900.00 },
  { min: 20250, max: 20750, er: 922.50, ee: 922.50 },
  { min: 20750, max: 21250, er: 945.00, ee: 945.00 },
  { min: 21250, max: 21750, er: 967.50, ee: 967.50 },
  { min: 21750, max: 22250, er: 990.00, ee: 990.00 },
  { min: 22250, max: 22750, er: 1012.50, ee: 1012.50 },
  { min: 22750, max: 23250, er: 1035.00, ee: 1035.00 },
  { min: 23250, max: 23750, er: 1057.50, ee: 1057.50 },
  { min: 23750, max: 24250, er: 1080.00, ee: 1080.00 },
  { min: 24250, max: 24750, er: 1102.50, ee: 1102.50 },
  { min: 24750, max: 25250, er: 1125.00, ee: 1125.00 },
  { min: 25250, max: 25750, er: 1147.50, ee: 1147.50 },
  { min: 25750, max: 26250, er: 1170.00, ee: 1170.00 },
  { min: 26250, max: 26750, er: 1192.50, ee: 1192.50 },
  { min: 26750, max: 27250, er: 1215.00, ee: 1215.00 },
  { min: 27250, max: 27750, er: 1237.50, ee: 1237.50 },
  { min: 27750, max: 28250, er: 1260.00, ee: 1260.00 },
  { min: 28250, max: 28750, er: 1282.50, ee: 1282.50 },
  { min: 28750, max: 30000, er: 1305.00, ee: 1305.00 },
  { min: 30000, max: Infinity, er: 1305.00, ee: 1305.00 },
];

function getSSS(grossSalary: number) {
  const bracket = SSS_TABLE.find((b) => grossSalary >= b.min && grossSalary < b.max);
  return bracket ? bracket.ee : 1305.00;
}

function getPhilHealth(grossSalary: number): number {
  // 5% total, 2.25% employee share (capped)
  const contribution = grossSalary * 0.0225;
  return Math.min(contribution, 1125); // max contribution
}

function getPagIBIG(grossSalary: number): number {
  if (grossSalary <= 1500) return grossSalary * 0.01; // 1%
  return Math.min(grossSalary * 0.02, 200); // 2% max ₱200
}

export default function SalaryCalculator() {
  const tool = toolRegistry.find((t) => t.id === 'salary-calculator')!;
  const [gross, setGross] = useState('');
  const [result, setResult] = useState<{
    gross: number;
    sss: number;
    philhealth: number;
    pagibig: number;
    totalDeductions: number;
    net: number;
    netDaily: number;
    netWeekly: number;
  } | null>(null);

  const handleCalculate = () => {
    const grossNum = parseFloat(gross);
    if (isNaN(grossNum) || grossNum <= 0) return;

    const sss = getSSS(grossNum);
    const philhealth = getPhilHealth(grossNum);
    const pagibig = getPagIBIG(grossNum);
    const totalDeductions = sss + philhealth + pagibig;
    const net = grossNum - totalDeductions;

    setResult({
      gross: grossNum,
      sss,
      philhealth,
      pagibig,
      totalDeductions,
      net,
      netDaily: net / 22,
      netWeekly: net / 4,
    });
  };

  return (
    <ToolLayout
      tool={tool}
      recommendation={result ? `Your estimated take-home pay is ${formatPeso(result.net)} per month. That's about ${formatPeso(result.netDaily)} per working day.` : undefined}
    >
      <div className="px-4 py-4 space-y-4">
        <Input
          label="Gross Monthly Salary"
          prefix="₱"
          type="number"
          value={gross}
          onChange={(e) => setGross(e.target.value)}
          placeholder="25000"
          hint="Enter your monthly gross salary before deductions"
        />
        <Button onClick={handleCalculate} className="w-full">
          Calculate Net Salary
        </Button>
      </div>

      {result && (
        <div className="border-t border-border">
          <div className="px-4 py-4 space-y-3">
            {/* Net Pay */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
              <p className="text-xs text-primary font-medium mb-1">Estimated Net Monthly Pay</p>
              <p className="text-2xl font-bold text-primary">{formatPeso(result.net)}</p>
            </div>

            {/* Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Gross Salary</span>
                <span className="font-medium text-text">{formatPeso(result.gross)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">SSS (Employee Share)</span>
                <span className="text-red-600">-{formatPeso(result.sss)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">PhilHealth (Employee Share)</span>
                <span className="text-red-600">-{formatPeso(result.philhealth)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Pag-IBIG (Employee Share)</span>
                <span className="text-red-600">-{formatPeso(result.pagibig)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between text-sm">
                <span className="text-text-secondary">Total Deductions</span>
                <span className="font-medium text-red-600">-{formatPeso(result.totalDeductions)}</span>
              </div>
            </div>

            {/* Per-period estimates */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-surface-alt rounded-lg p-3 text-center">
                <p className="text-[10px] text-text-muted mb-0.5">Daily (22 days)</p>
                <p className="text-sm font-bold text-text">{formatPeso(result.netDaily)}</p>
              </div>
              <div className="bg-surface-alt rounded-lg p-3 text-center">
                <p className="text-[10px] text-text-muted mb-0.5">Weekly (÷4)</p>
                <p className="text-sm font-bold text-text">{formatPeso(result.netWeekly)}</p>
              </div>
            </div>

            <p className="text-[10px] text-text-muted text-center mt-2">
              ⚠️ Estimates only. Actual deductions may vary. Consult your HR for exact figures.
            </p>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
