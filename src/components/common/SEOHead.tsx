import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  url?: string;
  type?: string;
  keywords?: string;
}

export default function SEOHead({ title, description, url, type = 'website', keywords }: SEOProps) {
  const siteUrl = url || 'https://sulitnow-ph.pages.dev';
  const fullTitle = `${title} | SulitNow PH`;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Basic meta
    setMeta('description', description);
    if (keywords) setMeta('keywords', keywords);

    // Open Graph
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:url', siteUrl, true);
    setMeta('og:type', type, true);
    setMeta('og:site_name', 'SulitNow PH', true);
    setMeta('og:locale', 'en_PH', true);

    // Twitter
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', siteUrl);
  }, [fullTitle, description, siteUrl, type, keywords]);

  return null;
}

// Structured data for tools
export function ToolStructuredData({ name, description, url }: { name: string; description: string; url: string; category: string; }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${name} - SulitNow PH`,
    description,
    url,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'PHP' },
    publisher: {
      '@type': 'Organization',
      name: 'SulitNow PH',
      url: 'https://sulitnow-ph.pages.dev',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// FAQ structured data
export function FAQStructuredData({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
