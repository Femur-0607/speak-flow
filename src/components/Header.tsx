import React from 'react';
import type { AppMode, UserSettings } from '../types';
import { Volume2, Mic, BookOpen, MessageSquare, Bookmark, Flame, GraduationCap } from 'lucide-react';

interface HeaderProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  streakDays: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  settings,
  onUpdateSettings,
  streakDays,
}) => {
  const isJa = settings.language === 'ja';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-3">
        {/* Top bar: Brand + Language Toggle + Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  SLA-Pilot <span className="text-indigo-600">현지실전</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                  SLA 학술 엔진
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                제2언어습득론(SLA) 과학적 원리에 기반한 영어 & 일본어 실전 내비게이터
              </p>
            </div>
          </div>

          {/* Right Controls: Language Selector + Streak + Audio Speed */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Toggle */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => onUpdateSettings({ language: 'ja' })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  isJa
                    ? 'bg-white text-indigo-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🇯🇵</span>
                <span>일본어</span>
              </button>
              <button
                onClick={() => onUpdateSettings({ language: 'en' })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  !isJa
                    ? 'bg-white text-indigo-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🇺🇸</span>
                <span>영어</span>
              </button>
            </div>

            {/* Streak Counter */}
            <div
              className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 text-amber-700 rounded-xl text-xs sm:text-sm font-bold border border-amber-200/80"
              title="연속 학습일"
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{streakDays}일 연속</span>
            </div>

            {/* Furigana toggle (for Japanese only) */}
            {isJa && (
              <button
                onClick={() => onUpdateSettings({ showFurigana: !settings.showFurigana })}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  settings.showFurigana
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
                title="한자 위에 히라가나 발음(후리가나) 켜기/끄기"
              >
                후리가나 {settings.showFurigana ? 'ON' : 'OFF'}
              </button>
            )}

            {/* Speed toggle */}
            <button
              onClick={() => {
                const nextRate = settings.speechRate === 1.0 ? 0.8 : settings.speechRate === 0.8 ? 1.2 : 1.0;
                onUpdateSettings({ speechRate: nextRate });
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              title="원어민 음성 재생 속도 변경"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{settings.speechRate}x</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 mt-3 pt-2 border-t border-slate-100 overflow-x-auto no-scrollbar">
          <button
            onClick={() => onSelectMode('speaking')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              currentMode === 'speaking'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>1차 목적: 현지 실전 스피킹</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-bold ml-1">
              음성인식
            </span>
          </button>

          <button
            onClick={() => onSelectMode('shadowing')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              currentMode === 'shadowing'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>쉐도잉 & 발음 비교</span>
          </button>

          <button
            onClick={() => onSelectMode('reading')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              currentMode === 'reading'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>2차 목적: 현지 실전 리딩</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold ml-1">
              간판·메뉴판
            </span>
          </button>

          <button
            onClick={() => onSelectMode('roleplay')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              currentMode === 'roleplay'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>AI 프리토킹 롤플레잉</span>
          </button>

          <button
            onClick={() => onSelectMode('saved')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              currentMode === 'saved'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>나만의 보관함</span>
          </button>

          <button
            onClick={() => onSelectMode('research')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              currentMode === 'research'
                ? 'bg-slate-900 text-white shadow-sm ring-2 ring-indigo-400'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>SLA 언어학 연구소</span>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-700 px-1.5 py-0.5 rounded-full font-bold ml-0.5">
              5대 논문
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};
