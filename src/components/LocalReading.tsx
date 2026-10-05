import React, { useState } from 'react';
import type { ReadingItem, UserSettings, UserProgress } from '../types';
import { FuriganaText } from './FuriganaText';
import { speechService } from '../utils/speech';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Eye,
  EyeOff,
  Sparkles,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LocalReadingProps {
  readingItems: ReadingItem[];
  settings: UserSettings;
  progress: UserProgress;
  onUpdateProgress: (newProgress: Partial<UserProgress>) => void;
}

export const LocalReading: React.FC<LocalReadingProps> = ({
  readingItems,
  settings,
  progress,
  onUpdateProgress,
}) => {
  const [selectedId, setSelectedId] = useState<string>(readingItems[0]?.id || '');
  const [selectedWord, setSelectedWord] = useState<any | null>(null);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [localFurigana, setLocalFurigana] = useState<boolean>(settings.showFurigana);

  const activeItem = readingItems.find((r) => r.id === selectedId) || readingItems[0];

  const handleSelectMaterial = (id: string) => {
    setSelectedId(id);
    setSelectedWord(null);
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const handlePlayWordAudio = (text: string) => {
    speechService.speak(text, settings.language, settings.speechRate);
  };

  const handleQuizSubmit = (index: number) => {
    if (quizSubmitted) return;
    setSelectedQuizAnswer(index);
    setQuizSubmitted(true);

    if (index === activeItem.quiz.correctIndex) {
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
      } catch {}

      if (!progress.completedReadingIds.includes(activeItem.id)) {
        onUpdateProgress({
          completedReadingIds: [...progress.completedReadingIds, activeItem.id],
        });
      }
    }
  };

  if (!activeItem) {
    return <div className="text-center p-8 text-slate-500">리딩 자료가 없습니다.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Category Selection Carousel / Grid */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <h2 className="text-base font-bold text-slate-800">현지 실전 텍스트 리딩 훈련</h2>
          </div>
          <span className="text-xs text-slate-500">
            {readingItems.length}개 실전 자료
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {readingItems.map((item) => {
            const isSelected = item.id === activeItem.id;
            const isDone = progress.completedReadingIds.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleSelectMaterial(item.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-indigo-700">
                    {item.typeBadge}
                  </span>
                  {isDone && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">
                      학습 완료
                    </span>
                  )}
                </div>
                <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                  {item.titleKo}
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {item.titleNative}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Authentic Reading Board */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
        {/* Board Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-6">
          <div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800">
              {activeItem.typeBadge}
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-2">
              {activeItem.titleKo}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              {activeItem.titleNative}
            </p>
          </div>

          {/* Quick Furigana Toggle for Japanese */}
          {settings.language === 'ja' && (
            <button
              onClick={() => setLocalFurigana(!localFurigana)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              {localFurigana ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>{localFurigana ? '후리가나 끄기 (실전 모드)' : '후리가나 켜기 (초보 모드)'}</span>
            </button>
          )}
        </div>

        {/* Visual Simulation Display (Simulating real menu / station notice board) */}
        <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-amber-50/40 via-orange-50/20 to-slate-50 border-2 border-dashed border-amber-200/80 mb-6">
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-widest mb-3 flex items-center gap-1">
            <span>🏷️ 현지 실제 표기 화면</span>
          </div>

          <div className="space-y-4">
            {activeItem.content.map((c, idx) => (
              <div
                key={idx}
                className="bg-white/90 backdrop-blur-xs p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:border-indigo-300 transition-colors"
              >
                <div className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-wide">
                  {settings.language === 'ja' ? (
                    <FuriganaText
                      text={c.rawText}
                      rubyTokens={c.rubyTokens}
                      showFurigana={localFurigana}
                      onClickWord={(tok) => {
                        setSelectedWord({
                          text: tok.kanji,
                          reading: tok.furigana,
                          meaningKo: tok.meaning || '클릭된 단어',
                        });
                        handlePlayWordAudio(tok.furigana);
                      }}
                    />
                  ) : (
                    <span>{c.rawText}</span>
                  )}
                </div>

                <div className="text-xs sm:text-sm font-medium text-slate-600 mt-1">
                  {c.translationKo}
                </div>

                {c.notes && (
                  <div className="text-[11px] text-indigo-600 mt-1.5 flex items-center gap-1 font-sans">
                    <Info className="w-3 h-3 shrink-0" />
                    <span>현지 팁: {c.notes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Word Inspector */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
            <span>🔍 터치해서 뜻과 발음 확인하기 (핵심 단어)</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {activeItem.interactiveWords.map((w, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectedWord(w);
                  handlePlayWordAudio(w.reading || w.text);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  selectedWord?.text === w.text
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50'
                }`}
              >
                <span>{w.text}</span>
              </button>
            ))}
          </div>

          {/* Word Details Popup/Box */}
          {selectedWord && (
            <div className="mt-3 p-3.5 bg-white rounded-xl border border-indigo-100 shadow-xs flex items-start justify-between animate-in fade-in">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base text-slate-900">
                    {selectedWord.text}
                  </span>
                  {selectedWord.reading && (
                    <span className="text-xs text-indigo-600 font-mono">
                      [{selectedWord.reading}]
                    </span>
                  )}
                  <button
                    onClick={() => handlePlayWordAudio(selectedWord.reading || selectedWord.text)}
                    className="p-1 rounded-md hover:bg-slate-100 text-indigo-600"
                    title="발음 듣기"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-sm font-bold text-slate-800 mt-0.5">
                  뜻: {selectedWord.meaningKo}
                </div>
                {selectedWord.explanation && (
                  <div className="text-xs text-slate-500 mt-1">
                    {selectedWord.explanation}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Real-life Reading Quiz */}
        <div className="pt-6 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg text-xs font-extrabold">
              QUIZ
            </span>
            <h4 className="font-bold text-sm sm:text-base text-slate-900">
              {activeItem.quiz.question}
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {activeItem.quiz.options.map((opt, i) => {
              const isSelected = selectedQuizAnswer === i;
              const isCorrect = i === activeItem.quiz.correctIndex;
              let style = 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50';

              if (quizSubmitted) {
                if (isCorrect) {
                  style = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                } else if (isSelected && !isCorrect) {
                  style = 'bg-rose-50 border-rose-500 text-rose-900';
                } else {
                  style = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={i}
                  disabled={quizSubmitted}
                  onClick={() => handleQuizSubmit(i)}
                  className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${style}`}
                >
                  <span>{opt}</span>
                  {quizSubmitted && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                  )}
                  {quizSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quiz Result & Explanation */}
          {quizSubmitted && (
            <div
              className={`mt-4 p-4 rounded-xl border animate-in fade-in ${
                selectedQuizAnswer === activeItem.quiz.correctIndex
                  ? 'bg-emerald-50/80 border-emerald-200'
                  : 'bg-rose-50/80 border-rose-200'
              }`}
            >
              <div className="font-bold text-xs sm:text-sm mb-1 flex items-center gap-1.5">
                {selectedQuizAnswer === activeItem.quiz.correctIndex ? (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-900">정답입니다! 현지에서도 바로 알아볼 수 있어요.</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-4 h-4 text-rose-600" />
                    <span className="text-rose-900">아쉬워요! 아래 해설을 확인해 보세요.</span>
                  </>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-700">
                {activeItem.quiz.explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
