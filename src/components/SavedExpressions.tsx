import React, { useState } from 'react';
import type { DialogueLine, UserSettings } from '../types';
import { FuriganaText } from './FuriganaText';
import { speechService } from '../utils/speech';
import { Volume2, Trash2, Bookmark, BookOpen } from 'lucide-react';

interface SavedExpressionsProps {
  savedList: DialogueLine[];
  settings: UserSettings;
  onRemoveSaved: (id: string) => void;
}

export const SavedExpressions: React.FC<SavedExpressionsProps> = ({
  savedList,
  settings,
  onRemoveSaved,
}) => {
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const playAudio = (text: string) => {
    speechService.speak(text, settings.language, settings.speechRate);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-indigo-600 fill-indigo-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              나만의 현지 실전 표현 보관함
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            학습 중 북마크한 문장들을 모아 복습하고 암기해 보세요. 카드를 터치하면 한국어 뜻을 확인할 수 있습니다.
          </p>
        </div>
        <div className="text-right">
          <span className="text-lg font-extrabold text-indigo-600">
            {savedList.length}
          </span>
          <span className="text-xs text-slate-400 block">저장된 표현</span>
        </div>
      </div>

      {savedList.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            아직 보관함에 저장된 표현이 없습니다
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            [현지 실전 스피킹] 또는 [쉐도잉] 훈련 중 북마크 아이콘을 눌러 기억하고 싶은 문장을 저장해 보세요!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {savedList.map((item) => {
            const isRevealed = revealedIds[item.id] !== false; // default true
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {item.speakerName}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => playAudio(item.audioText)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="원어민 발음 듣기"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onRemoveSaved(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="보관함에서 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Main Target Sentence */}
                  <div className="text-lg font-bold text-slate-900 mb-2">
                    {settings.language === 'ja' ? (
                      <FuriganaText
                        text={item.text}
                        rubyTokens={item.rubyTokens}
                        showFurigana={settings.showFurigana}
                      />
                    ) : (
                      <span>{item.text}</span>
                    )}
                  </div>

                  {item.romajiOrIpa && (
                    <div className="text-xs font-mono text-indigo-600 mb-2">
                      {item.romajiOrIpa}
                    </div>
                  )}

                  {/* Translation flashcard-like toggle */}
                  <div
                    onClick={() => toggleReveal(item.id)}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    {isRevealed ? (
                      <div className="text-xs sm:text-sm font-semibold text-slate-700">
                        {item.translationKo}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 font-medium">
                        (터치하여 한국어 번역 확인)
                      </div>
                    )}
                  </div>
                </div>

                {item.nativeTips && (
                  <div className="mt-3 text-[11px] text-amber-900 bg-amber-50/60 p-2 rounded-lg border border-amber-200/50">
                    💡 {item.nativeTips}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
