import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GA_MEASUREMENT_ID = 'G-R1Z7FCFNTG';

export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', eventName, params);
}

export function trackToolUsage(toolName: string, action: string) {
  trackEvent('tool_usage', {
    tool_name: toolName,
    action: action,
    page_location: window.location.href,
  });
}

export function trackAffiliateClick(affiliateId: string, affiliateName: string) {
  trackEvent('affiliate_click', {
    affiliate_id: affiliateId,
    affiliate_name: affiliateName,
    page_location: window.location.href,
  });
}

export function trackShare(platform: string, contentTitle: string) {
  trackEvent('share', {
    method: platform,
    content_type: 'tool',
    content_title: contentTitle,
  });
}

// Auto-track page views on route change
export default function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined' || !window.gtag) return;
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: location.pathname + location.search,
      page_title: document.title,
    });
  }, [location]);

  return null;
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
