import { useState, useEffect } from 'react';
import type { AppMode, DialogueLine, UserSettings, UserProgress } from './types';
import { JAPANESE_SITUATIONS, ENGLISH_SITUATIONS } from './data/situations';
import { JAPANESE_READING, ENGLISH_READING } from './data/readingMaterials';
import { loadSettings, saveSettings, loadProgress, saveProgress } from './utils/storage';
import { Header } from './components/Header';
import { SituationSpeaking } from './components/SituationSpeaking';
import { ShadowingTrainer } from './components/ShadowingTrainer';
import { LocalReading } from './components/LocalReading';
import { AiRoleplay } from './components/AiRoleplay';
import { SavedExpressions } from './components/SavedExpressions';
import { LinguisticsResearchView } from './components/LinguisticsResearchView';

export function App() {
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [currentMode, setCurrentMode] = useState<AppMode>('speaking');
  const [savedLines, setSavedLines] = useState<DialogueLine[]>([]);

  // Update storage whenever settings or progress changes
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Aggregate saved dialogue lines
  useEffect(() => {
    const allLines: DialogueLine[] = [];
    [...JAPANESE_SITUATIONS, ...ENGLISH_SITUATIONS].forEach((cat) => {
      cat.dialogue.forEach((line) => {
        if (progress.savedExpressionIds.includes(line.id)) {
          allLines.push(line);
        }
      });
    });
    setSavedLines(allLines);
  }, [progress.savedExpressionIds]);

  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleUpdateProgress = (newProg: Partial<UserProgress>) => {
    setProgress((prev) => ({ ...prev, ...newProg }));
  };

  const handleSaveExpression = (dialogue: DialogueLine) => {
    const exists = progress.savedExpressionIds.includes(dialogue.id);
    let nextSaved: string[];
    if (exists) {
      nextSaved = progress.savedExpressionIds.filter((id) => id !== dialogue.id);
    } else {
      nextSaved = [...progress.savedExpressionIds, dialogue.id];
    }
    handleUpdateProgress({ savedExpressionIds: nextSaved });
  };

  const handleRemoveSaved = (id: string) => {
    const nextSaved = progress.savedExpressionIds.filter((item) => item !== id);
    handleUpdateProgress({ savedExpressionIds: nextSaved });
  };

  const isExpressionSaved = (id: string) => {
    return progress.savedExpressionIds.includes(id);
  };

  // Determine current datasets
  const activeSituations =
    settings.language === 'ja' ? JAPANESE_SITUATIONS : ENGLISH_SITUATIONS;
  const activeReading =
    settings.language === 'ja' ? JAPANESE_READING : ENGLISH_READING;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Top Header & Navigation */}
      <Header
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        streakDays={progress.streakDays}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {currentMode === 'speaking' && (
          <SituationSpeaking
            situations={activeSituations}
            settings={settings}
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onSaveExpression={handleSaveExpression}
            isExpressionSaved={isExpressionSaved}
          />
        )}

        {currentMode === 'shadowing' && (
          <ShadowingTrainer
            situations={activeSituations}
            settings={settings}
            onSaveExpression={handleSaveExpression}
            isExpressionSaved={isExpressionSaved}
          />
        )}

        {currentMode === 'reading' && (
          <LocalReading
            readingItems={activeReading}
            settings={settings}
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
          />
        )}

        {currentMode === 'roleplay' && (
          <AiRoleplay
            settings={settings}
          />
        )}

        {currentMode === 'saved' && (
          <SavedExpressions
            savedList={savedLines}
            settings={settings}
            onRemoveSaved={handleRemoveSaved}
          />
        )}

        {currentMode === 'research' && (
          <LinguisticsResearchView />
        )}
      </main>

      {/* Bottom Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <span>SLA-Pilot 현지 실전 언어 내비게이터</span>
            <span>•</span>
            <span className="text-indigo-600 font-semibold">1차: 스피킹(출력 가설)</span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold">2차: 리딩(비계 페이딩)</span>
            <span>•</span>
            <span className="text-slate-700 font-semibold">SLA 5대 논문 기반</span>
          </div>
          <div className="text-slate-400">
            Chrome / Edge 브라우저 Web Speech API (음성인식 & 음성합성) 지원
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
