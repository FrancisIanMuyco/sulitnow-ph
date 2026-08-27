export default function AffiliateDisclosure() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-text mb-4">Affiliate Disclosure</h1>
      <div className="text-sm text-text-secondary space-y-4">
        <p><strong>Last updated:</strong> August 27, 2026</p>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
          <p className="text-blue-800 dark:text-blue-200 font-semibold">📋 Affiliate Relationship Disclosure</p>
          <p className="text-blue-700 dark:text-blue-300 text-xs mt-1">SulitNow PH earns commissions from qualifying purchases made through our affiliate links.</p>
        </div>

        <h2 className="text-lg font-semibold text-text mt-6">What Are Affiliate Links?</h2>
        <p>Affiliate links are special URLs that track when you click through and sign up for a service or make a purchase. When you use our affiliate links, we may receive a small commission from the provider — at no additional cost to you.</p>

        <h2 className="text-lg font-semibold text-text mt-6">Which Links Are Affiliate Links?</h2>
        <p>Pages that contain affiliate links include but are not limited to:</p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Bank and savings product recommendations (Maya, Tonik, GoTyme, BPI, BDO)</li>
          <li>Remittance service recommendations (Wise, Remitly)</li>
          <li>Investment platform recommendations (GCash GInvest)</li>
          <li>Any "Open Account" or "Sign Up" buttons linking to third-party services</li>
        </ul>

        <h2 className="text-lg font-semibold text-text mt-6">Our Commitment</h2>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>We only recommend services we genuinely believe are useful to Filipino users</li>
          <li>Affiliate relationships do not influence our calculator formulas, data presentations, or editorial content</li>
          <li>Prices, fees, and rates displayed are the same regardless of whether you use an affiliate link</li>
          <li>We do not accept paid placements or sponsored content that misrepresents products</li>
        </ul>

        <h2 className="text-lg font-semibold text-text mt-6">Third-Party Cookies</h2>
        <p>When you click an affiliate link and visit a third-party website, that website may use cookies and tracking technologies. We are not responsible for the privacy practices of third-party websites. Please review their privacy policies directly.</p>

        <h2 className="text-lg font-semibold text-text mt-6">Legal Basis</h2>
        <p>This disclosure is provided in accordance with:</p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Federal Trade Commission (FTC) Endorsement Guides (16 CFR Part 255)</li>
          <li>Philippine Consumer Act (RA 7394)</li>
          <li>Philippine E-Commerce Act (RA 8792)</li>
        </ul>

        <h2 className="text-lg font-semibold text-text mt-6">Contact</h2>
        <p>Questions about our affiliate relationships? Contact us at <a href="https://github.com/FrancisIanMuyco/sulitnow-ph/issues" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub Issues</a>.</p>
      </div>
    </div>
  );
}
