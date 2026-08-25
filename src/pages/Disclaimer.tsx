export default function Disclaimer() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-text mb-4">Disclaimer</h1>
      <div className="text-sm text-text-secondary space-y-4">
        <p><strong>Last updated:</strong> August 25, 2026</p>
        <h2 className="text-lg font-semibold text-text mt-6">General Disclaimer</h2>
        <p>The information and tools provided on SulitNow PH are for general informational and educational purposes only. All calculations are estimates and should not be considered professional advice.</p>
        <h2 className="text-lg font-semibold text-text mt-6">Employment Calculations</h2>
        <p>Salary, SSS, PhilHealth, Pag-IBIG, and other employment-related calculations are estimates based on publicly available Philippine government rates. Actual amounts may vary based on your employer's specific implementation, salary level, and applicable regulations. Consult your HR department or the relevant government agency for official figures.</p>
        <h2 className="text-lg font-semibold text-text mt-6">Financial Calculations</h2>
        <p>Loan, installment, and financial calculations are estimates. Actual interest rates, fees, and terms vary by institution. Always verify with your bank or financial institution.</p>
        <h2 className="text-lg font-semibold text-text mt-6">Medical Disclaimer</h2>
        <p>Any health-related estimates (water intake, sleep, etc.) are general guidelines only. They are not medical advice. Consult a healthcare professional for personal health decisions.</p>
        <h2 className="text-lg font-semibold text-text mt-6">No Professional Relationship</h2>
        <p>Use of SulitNow PH does not create a professional-client relationship of any kind.</p>
      </div>
    </div>
  );
}
