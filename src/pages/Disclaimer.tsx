export default function Disclaimer() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-text mb-4">Disclaimer</h1>
      <div className="text-sm text-text-secondary space-y-4">
        <p><strong>Last updated:</strong> August 27, 2026</p>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
          <p className="text-amber-800 dark:text-amber-200 font-semibold">⚠️ Important: Read Before Using</p>
          <p className="text-amber-700 dark:text-amber-300 text-xs mt-1">SulitNow PH is an informational tool. Always verify important information with official sources.</p>
        </div>

        <h2 className="text-lg font-semibold text-text mt-6">General Disclaimer</h2>
        <p>The information and tools provided on SulitNow PH are for general informational and educational purposes only. All calculations are estimates and should not be considered professional advice.</p>

        <h2 className="text-lg font-semibold text-text mt-6">Data Accuracy</h2>
        <p>We compile data from publicly available sources (government agencies, financial institutions, commercial websites). This data may be:</p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Outdated or subject to change without notice</li>
          <li>Incomplete or simplified for general reference</li>
          <li>Different from actual rates, fees, or contributions</li>
        </ul>
        <p><strong>Always verify with official sources:</strong></p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>BIR (bir.gov.ph) — Tax rates and filing</li>
          <li>SSS (sss.gov.ph) — Contribution schedules</li>
          <li>PhilHealth (philhealth.gov.ph) — Premium rates</li>
          <li>Pag-IBIG (pagibigfund.gov.ph) — Contribution tables</li>
          <li>LTO (lto.gov.ph) — Vehicle registration fees</li>
          <li>Your bank/financial institution — Interest rates and fees</li>
        </ul>

        <h2 className="text-lg font-semibold text-text mt-6">Employment Calculations</h2>
        <p>Salary, SSS, PhilHealth, Pag-IBIG, and other employment-related calculations are estimates based on publicly available Philippine government rates. Actual amounts may vary based on your employer's specific implementation, salary level, and applicable regulations. Consult your HR department or the relevant government agency for official figures.</p>

        <h2 className="text-lg font-semibold text-text mt-6">Financial Calculations</h2>
        <p>Loan, installment, and financial calculations are estimates. Actual interest rates, fees, and terms vary by institution. Always verify with your bank or financial institution before making financial decisions.</p>

        <h2 className="text-lg font-semibold text-text mt-6">Medical Disclaimer</h2>
        <p>Any health-related estimates (water intake, BMI, calorie needs, etc.) are general guidelines only. They are not medical advice. Consult a healthcare professional for personal health decisions.</p>

        <h2 className="text-lg font-semibold text-text mt-6">Affiliate Disclosure</h2>
        <p>SulitNow PH contains affiliate links to third-party services. When you click an affiliate link and sign up for a service, we may receive a commission at no additional cost to you. Affiliate links do not affect the prices you pay. We only recommend services we believe are genuinely useful.</p>
        <p>This disclosure is provided in accordance with the Federal Trade Commission (FTC) guidelines and the Philippine Consumer Act.</p>

        <h2 className="text-lg font-semibold text-text mt-6">Third-Party Content</h2>
        <p>The Website may display data, prices, or information from third-party sources. We do not endorse, guarantee, or assume responsibility for the accuracy of third-party information.</p>

        <h2 className="text-lg font-semibold text-text mt-6">No Professional Relationship</h2>
        <p>Use of SulitNow PH does not create a professional-client relationship of any kind. We are not financial advisors, lawyers, doctors, or licensed professionals.</p>

        <h2 className="text-lg font-semibold text-text mt-6">Limitation of Liability</h2>
        <p>To the fullest extent permitted by Philippine law, SulitNow PH shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Website.</p>

        <h2 className="text-lg font-semibold text-text mt-6">Contact</h2>
        <p>Questions about this disclaimer? Contact us at <a href="https://github.com/FrancisIanMuyco/sulitnow-ph/issues" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub Issues</a>.</p>
      </div>
    </div>
  );
}
