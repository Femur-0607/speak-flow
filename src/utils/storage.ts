import type { UserProgress, UserSettings } from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'speakflow_settings_v1',
  PROGRESS: 'speakflow_progress_v1',
};

const DEFAULT_SETTINGS: UserSettings = {
  language: 'ja',
  showFurigana: true,
  showRomaji: true,
  speechRate: 1.0,
  voiceGender: 'default',
};

const DEFAULT_PROGRESS: UserProgress = {
  streakDays: 1,
  lastStudiedDate: new Date().toISOString().split('T')[0],
  completedSpeakingIds: [],
  completedReadingIds: [],
  savedExpressionIds: [],
  highScores: {},
};

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    // fallback
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (raw) {
      const parsed: UserProgress = JSON.parse(raw);
      // Update streak
      const today = new Date().toISOString().split('T')[0];
      if (parsed.lastStudiedDate !== today) {
        const last = new Date(parsed.lastStudiedDate);
        const now = new Date(today);
        const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          parsed.streakDays += 1;
        } else if (diffDays > 1) {
          parsed.streakDays = 1;
        }
        parsed.lastStudiedDate = today;
        saveProgress(parsed);
      }
      return parsed;
    }
  } catch {
    // fallback
  }
  return DEFAULT_PROGRESS;
}

export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch {
    // ignore
  }
}
