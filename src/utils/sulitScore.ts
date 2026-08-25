import type { SulitScore, SulitFactor } from '../types';

interface ScoreInput {
  pricePerUnit: number;
  validity?: number;
  fees?: number;
  extras?: number;
  quality?: number;
  maxPricePerUnit?: number;
}

export function calculateSulitScore(input: ScoreInput): SulitScore {
  const factors: SulitFactor[] = [];

  // Price factor (lower is better) - 40% weight
  const priceScore = input.maxPricePerUnit
    ? clampScore((1 - input.pricePerUnit / input.maxPricePerUnit) * 10)
    : clampScore(10 - input.pricePerUnit * 2);
  factors.push({
    name: 'Price Value',
    value: priceScore,
    weight: 0.4,
    description: `Cost per unit: ₱${input.pricePerUnit.toFixed(2)}`,
  });

  // Validity factor (longer is better) - 20% weight
  if (input.validity !== undefined) {
    const validityScore = clampScore(input.validity / 30 * 10);
    factors.push({
      name: 'Validity',
      value: validityScore,
      weight: 0.2,
      description: `${input.validity} day${input.validity !== 1 ? 's' : ''} validity`,
    });
  } else {
    factors.push({
      name: 'Validity',
      value: 5,
      weight: 0.2,
      description: 'Standard validity',
    });
  }

  // Fees factor (lower is better) - 15% weight
  const feeScore = input.fees !== undefined
    ? clampScore(10 - input.fees * 0.5)
    : 7;
  factors.push({
    name: 'Fees',
    value: feeScore,
    weight: 0.15,
    description: input.fees !== undefined ? `₱${input.fees.toFixed(2)} in fees` : 'Standard fees',
  });

  // Extras/Bonus factor - 15% weight
  const extrasScore = input.extras !== undefined
    ? clampScore(input.extras * 10)
    : 5;
  factors.push({
    name: 'Extras & Bonuses',
    value: extrasScore,
    weight: 0.15,
    description: input.extras !== undefined ? 'Includes extras/bonuses' : 'Standard package',
  });

  // Quality factor - 10% weight
  const qualityScore = input.quality !== undefined
    ? clampScore(input.quality)
    : 5;
  factors.push({
    name: 'Overall Quality',
    value: qualityScore,
    weight: 0.1,
    description: 'General value assessment',
  });

  const score = factors.reduce((sum, f) => sum + f.value * f.weight, 0);

  return {
    score: Math.round(score * 10) / 10,
    factors,
    explanation: generateExplanation(score, factors),
  };
}

function clampScore(val: number): number {
  return Math.max(0, Math.min(10, val));
}

function generateExplanation(score: number, factors: SulitFactor[]): string {
  const best = factors.reduce((a, b) => a.value > b.value ? a : b);
  const worst = factors.reduce((a, b) => a.value < b.value ? a : b);

  if (score >= 8) {
    return `Great value! ${best.name} is a strong point. ${worst.name} could be better but overall this is a solid option.`;
  }
  if (score >= 6) {
    return `Decent value. ${best.name} is good, but watch out for ${worst.name}. Consider comparing with alternatives.`;
  }
  if (score >= 4) {
    return `Below average. ${worst.name} brings down the value significantly. Check other options for better deals.`;
  }
  return `Poor value. Consider alternatives — ${worst.name} is a major concern.`;
}

export function scoreColor(score: number): string {
  if (score >= 8) return 'text-green-600';
  if (score >= 6) return 'text-yellow-600';
  if (score >= 4) return 'text-orange-500';
  return 'text-red-600';
}

export function scoreBg(score: number): string {
  if (score >= 8) return 'bg-green-50 border-green-200';
  if (score >= 6) return 'bg-yellow-50 border-yellow-200';
  if (score >= 4) return 'bg-orange-50 border-orange-200';
  return 'bg-red-50 border-red-200';
}
