// Text and phonetic similarity helper for speech scoring

// Clean string of punctuation and extra spaces
export function cleanText(str: string): string {
  return str
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"「」『』。、！？]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Convert Katakana to Hiragana for Japanese comparison
export function katakanaToHiragana(src: string): string {
  return src.replace(/[\u30a1-\u30f6]/g, (match) => {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

// Levenshtein distance calculation
export function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1, // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }

  return dp[m][n];
}

export interface SimilarityResult {
  score: number; // 0 - 100
  tier: 'excellent' | 'good' | 'fair' | 'poor';
  feedbackKo: string;
  wordMatches: { word: string; matched: boolean }[];
}

export function calculateSpeakingScore(spoken: string, target: string, lang: 'ja' | 'en'): SimilarityResult {
  let cSpoken = cleanText(spoken);
  let cTarget = cleanText(target);

  if (lang === 'ja') {
    cSpoken = katakanaToHiragana(cSpoken);
    cTarget = katakanaToHiragana(cTarget);
  }

  if (!cSpoken) {
    return {
      score: 0,
      tier: 'poor',
      feedbackKo: '음성이 감지되지 않았습니다. 다시 시도해 주세요.',
      wordMatches: target.split(' ').map((w) => ({ word: w, matched: false })),
    };
  }

  // Exact match
  if (cSpoken === cTarget) {
    return {
      score: 100,
      tier: 'excellent',
      feedbackKo: '완벽한 발음입니다! 현지인처럼 아주 자연스러워요.',
      wordMatches: target.split(' ').map((w) => ({ word: w, matched: true })),
    };
  }

  const maxLen = Math.max(cSpoken.length, cTarget.length);
  const distance = levenshteinDistance(cSpoken, cTarget);
  const rawScore = Math.max(0, Math.round(((maxLen - distance) / maxLen) * 100));

  // Word level check
  const targetWords = target.split(' ');
  const spokenWords = cSpoken.split(' ');
  const wordMatches = targetWords.map((word) => {
    const cleanW = cleanText(word);
    const matched = spokenWords.some((sw) => {
      if (lang === 'ja') {
        return sw.includes(cleanW) || cleanW.includes(sw);
      }
      return sw === cleanW || levenshteinDistance(sw, cleanW) <= 1;
    });
    return { word, matched };
  });

  // Calculate score boost if most key words are matched
  const matchedCount = wordMatches.filter((w) => w.matched).length;
  const wordScore = Math.round((matchedCount / targetWords.length) * 100);
  const finalScore = Math.min(100, Math.max(rawScore, wordScore));

  let tier: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';
  let feedbackKo = '';

  if (finalScore >= 85) {
    tier = 'excellent';
    feedbackKo = '원어민 수준입니다! 현지에서도 바로 통하는 발음이에요.';
  } else if (finalScore >= 70) {
    tier = 'good';
    feedbackKo = '좋습니다! 의미가 충분히 전달되는 훌륭한 억양이에요.';
  } else if (finalScore >= 50) {
    tier = 'fair';
    feedbackKo = '거의 다 맞췄어요! 핵심 단어의 억양과 발음에 조금 더 집중해 보세요.';
  } else {
    tier = 'poor';
    feedbackKo = '원어민 음성을 2~3회 반복해서 듣고 한 박자 쉬면서 천천히 따라해 보세요.';
  }

  return {
    score: finalScore,
    tier,
    feedbackKo,
    wordMatches,
  };
}
