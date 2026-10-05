export type Language = 'ja' | 'en';

export type AppMode = 'speaking' | 'shadowing' | 'reading' | 'roleplay' | 'saved' | 'research';

export interface RubyToken {
  kanji: string;
  furigana: string;
  romaji?: string;
  meaning?: string;
}

export interface DialogueLine {
  id: string;
  speaker: 'user' | 'partner';
  speakerName: string;
  avatar: string;
  text: string; // Plain text or Japanese Kanji
  rubyTokens?: RubyToken[]; // Tokens for ruby/furigana display
  translationKo: string; // Korean translation
  romajiOrIpa?: string; // Romaji (for JA) or Pronunciation hint (for EN)
  audioText: string; // Exact text to feed into TTS
  nativeTips?: string; // Practical native speaker tips (e.g. cultural nuance, intonation)
  alternatives?: string[]; // Other natural ways native speakers say this
  keywords?: { word: string; meaning: string; pronunciation?: string }[];
}

export interface SituationCategory {
  id: string;
  icon: string;
  titleKo: string;
  titleNative: string;
  descriptionKo: string;
  scenario: string; // What situation you are in
  dialogue: DialogueLine[];
}

export interface ReadingItem {
  id: string;
  category: 'restaurant' | 'transit' | 'convenience' | 'hotel' | 'signs';
  titleKo: string;
  titleNative: string;
  imageUrl?: string;
  typeBadge: string;
  content: {
    rawText: string;
    rubyTokens?: RubyToken[];
    translationKo: string;
    notes?: string;
  }[];
  interactiveWords: {
    text: string;
    reading?: string;
    meaningKo: string;
    explanation?: string;
  }[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface UserProgress {
  streakDays: number;
  lastStudiedDate: string;
  completedSpeakingIds: string[];
  completedReadingIds: string[];
  savedExpressionIds: string[];
  highScores: Record<string, number>; // dialogueId -> percentage
}

export interface UserSettings {
  language: Language;
  showFurigana: boolean;
  showRomaji: boolean;
  speechRate: number; // 0.8, 1.0, 1.2
  voiceGender: 'female' | 'male' | 'default';
  apiKey?: string;
}
