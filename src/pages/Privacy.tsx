export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-text mb-4">Privacy Policy</h1>
      <div className="text-sm text-text-secondary space-y-4">
        <p><strong>Last updated:</strong> August 27, 2026</p>
        <p>SulitNow PH ("we", "us", or "our") respects your privacy. This policy explains how we handle data when you use our website and tools.</p>

        <h2 className="text-lg font-semibold text-text mt-6">1. Information We Collect</h2>
        <p>We do <strong>not</strong> collect, store, or transmit any personal data you enter into our calculators. All calculations are performed locally in your browser and never leave your device.</p>
        <p>When you visit our site, we may automatically collect:</p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Pages visited and time spent (via Google Analytics)</li>
          <li>Device type, browser, and operating system</li>
          <li>Referring website or search terms</li>
          <li>General geographic region (country/city level only)</li>
        </ul>

        <h2 className="text-lg font-semibold text-text mt-6">2. How We Use Information</h2>
        <p>We use collected information to:</p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Understand which tools are most popular</li>
          <li>Improve our website and user experience</li>
          <li>Generate aggregate, non-personal analytics</li>
          <li>Detect and prevent abuse</li>
        </ul>

        <h2 className="text-lg font-semibold text-text mt-6">3. Google Analytics</h2>
        <p>We use Google Analytics 4 (GA4) to analyze website traffic. Google Analytics uses cookies to collect information about how visitors use our site. This information is transmitted to and stored by Google on servers in the United States.</p>
        <p>Google Analytics does not identify individual users. We do not combine the information collected through Google Analytics with personally identifiable information.</p>
        <p>You can opt out of Google Analytics by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics Opt-out Browser Add-on</a>.</p>

        <h2 className="text-lg font-semibold text-text mt-6">4. Affiliate Links</h2>
        <p>Some links on our site are affiliate links. When you click these links and sign up for a service, we may receive a commission at no additional cost to you. Affiliate links do not affect the prices you pay.</p>
        <p>Affiliate partners may use their own cookies and tracking when you visit their websites. We are not responsible for the privacy practices of third-party websites.</p>

        <h2 className="text-lg font-semibold text-text mt-6">5. Local Storage</h2>
        <p>We use browser localStorage to save your preferences (theme, recently used tools, favorites). This data stays on your device and is never transmitted to us.</p>

        <h2 className="text-lg font-semibold text-text mt-6">6. Third-Party Services</h2>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li><strong>Cloudflare:</strong> Hosting and CDN — <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Privacy Policy</a></li>
          <li><strong>Google Analytics:</strong> Traffic analytics — <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Privacy Policy</a></li>
        </ul>

        <h2 className="text-lg font-semibold text-text mt-6">7. Data Retention</h2>
        <p>Google Analytics data is retained for 14 months. Local storage data remains on your device until you clear it or uninstall your browser.</p>

        <h2 className="text-lg font-semibold text-text mt-6">8. Your Rights</h2>
        <p>Under the Philippine Data Privacy Act of 2012 (RA 10173), you have the right to:</p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Be informed about how your data is processed</li>
          <li>Access your personal information</li>
          <li>Object to processing of your personal information</li>
          <li>Request erasure or blocking of your personal information</li>
        </ul>

        <h2 className="text-lg font-semibold text-text mt-6">9. Children's Privacy</h2>
        <p>Our site is not directed to children under 13. We do not knowingly collect information from children.</p>

        <h2 className="text-lg font-semibold text-text mt-6">10. Changes to This Policy</h2>
        <p>We may update this policy. Changes will be posted on this page with an updated date. Continued use of the site after changes constitutes acceptance.</p>

        <h2 className="text-lg font-semibold text-text mt-6">11. Contact</h2>
        <p>Questions about this policy? Contact us at <a href="https://github.com/FrancisIanMuyco/sulitnow-ph/issues" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub Issues</a>.</p>
      </div>
    </div>
  );
}
