import type { Tool } from '../types';

// Filipino/Bisaya aliases for common terms
const aliases: Record<string, string[]> = {
  salary: ['sweldo', 'sahod', 'pay', 'income', 'kita'],
  money: ['pera', 'kwarta', 'salapi'],
  fuel: ['gasolina', 'gas', 'diesel', 'gasul'],
  discount: ['diskwento', 'sale', 'promo', 'off'],
  loan: ['utang', 'borrow', 'hulugan'],
  installment: ['hulugan', 'monthly', 'bayad'],
  electricity: ['kuryente', 'electric', 'power', 'kwh'],
  food: ['pagkain', 'kaon', 'eat'],
  water: ['tubig', 'consume'],
  commute: ['biyahe', 'travel', 'jeep', 'bus', 'train'],
  load: ['preload', 'topup', 'padala'],
  promo: ['promotion', 'deal', 'offer'],
  internet: ['wifi', 'data', 'signal', 'connection'],
  savings: ['ipon', 'save', 'mag-ipon'],
  budget: ['budget', 'gastos', 'allowance', 'spending'],
  earn: ['raket', 'hustle', 'work', 'job', 'trabaho'],
  compare: ['contras', 'compare', 'versus', 'vs'],
  price: ['presyo', 'halaga', 'cost'],
  fee: ['bayad', 'charge', 'cost'],
};

function normalize(str: string): string {
  return str.toLowerCase().trim();
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function expandQuery(query: string): string[] {
  const words = normalize(query).split(/\s+/);
  const expanded = [...words];
  for (const word of words) {
    for (const [key, vals] of Object.entries(aliases)) {
      if (word === key || vals.includes(word)) {
        expanded.push(key, ...vals);
      }
    }
  }
  return [...new Set(expanded)];
}

export interface SearchResult {
  tool: Tool;
  score: number;
  matchType: 'exact' | 'partial' | 'fuzzy' | 'alias';
}

export function searchTools(tools: Tool[], query: string): SearchResult[] {
  if (!query.trim()) return [];

  const expanded = expandQuery(query);
  const normalizedQuery = normalize(query);
  const results: SearchResult[] = [];

  for (const tool of tools) {
    const name = normalize(tool.name);
    const slug = normalize(tool.slug);
    const desc = normalize(tool.description);
    const keywords = tool.keywords.map(normalize);

    let bestScore = 0;
    let matchType: SearchResult['matchType'] = 'fuzzy';

    // Exact name match
    if (name === normalizedQuery || slug === normalizedQuery) {
      bestScore = 100;
      matchType = 'exact';
    }
    // Name starts with query
    else if (name.startsWith(normalizedQuery) || slug.startsWith(normalizedQuery)) {
      bestScore = 90;
      matchType = 'exact';
    }
    // Name contains query
    else if (name.includes(normalizedQuery) || slug.includes(normalizedQuery)) {
      bestScore = 80;
      matchType = 'partial';
    }

    // Keyword match
    for (const kw of keywords) {
      for (const exp of expanded) {
        if (kw === exp) {
          bestScore = Math.max(bestScore, 70);
          matchType = 'alias';
        } else if (kw.includes(exp) || exp.includes(kw)) {
          bestScore = Math.max(bestScore, 60);
          matchType = 'alias';
        }
      }
    }

    // Description match
    for (const exp of expanded) {
      if (desc.includes(exp)) {
        bestScore = Math.max(bestScore, 50);
        matchType = 'partial';
      }
    }

    // Fuzzy match on name
    if (bestScore < 40) {
      const dist = levenshtein(normalizedQuery, name);
      const maxLen = Math.max(normalizedQuery.length, name.length);
      const similarity = 1 - dist / maxLen;
      if (similarity > 0.5) {
        bestScore = Math.max(bestScore, Math.round(similarity * 40));
        matchType = 'fuzzy';
      }
    }

    if (bestScore > 0) {
      results.push({ tool, score: bestScore, matchType });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
