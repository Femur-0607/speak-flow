import React, { useState } from 'react';
import type { SituationCategory, DialogueLine, UserSettings } from '../types';
import { FuriganaText } from './FuriganaText';
import { speechService } from '../utils/speech';
import { calculateSpeakingScore } from '../utils/similarity';
import type { SimilarityResult } from '../utils/similarity';
import {
  Volume2,
  Mic,
  MicOff,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShadowingTrainerProps {
  situations: SituationCategory[];
  settings: UserSettings;
  onSaveExpression: (dialogue: DialogueLine) => void;
  isExpressionSaved: (id: string) => boolean;
}

export const ShadowingTrainer: React.FC<ShadowingTrainerProps> = ({
  situations,
  settings,
  onSaveExpression,
  isExpressionSaved,
}) => {
  // Flatten user sentences from all situations
  const allUserLines: { line: DialogueLine; categoryTitle: string }[] = [];
  situations.forEach((cat) => {
    cat.dialogue
      .filter((d) => d.speaker === 'user')
      .forEach((line) => {
        allUserLines.push({ line, categoryTitle: cat.titleKo });
      });
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [scoreResult, setScoreResult] = useState<SimilarityResult | null>(null);
  const [repeatCount, setRepeatCount] = useState<number>(0);

  const currentItem = allUserLines[currentIndex] || allUserLines[0];
  const currentLine = currentItem?.line;

  const playAudio = () => {
    if (!currentLine) return;
    setIsPlayingAudio(true);
    speechService.speak(
      currentLine.audioText,
      settings.language,
      settings.speechRate,
      () => {
        setIsPlayingAudio(false);
        setRepeatCount((prev) => prev + 1);
      },
      () => setIsPlayingAudio(false)
    );
  };

  const startShadowing = () => {
    if (!currentLine) return;
    setTranscript('');
    setScoreResult(null);

    setIsListening(true);
    speechService.startListening(
      settings.language,
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal) {
          const res = calculateSpeakingScore(text, currentLine.text, settings.language);
          setScoreResult(res);
          if (res.score >= 80) {
            try {
              confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
            } catch {}
          }
        }
      },
      () => setIsListening(false),
      () => setIsListening(false)
    );
  };

  const handleNext = () => {
    if (currentIndex < allUserLines.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTranscript('');
      setScoreResult(null);
      setRepeatCount(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setTranscript('');
      setScoreResult(null);
      setRepeatCount(0);
    }
  };

  if (!currentLine) {
    return <div className="text-center p-8 text-slate-500">훈련할 문장이 없습니다.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Intro info */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            쉐도잉(Shadowing) 트레이닝
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            원어민 억양과 호흡을 따라하는 실전 3단계 훈련
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            1단계: 귀로 듣기 → 2단계: 입으로 즉시 복창하기 → 3단계: AI 발음 정밀 분석
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-slate-700">
            {currentIndex + 1} / {allUserLines.length}
          </div>
          <div className="text-xs text-slate-400">문장</div>
        </div>
      </div>

      {/* Main Shadowing Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
            상황: {currentItem.categoryTitle}
          </span>
          <button
            onClick={() => onSaveExpression(currentLine)}
            className={`p-2 rounded-xl border transition-colors ${
              isExpressionSaved(currentLine.id)
                ? 'bg-amber-50 border-amber-200 text-amber-600'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
          >
            {isExpressionSaved(currentLine.id) ? (
              <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-500" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Big sentence view */}
        <div className="py-6 text-center">
          <div className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-relaxed mb-3">
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

          {currentLine.romajiOrIpa && (
            <div className="text-sm text-indigo-600 font-mono mb-2">
              {currentLine.romajiOrIpa}
            </div>
          )}

          <div className="text-base sm:text-lg font-medium text-slate-600">
            {currentLine.translationKo}
          </div>
        </div>

        {/* 2 Big Action Buttons: Listen & Shadow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
          {/* 1. Listen Button */}
          <button
            onClick={playAudio}
            className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all ${
              isPlayingAudio
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 animate-pulse'
                : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-slate-800'
            }`}
          >
            <Volume2 className="w-7 h-7 text-indigo-600 mb-1" />
            <span className="font-bold text-sm">1. 원어민 음성 듣기</span>
            <span className="text-xs text-slate-500 mt-0.5">
              {isPlayingAudio ? '재생 중...' : `재생 횟수: ${repeatCount}회 (${settings.speechRate}x)`}
            </span>
          </button>

          {/* 2. Speak Button */}
          <button
            onClick={isListening ? () => speechService.stopListening() : startShadowing}
            className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all ${
              isListening
                ? 'border-red-600 bg-red-50 text-red-700 animate-mic'
                : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-slate-800'
            }`}
          >
            {isListening ? (
              <MicOff className="w-7 h-7 text-red-600 mb-1" />
            ) : (
              <Mic className="w-7 h-7 text-indigo-600 mb-1" />
            )}
            <span className="font-bold text-sm">
              {isListening ? '음성 감지 중 (완료 시 터치)' : '2. 따라 말하기 (Shadowing)'}
            </span>
            <span className="text-xs text-slate-500 mt-0.5">
              마이크를 켜고 즉시 따라 말해보세요
            </span>
          </button>
        </div>

        {/* Real-time speech result */}
        {scoreResult && (
          <div className="mt-6 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 animate-in fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-900">쉐도잉 발음 피드백</span>
              <span className="text-sm font-extrabold text-indigo-700 px-2.5 py-0.5 rounded-full bg-white shadow-2xs">
                {scoreResult.score}점
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium mb-3">
              {scoreResult.feedbackKo}
            </p>
            <div className="text-xs text-slate-500">
              <span className="font-semibold text-slate-700">인식된 발음: </span>
              {transcript || '(인식 실패)'}
            </div>
          </div>
        )}

        {/* Navigation bottom */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-30"
          >
            이전 문장
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === allUserLines.length - 1}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition-all disabled:opacity-40"
          >
            <span>다음 문장으로</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
