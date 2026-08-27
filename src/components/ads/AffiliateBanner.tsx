import { Link } from 'react-router-dom';

export default function AffiliateBanner() {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-center">
      <p className="text-[10px] text-gray-500 dark:text-gray-400">
        📋 Affiliate Disclosure: This site contains affiliate links. We may earn a commission at no cost to you.{' '}
        <Link to="/affiliate-disclosure" className="text-primary hover:underline">Learn more</Link>
      </p>
    </div>
  );
}
