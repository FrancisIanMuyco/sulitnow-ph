export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-text mb-4">About SulitNow PH</h1>
      <div className="prose prose-sm text-text-secondary space-y-4">
        <p><strong>SulitNow PH</strong> is a free Filipino utility platform built to help you make smarter everyday decisions.</p>
        <p>Our mission is simple: <em>"Before you spend, check SulitNow."</em></p>
        <p>We provide calculators, comparison tools, and practical utilities designed specifically for the Filipino consumer — covering salary, bills, shopping, transportation, and more.</p>
        <h2 className="text-lg font-semibold text-text mt-6">What We Offer</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Salary and employment calculators (SSS, PhilHealth, Pag-IBIG)</li>
          <li>Shopping and discount tools</li>
          <li>Bill and electricity cost estimators</li>
          <li>Transportation and fuel cost calculators</li>
          <li>Student tools (GWA calculator, grade calculator)</li>
          <li>Money management and budgeting tools</li>
        </ul>
        <h2 className="text-lg font-semibold text-text mt-6">Our Principles</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Free first</strong> — core tools are always free, no signup required</li>
          <li><strong>Transparent</strong> — every calculation shows its formula</li>
          <li><strong>Local</strong> — built for Philippine conditions and regulations</li>
          <li><strong>Private</strong> — calculations happen in your browser, we don't store your data</li>
        </ul>
        <p className="mt-6">Questions? Contact us at <a href="mailto:support@sulitnow.ph" className="text-primary hover:underline">support@sulitnow.ph</a></p>
      </div>
    </div>
  );
}
