export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-text mb-4">Privacy Policy</h1>
      <div className="text-sm text-text-secondary space-y-4">
        <p><strong>Last updated:</strong> August 25, 2026</p>
        <p>SulitNow PH respects your privacy. This policy explains how we handle data.</p>
        <h2 className="text-lg font-semibold text-text mt-6">Data Collection</h2>
        <p>SulitNow PH does <strong>not</strong> collect, store, or transmit any personal data. All calculations are performed locally in your browser.</p>
        <h2 className="text-lg font-semibold text-text mt-6">Local Storage</h2>
        <p>We use browser localStorage to save your preferences (theme, recently used tools, favorites). This data never leaves your device.</p>
        <h2 className="text-lg font-semibold text-text mt-6">Third-Party Services</h2>
        <p>We may use Cloudflare for hosting and analytics. Cloudflare's privacy policy applies to their services.</p>
        <h2 className="text-lg font-semibold text-text mt-6">Cookies</h2>
        <p>We do not use tracking cookies. Cloudflare may use essential cookies for security.</p>
        <h2 className="text-lg font-semibold text-text mt-6">Changes</h2>
        <p>We may update this policy. Changes will be posted on this page.</p>
      </div>
    </div>
  );
}
