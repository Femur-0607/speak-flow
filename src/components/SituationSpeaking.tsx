import React, { useState, useEffect } from 'react';
import type { SituationCategory, DialogueLine, UserSettings, UserProgress } from '../types';
import { FuriganaText } from './FuriganaText';
import { speechService } from '../utils/speech';
import { calculateSpeakingScore } from '../utils/similarity';
import type { SimilarityResult } from '../utils/similarity';
import {
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SituationSpeakingProps {
  situations: SituationCategory[];
  settings: UserSettings;
  progress: UserProgress;
  onUpdateProgress: (newProgress: Partial<UserProgress>) => void;
  onSaveExpression: (dialogue: DialogueLine) => void;
  isExpressionSaved: (id: string) => boolean;
}

export const SituationSpeaking: React.FC<SituationSpeakingProps> = ({
  situations,
  settings,
  progress,
  onUpdateProgress,
  onSaveExpression,
  isExpressionSaved,
}) => {
  const [selectedCatId, setSelectedCatId] = useState<string>(situations[0]?.id || '');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [scoreResult, setScoreResult] = useState<SimilarityResult | null>(null);
  const [speakingError, setSpeakingError] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState<boolean>(false);
  const [manualText, setManualText] = useState<string>('');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const activeCategory = situations.find((s) => s.id === selectedCatId) || situations[0];
  const dialogue = activeCategory?.dialogue || [];
  const currentLine: DialogueLine | undefined = dialogue[currentStepIndex];

  // Reset step index when category or language changes
  useEffect(() => {
    setCurrentStepIndex(0);
    setTranscript('');
    setScoreResult(null);
    setSpeakingError(null);
  }, [selectedCatId, settings.language]);

  // If partner's turn, auto-play or prepare audio
  useEffect(() => {
    if (currentLine && currentLine.speaker === 'partner') {
      playCurrentAudio(currentLine.audioText);
    }
  }, [currentStepIndex, selectedCatId]);

  const playCurrentAudio = (text: string) => {
    setIsPlayingAudio(true);
    speechService.speak(
      text,
      settings.language,
      settings.speechRate,
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  const handleStartListening = () => {
    setSpeakingError(null);
    setTranscript('');
    setScoreResult(null);

    if (!speechService.isSpeechRecognitionSupported()) {
      setSpeakingError(
        '브라우저가 마이크 음성 인식을 지원하지 않습니다. Chrome 또는 Edge 브라우저를 권장합니다. 아래의 직접 입력 테스트를 활용할 수 있습니다.'
      );
      setShowManualInput(true);
      return;
    }

    setIsListening(true);
    speechService.startListening(
      settings.language,
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal && currentLine) {
          evaluateSpeech(text, currentLine.text);
        }
      },
      (err) => {
        setIsListening(false);
        setSpeakingError(err);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const handleStopListening = () => {
    speechService.stopListening();
    setIsListening(false);
    if (transcript && currentLine) {
      evaluateSpeech(transcript, currentLine.text);
    }
  };

  const evaluateSpeech = (spoken: string, target: string) => {
    const result = calculateSpeakingScore(spoken, target, settings.language);
    setScoreResult(result);

    if (result.score >= 80) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch {
        // ignore
      }
    }

    // Record high score
    if (currentLine) {
      const prev = progress.highScores[currentLine.id] || 0;
      if (result.score > prev) {
        onUpdateProgress({
          highScores: { ...progress.highScores, [currentLine.id]: result.score },
        });
      }
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim() || !currentLine) return;
    setTranscript(manualText.trim());
    evaluateSpeech(manualText.trim(), currentLine.text);
  };

  const handleNextStep = () => {
    if (currentStepIndex < dialogue.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setTranscript('');
      setScoreResult(null);
      setSpeakingError(null);
      setManualText('');
    } else {
      // Completed scenario!
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
      if (!progress.completedSpeakingIds.includes(activeCategory.id)) {
        onUpdateProgress({
          completedSpeakingIds: [...progress.completedSpeakingIds, activeCategory.id],
        });
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Category Tabs */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📍</span>
            <h2 className="text-base font-bold text-slate-800">현지 실전 상황 선택</h2>
          </div>
          <span className="text-xs text-slate-500">
            {situations.length}개 실전 테마 준비됨
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {situations.map((cat) => {
            const isSelected = cat.id === selectedCatId;
            const isDone = progress.completedSpeakingIds.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCatId(cat.id)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-2xl">{cat.icon}</span>
                  {isDone && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">
                      완료됨
                    </span>
                  )}
                </div>
                <div className="font-bold text-xs sm:text-sm text-slate-900 truncate w-full">
                  {cat.titleKo}
                </div>
                <div className="text-[11px] text-slate-500 truncate w-full">
                  {cat.titleNative}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Situation Banner */}
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-indigo-100">
              실전 롤플레잉 시뮬레이션
            </span>
            <span className="text-xs font-medium text-indigo-200">
              대화 진행도: {currentStepIndex + 1} / {dialogue.length}
            </span>
          </div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span>{activeCategory.icon}</span>
            <span>{activeCategory.titleKo}</span>
          </h3>
          <p className="text-xs sm:text-sm text-indigo-100 mt-1">
            {activeCategory.scenario}
          </p>
        </div>
        {/* Progress bar line */}
        <div className="w-full bg-white/20 h-1.5 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-emerald-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / dialogue.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Dialogue Interactive Stage */}
      {currentLine && (
        <div className="space-y-4">
          {/* Previous Dialogue History (Chat style) */}
          {currentStepIndex > 0 && (
            <div className="space-y-2.5 bg-slate-100/70 p-4 rounded-2xl border border-slate-200/80">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                이전 대화 흐름
              </div>
              {dialogue.slice(0, currentStepIndex).map((line) => (
                <div
                  key={line.id}
                  className={`flex items-start gap-2.5 text-xs sm:text-sm ${
                    line.speaker === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {line.speaker === 'partner' && (
                    <span className="text-base">{line.avatar}</span>
                  )}
                  <div
                    className={`p-3 rounded-xl max-w-[80%] ${
                      line.speaker === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    <div className="font-semibold">{line.text}</div>
                    <div
                      className={`text-[11px] mt-0.5 ${
                        line.speaker === 'user' ? 'text-indigo-200' : 'text-slate-500'
                      }`}
                    >
                      {line.translationKo}
                    </div>
                  </div>
                  {line.speaker === 'user' && (
                    <span className="text-base">{line.avatar}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Current Turn Card */}
          <div
            className={`rounded-3xl p-6 border transition-all ${
              currentLine.speaker === 'user'
                ? 'bg-white border-indigo-200 shadow-lg shadow-indigo-100 ring-2 ring-indigo-500/10'
                : 'bg-white border-slate-200 shadow-md'
            }`}
          >
            {/* Header: Turn indicator & Speaker name */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-2 rounded-2xl bg-slate-100">
                  {currentLine.avatar}
                </span>
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {currentLine.speakerName}
                  </div>
                  <div className="text-xs font-semibold text-indigo-600">
                    {currentLine.speaker === 'user'
                      ? '🗣️ 지금 마이크로 직접 말해볼 차례입니다!'
                      : '🎧 상대방의 말을 잘 듣고 이해해 보세요'}
                  </div>
                </div>
              </div>

              {/* Action buttons: Bookmark & Audio Listen */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSaveExpression(currentLine)}
                  className={`p-2 rounded-xl border transition-colors ${
                    isExpressionSaved(currentLine.id)
                      ? 'bg-amber-50 border-amber-200 text-amber-600'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}
                  title="나만의 표현장에 저장"
                >
                  {isExpressionSaved(currentLine.id) ? (
                    <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => playCurrentAudio(currentLine.audioText)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isPlayingAudio
                      ? 'bg-indigo-600 text-white animate-pulse'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                  title="원어민 발음 듣기"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>듣기</span>
                </button>
              </div>
            </div>

            {/* Target Sentence Display with Furigana */}
            <div className="py-3 text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-wide leading-relaxed">
                {settings.language === 'ja' ? (
                  <FuriganaText
                    text={currentLine.text}
                    rubyTokens={currentLine.rubyTokens}
                    showFurigana={settings.showFurigana}
                  />
                ) : (
                  <span>{currentLine.text}</span>
                )}
              </div>

              {/* Romaji or Phonetic Pronunciation Guide */}
              {currentLine.romajiOrIpa && (
                <div className="text-xs sm:text-sm text-indigo-600 font-mono mt-2 bg-indigo-50/60 inline-block px-3 py-1 rounded-lg">
                  발음 힌트: {currentLine.romajiOrIpa}
                </div>
              )}

              {/* Korean Translation */}
              <div className="text-base sm:text-lg font-medium text-slate-600 mt-2">
                {currentLine.translationKo}
              </div>
            </div>

            {/* Speaking Trainer for User's Turn */}
            {currentLine.speaker === 'user' && (
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200/80">
                  {/* Big Microphone Action Button */}
                  <div className="relative mb-3">
                    <button
                      onClick={isListening ? handleStopListening : handleStartListening}
                      className={`w-20 h-20 rounded-full flex flex-col items-center justify-center text-white font-bold transition-all transform active:scale-95 shadow-lg ${
                        isListening
                          ? 'bg-red-600 animate-mic shadow-red-200'
                          : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                      }`}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="w-7 h-7 mb-0.5" />
                          <span className="text-[10px]">중지</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-7 h-7 mb-0.5" />
                          <span className="text-[10px]">말하기</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-700">
                    {isListening
                      ? '🎙️ 지금 말씀하세요! 실시간으로 인식 중입니다...'
                      : '버튼을 누르고 위 문장을 소리 내어 말해보세요'}
                  </p>

                  {/* Recognition transcript live feedback */}
                  {transcript && (
                    <div className="mt-3 p-3 bg-white border border-slate-200 rounded-xl text-center w-full max-w-md">
                      <span className="text-xs text-slate-400 block mb-0.5">내가 말한 내용:</span>
                      <span className="font-bold text-slate-800 text-sm">{transcript}</span>
                    </div>
                  )}

                  {/* Score & Feedback Result Card */}
                  {scoreResult && (
                    <div className="mt-4 w-full max-w-md p-4 bg-white rounded-2xl border border-indigo-100 shadow-sm animate-in fade-in">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-500">발음 정확도 점수</span>
                        <div
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold ${
                            scoreResult.score >= 80
                              ? 'bg-emerald-100 text-emerald-800'
                              : scoreResult.score >= 60
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{scoreResult.score}점</span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 font-medium mb-3">
                        {scoreResult.feedbackKo}
                      </p>

                      {/* Word breakdown check */}
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {scoreResult.wordMatches.map((wm, i) => (
                          <span
                            key={i}
                            className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                              wm.matched
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {wm.word} {wm.matched ? '✓' : '✗'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fallback Keyboard Input Option */}
                  <div className="mt-4">
                    <button
                      onClick={() => setShowManualInput(!showManualInput)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 underline flex items-center gap-1"
                    >
                      {showManualInput ? '직접 입력창 닫기' : '마이크 대신 텍스트로 직접 입력해보기'}
                    </button>
                    {showManualInput && (
                      <form onSubmit={handleManualSubmit} className="mt-2 flex gap-2">
                        <input
                          type="text"
                          value={manualText}
                          onChange={(e) => setManualText(e.target.value)}
                          placeholder="외워서 타이핑해 보세요..."
                          className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 w-64 focus:outline-indigo-500"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
                        >
                          채점
                        </button>
                      </form>
                    )}
                  </div>

                  {speakingError && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{speakingError}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Native Speaker Tips & Nuance Accordion */}
            {currentLine.nativeTips && (
              <div className="mt-4 p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm mb-1">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>현지인 꿀팁 & 문화적 뉘앙스</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-950/80 leading-relaxed">
                  {currentLine.nativeTips}
                </p>
                {/* Alternatives */}
                {currentLine.alternatives && currentLine.alternatives.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-amber-200/50">
                    <span className="text-[11px] font-bold text-amber-800 block mb-1">
                      원어민들의 다른 표현:
                    </span>
                    <ul className="list-disc list-inside text-xs text-amber-900 space-y-0.5">
                      {currentLine.alternatives.map((alt, i) => (
                        <li key={i}>{alt}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Step Navigation Button */}
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  if (currentStepIndex > 0) {
                    setCurrentStepIndex(currentStepIndex - 1);
                    setTranscript('');
                    setScoreResult(null);
                  }
                }}
                disabled={currentStepIndex === 0}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                이전 단계
              </button>

              <button
                onClick={handleNextStep}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
              >
                <span>
                  {currentStepIndex < dialogue.length - 1
                    ? '다음 대화 진행'
                    : '이 상황 마스터 완료! 🎉'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
