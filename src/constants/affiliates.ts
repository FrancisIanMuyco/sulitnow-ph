export interface AffiliateLink {
  id: string;
  name: string;
  url: string;
  logo: string;
  description: string;
  category: string;
  ctaText: string;
}

export const affiliateLinks: AffiliateLink[] = [
  {
    id: 'maya-savings',
    name: 'Maya Savings',
    url: 'https://www.maya.ph/en/savings?ref=sulitnow',
    logo: '📱',
    description: 'Earn up to 3.5% interest on your savings. No minimum balance required.',
    category: 'savings',
    ctaText: 'Open Maya Savings'
  },
  {
    id: 'maya-time-deposit',
    name: 'Maya Time Deposit',
    url: 'https://www.maya.ph/en/time-deposit?ref=sulitnow',
    logo: '📱',
    description: 'Earn up to 6% p.a. with Maya Time Deposit. Start with ₱1,000.',
    category: 'savings',
    ctaText: 'Start Time Deposit'
  },
  {
    id: 'tonik-time-deposit',
    name: 'Tonik Time Deposit',
    url: 'https://www.tonikbank.com/time-deposit?ref=sulitnow',
    logo: '🏦',
    description: 'Earn up to 6% p.a. with Tonik Time Deposit. Digital bank convenience.',
    category: 'savings',
    ctaText: 'Open Tonik Account'
  },
  {
    id: 'gotyme-save',
    name: 'GoTyme Save',
    url: 'https://www.gotyme.com.ph/savings?ref=sulitnow',
    logo: '💚',
    description: 'Earn up to 5% interest. Free deposits at any GoTyme kiosk.',
    category: 'savings',
    ctaText: 'Start Saving'
  },
  {
    id: 'wise-remittance',
    name: 'Wise (TransferWise)',
    url: 'https://wise.com/ph?ref=sulitnow',
    logo: '💸',
    description: 'Send money internationally with the real exchange rate. Low, transparent fees.',
    category: 'remittance',
    ctaText: 'Send Money with Wise'
  },
  {
    id: 'remitly',
    name: 'Remitly',
    url: 'https://www.remitly.com/ph?ref=sulitnow',
    logo: '🌍',
    description: 'Fast, affordable international money transfers to the Philippines.',
    category: 'remittance',
    ctaText: 'Send with Remitly'
  },
  {
    id: 'bpi-savings',
    name: 'BPI Savings Account',
    url: 'https://www.bpi.com.ph/personal/savings?ref=sulitnow',
    logo: '🏦',
    description: 'Open a BPI savings account online. No maintaining balance options available.',
    category: 'savings',
    ctaText: 'Open BPI Account'
  },
  {
    id: 'bdo-savings',
    name: 'BDO Savings Account',
    url: 'https://www.bdo.com.ph/personal/savings?ref=sulitnow',
    logo: '🏦',
    description: 'BDO Kabayan Savings — designed for OFWs and overseas Filipinos.',
    category: 'savings',
    ctaText: 'Open BDO Account'
  },
  {
    id: 'gcash-invest',
    name: 'GCash GInvest',
    url: 'https://www.gcash.com/investing?ref=sulitnow',
    logo: '📲',
    description: 'Start investing with as low as ₱50 through GCash GInvest.',
    category: 'investing',
    ctaText: 'Start Investing'
  },
  {
    id: 'paymaya-cashback',
    name: 'Maya Cashback',
    url: 'https://www.maya.ph/en/cashback?ref=sulitnow',
    logo: '💰',
    description: 'Earn cashback on every purchase with Maya. Up to 100% cashback on select promos.',
    category: 'deals',
    ctaText: 'Get Cashback'
  },
];

export const affiliateByCategory = (category: string) => 
  affiliateLinks.filter(a => a.category === category);

export const affiliateById = (id: string) => 
  affiliateLinks.find(a => a.id === id);
