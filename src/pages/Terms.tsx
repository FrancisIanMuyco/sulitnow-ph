export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-text mb-4">Terms of Use</h1>
      <div className="text-sm text-text-secondary space-y-4">
        <p><strong>Last updated:</strong> August 27, 2026</p>
        <p>By accessing or using SulitNow PH ("the Website"), you agree to these Terms of Use. If you do not agree, do not use the Website.</p>

        <h2 className="text-lg font-semibold text-text mt-6">1. Description of Service</h2>
        <p>SulitNow PH provides free calculation, comparison, and informational tools for personal, non-commercial use. The Website aggregates publicly available data (prices, rates, fees) from various sources and presents it in a user-friendly format.</p>

        <h2 className="text-lg font-semibold text-text mt-6">2. Data Sources & Accuracy</h2>
        <p>The Website compiles data from publicly available sources including government agencies, financial institutions, and commercial websites. While we strive for accuracy:</p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Data may be outdated, incomplete, or inaccurate</li>
          <li>We do not guarantee the completeness or timeliness of any information</li>
          <li>Users should always verify critical information with official sources</li>
          <li>We are not affiliated with any government agency, bank, or commercial entity unless explicitly stated</li>
        </ul>
        <p>For official information, consult: BIR (bir.gov.ph), SSS (sss.gov.ph), PhilHealth (philhealth.gov.ph), Pag-IBIG (pagibigfund.gov.ph), LTO (lto.gov.ph).</p>

        <h2 className="text-lg font-semibold text-text mt-6">3. Calculations & Estimates</h2>
        <p>All calculations are estimates based on general formulas and publicly available rates. Actual amounts may vary based on individual circumstances, employer implementation, or regulatory changes. Calculations are not financial, legal, tax, or professional advice.</p>

        <h2 className="text-lg font-semibold text-text mt-6">4. Affiliate Links</h2>
        <p>The Website contains affiliate links to third-party services (banks, fintech companies, remittance providers). When you click an affiliate link and sign up for a service, we may receive a commission. This does not affect the price you pay. We only recommend services we believe are useful to Filipino users.</p>
        <p>Affiliate relationships do not influence our editorial content, tool calculations, or data presentations.</p>

        <h2 className="text-lg font-semibold text-text mt-6">5. Intellectual Property</h2>
        <p>The SulitNow PH brand, design, code, and original content are our property. Tool formulas and calculations are based on publicly available standards and are not copyrighted. Data presented on the Website is sourced from public domains and is used for informational purposes.</p>
        <p>You may not copy, modify, distribute, or sell any content from the Website without written permission.</p>

        <h2 className="text-lg font-semibold text-text mt-6">6. Limitation of Liability</h2>
        <p>SulitNow PH is provided "as is" without warranties of any kind. We are not liable for:</p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Any financial losses based on our calculations or data</li>
          <li>Decisions made based on information from the Website</li>
          <li>Outdated or inaccurate data</li>
          <li>Third-party services accessed through affiliate links</li>
        </ul>

        <h2 className="text-lg font-semibold text-text mt-6">7. Prohibited Uses</h2>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Using the Website for commercial purposes without permission</li>
          <li>Scraping, crawling, or using automated tools to extract data</li>
          <li>Attempting to disrupt or overload the Website</li>
          <li>Using the Website to mislead or defraud others</li>
        </ul>

        <h2 className="text-lg font-semibold text-text mt-6">8. Changes to Terms</h2>
        <p>We reserve the right to modify these terms at any time. Changes take effect upon posting. Continued use after changes constitutes acceptance.</p>

        <h2 className="text-lg font-semibold text-text mt-6">9. Governing Law</h2>
        <p>These terms are governed by the laws of the Republic of the Philippines.</p>

        <h2 className="text-lg font-semibold text-text mt-6">10. Contact</h2>
        <p>Questions about these terms? Contact us at <a href="https://github.com/FrancisIanMuyco/sulitnow-ph/issues" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub Issues</a>.</p>
      </div>
    </div>
  );
}
