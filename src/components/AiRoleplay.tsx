import React, { useState, useEffect, useRef } from 'react';
import type { UserSettings } from '../types';
import { speechService } from '../utils/speech';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Volume2,
  Lightbulb,
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  translationKo?: string;
  polishSuggestion?: {
    nativeText: string;
    explanationKo: string;
  };
}

interface Persona {
  id: string;
  name: string;
  roleKo: string;
  avatar: string;
  greetingJa: string;
  greetingEn: string;
  greetingKoJa: string;
  greetingKoEn: string;
  hintsJa: string[];
  hintsEn: string[];
}

const PERSONAS: Persona[] = [
  {
    id: 'cafe-barista',
    name: 'Ken / Sarah',
    roleKo: '시부야 / 브루클린 카페 바리스타',
    avatar: '☕',
    greetingJa: 'いらっしゃいませ！店内でお召し上がりですか？テイクアウトですか？',
    greetingEn: 'Hey there! What can I get started for you today? Having it here or to go?',
    greetingKoJa: '어서오세요! 매장에서 드시고 가시나요? 포장이신가요?',
    greetingKoEn: '안녕하세요! 오늘 어떤 음료로 준비해 드릴까요? 매장 이용이신가요, 포장이신가요?',
    hintsJa: [
      '持ち帰りでアイスカフェラテを一つお願いします。 (포장으로 아이스 카페라떼 하나 부탁드려요)',
      '氷少なめでできますか？ (얼음 적게 가능한가요?)',
      'おすすめのペストリーは何ですか？ (추천 베이커리는 무엇인가요?)',
    ],
    hintsEn: [
      'Can I get an iced latte with oat milk to go, please?',
      'Could you make that light on ice?',
      'What kind of beans do you have for drip coffee?',
    ],
  },
  {
    id: 'izakaya-chef',
    name: 'Hiro / Mike',
    roleKo: '도톤보리 이자카야 / 로컬 펍 바텐더',
    avatar: '🍻',
    greetingJa: 'いらっしゃい！お疲れ様です！お飲み物は何からいきますか？',
    greetingEn: 'Welcome in folks! Grab a seat anywhere. What can I pour for you first?',
    greetingKoJa: '어서오세요! 수고 많으셨습니다! 마실 것은 무엇부터 시작하시겠어요?',
    greetingKoEn: '환영합니다! 편한 곳에 앉으세요. 첫 잔으로 무엇을 드릴까요?',
    hintsJa: [
      'とりあえず生ビール二つください！ (일단 생맥주 두 잔 주세요!)',
      'おすすめの焼き鳥は何ですか？ (추천 닭꼬치는 무엇인가요?)',
      'お会計、別々でお願いします。 (계산 따로 부탁드립니다)',
    ],
    hintsEn: [
      'We will start with two draft beers, please!',
      'What is on tap today?',
      'Could we get the check when you have a moment?',
    ],
  },
  {
    id: 'hotel-front',
    name: 'Yuki / Emily',
    roleKo: '호텔 프론트 데스크 안내원',
    avatar: '🏨',
    greetingJa: 'こんにちは、ご宿泊ですね。ご予約のお名前を伺えますでしょうか？',
    greetingEn: 'Good afternoon, welcome to our hotel! Are you checking in today?',
    greetingKoJa: '안녕하세요, 숙박이시군요. 예약자 성함을 여쭤봐도 될까요?',
    greetingKoEn: '안녕하세요, 저희 호텔에 오신 것을 환영합니다! 오늘 체크인이신가요?',
    hintsJa: [
      '予約しているキムと申します。(예약한 김이라고 합니다)',
      'チェックイン前ですが、荷物を預かってもらえますか？ (체크인 전인데 짐을 맡길 수 있나요?)',
      'Wi-Fiのパスワードを教えていただけますか？ (와이파이 비밀번호 알려주시겠어요?)',
    ],
    hintsEn: [
      'Hi, I have a reservation under the name Kim.',
      'Could we leave our luggage here until check-in time?',
      'Is breakfast included with the room?',
    ],
  },
];

interface AiRoleplayProps {
  settings: UserSettings;
}

export const AiRoleplay: React.FC<AiRoleplayProps> = ({
  settings,
}) => {
  const isJa = settings.language === 'ja';
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(PERSONAS[0].id);
  const persona = PERSONAS.find((p) => p.id === selectedPersonaId) || PERSONAS[0];

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize greeting on persona or language change
  useEffect(() => {
    const greeting = isJa ? persona.greetingJa : persona.greetingEn;
    const greetingKo = isJa ? persona.greetingKoJa : persona.greetingKoEn;

    setMessages([
      {
        id: 'msg-greeting',
        sender: 'ai',
        text: greeting,
        translationKo: greetingKo,
      },
    ]);
  }, [selectedPersonaId, settings.language]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakText = (text: string) => {
    speechService.speak(text, settings.language, settings.speechRate);
  };

  const handleStartMic = () => {
    if (!speechService.isSpeechRecognitionSupported()) {
      alert('브라우저가 마이크 음성 인식을 지원하지 않습니다. 키보드로 입력해 주세요.');
      return;
    }

    setIsListening(true);
    speechService.startListening(
      settings.language,
      (text, isFinal) => {
        setInputText(text);
        if (isFinal) {
          setIsListening(false);
          sendMessage(text);
        }
      },
      () => setIsListening(false),
      () => setIsListening(false)
    );
  };

  const handleStopMic = () => {
    speechService.stopListening();
    setIsListening(false);
    if (inputText.trim()) {
      sendMessage(inputText.trim());
    }
  };

  const generateLocalAiResponse = (userMsg: string): { reply: string; replyKo: string; polish?: { nativeText: string; explanationKo: string } } => {
    const low = userMsg.toLowerCase();

    if (isJa) {
      if (low.includes('持ち帰り') || low.includes('テイクアウト') || low.includes('to go')) {
        return {
          reply: 'かしこまりました！持ち帰りですね。お会計は850円になります。Suica、カード、現金のどちらになさいますか？',
          replyKo: '잘 알겠습니다! 포장이시군요. 계산은 850엔입니다. 스이카, 카드, 현금 중 어떤 것으로 결제하시겠어요?',
          polish: {
            nativeText: 'テイクアウトでお願いします / 持ち帰りで！',
            explanationKo: '현지에서는 "テイクアウトで" 또는 "持ち帰りでお願いします"가 가장 깔끔하고 예의바른 주문 표현입니다.',
          },
        };
      } else if (low.includes('ビール') || low.includes('生') || low.includes('beer')) {
        return {
          reply: '生ビールですね！キンキンに冷えたジョッキでお持ちします！すぐ出る枝豆や冷奴もいかがですか？',
          replyKo: '생맥주군요! 시원하게 차가운 잔으로 가져다드리겠습니다! 바로 나오는 완두콩이나 연두부도 어떠세요?',
          polish: {
            nativeText: 'とりあえず生ビール二つください！',
            explanationKo: '이자카야에서는 첫 주문 시 "とりあえず生(토리아에즈 나마)"라고 하면 아주 자연스러운 현지인 느낌을 줍니다.',
          },
        };
      } else if (low.includes('荷物') || low.includes('預か') || low.includes('bag') || low.includes('luggage')) {
        return {
          reply: 'はい、もちろんお預かりいたします！番号札をお渡ししますので、チェックイン時にフロントへご提示ください。',
          replyKo: '네, 물론 맡아드리겠습니다! 번호표를 드릴 테니 체크인하실 때 프론트에 보여주세요.',
          polish: {
            nativeText: 'チェックイン前ですが、荷物を預かってもらえますか？',
            explanationKo: '"~前ですが (전입니다만)"를 붙이면 상황을 설명하면서 매우 정중하게 요청할 수 있습니다.',
          },
        };
      } else {
        return {
          reply: 'かしこまりました！他にご要望や質問はございますか？',
          replyKo: '잘 알겠습니다! 혹시 다른 요청사항이나 질문이 있으실까요?',
          polish: {
            nativeText: `${userMsg}、お願いします。(오네가이시마스)`,
            explanationKo: '끝에 "お願いします"를 붙여주면 현지 어디서든 공손하고 호감 가는 표현이 됩니다.',
          },
        };
      }
    } else {
      // English
      if (low.includes('latte') || low.includes('coffee') || low.includes('americano') || low.includes('to go')) {
        return {
          reply: 'Coming right up! That will be $5.25. You can tap your card on the terminal whenever you are ready.',
          replyKo: '곧 준비해 드릴게요! 5.25달러입니다. 준비되시면 카드 단말기에 탭해 주세요.',
          polish: {
            nativeText: 'Can I get an iced Americano to go, please?',
            explanationKo: '"Give me" 대신 "Can I get [음료], please?"를 사용하면 훨씬 친근하고 정중합니다.',
          },
        };
      } else if (low.includes('beer') || low.includes('draft') || low.includes('drink')) {
        return {
          reply: 'Two pints of IPA coming right up! Care to open a tab, or do you want to close out now?',
          replyKo: 'IPA 맥주 두 잔 바로 준비할게요! 카드를 맡겨두고 계속 드실 건가요(Open a tab), 아니면 바로 계산하시겠어요?',
          polish: {
            nativeText: 'We will start with two draft beers, please.',
            explanationKo: '펍에서는 "Can we start with..."로 주문을 시작하면 아주 유창한 원어민 뉘앙스가 됩니다.',
          },
        };
      } else {
        return {
          reply: 'Sounds great! Let me take care of that for you right now.',
          replyKo: '좋습니다! 지금 바로 처리해 드릴게요.',
          polish: {
            nativeText: `Could you help me with that, please?`,
            explanationKo: '끝에 "please"나 문두에 "Could you..."를 쓰면 원어민들이 선호하는 공손한 요청체가 됩니다.',
          },
        };
      }
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isGenerating) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsGenerating(true);

    setTimeout(() => {
      const generated = generateLocalAiResponse(text.trim());
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: generated.reply,
        translationKo: generated.replyKo,
        polishSuggestion: generated.polish,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsGenerating(false);

      // Speak AI reply
      speakText(generated.reply);
    }, 600);
  };

  const handleUseHint = (hint: string) => {
    const cleanHint = hint.split('(')[0].trim();
    setInputText(cleanHint);
  };

  const currentHints = isJa ? persona.hintsJa : persona.hintsEn;

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12">
      {/* Persona Switcher Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              실시간 AI 롤플레잉 파트너
            </h2>
            <p className="text-xs text-slate-500">
              마이크로 대화하며 실시간 원어민 뉘앙스 교정 피드백 받기
            </p>
          </div>
        </div>

        {/* Persona Buttons */}
        <div className="flex items-center gap-2">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPersonaId(p.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                selectedPersonaId === p.id
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{p.avatar}</span>
              <span className="hidden sm:inline">{p.roleKo.split('/')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation Box */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md flex flex-col h-[520px] overflow-hidden">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`flex items-start gap-2.5 max-w-[85%] sm:max-w-[75%] ${
                  msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-base shadow-2xs">
                  {msg.sender === 'user' ? '🙋‍♂️' : persona.avatar}
                </div>

                {/* Bubble */}
                <div
                  className={`p-4 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-bold opacity-75">
                      {msg.sender === 'user' ? '나' : persona.name}
                    </span>
                    <button
                      onClick={() => speakText(msg.text)}
                      className="p-1 rounded-md hover:bg-black/10 transition-colors"
                      title="음성 다시 듣기"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-sm sm:text-base font-semibold leading-relaxed">
                    {msg.text}
                  </p>

                  {msg.translationKo && (
                    <p
                      className={`text-xs mt-1.5 font-medium ${
                        msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-500'
                      }`}
                    >
                      {msg.translationKo}
                    </p>
                  )}
                </div>
              </div>

              {/* Polish Suggestion Box (If available for user message) */}
              {msg.polishSuggestion && (
                <div className="mt-2 ml-10 p-3 bg-amber-50 border border-amber-200 rounded-xl text-left max-w-[80%] text-xs shadow-2xs animate-in fade-in">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold mb-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>더 자연스러운 원어민 현지 표현 추천:</span>
                  </div>
                  <div className="font-extrabold text-slate-900 text-sm">
                    "{msg.polishSuggestion.nativeText}"
                  </div>
                  <div className="text-slate-600 mt-0.5 font-medium">
                    {msg.polishSuggestion.explanationKo}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isGenerating && (
            <div className="flex items-center gap-2 text-xs text-slate-500 p-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span>{persona.name} 님이 대답을 생각하고 있습니다...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Conversation Hints Bar */}
        <div className="px-4 py-2 bg-slate-100/80 border-t border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 shrink-0">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>추천 문장:</span>
          </div>
          {currentHints.map((hint, idx) => (
            <button
              key={idx}
              onClick={() => handleUseHint(hint)}
              className="text-[11px] px-2.5 py-1 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg border border-slate-200 shrink-0 truncate max-w-xs transition-colors"
              title="클릭하여 입력창에 넣기"
            >
              {hint}
            </button>
          ))}
        </div>

        {/* Input Controls */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          {/* Big Mic Button */}
          <button
            onClick={isListening ? handleStopMic : handleStartMic}
            className={`p-3 rounded-2xl flex items-center justify-center transition-all ${
              isListening
                ? 'bg-red-600 text-white animate-mic shadow-md shadow-red-200'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
            }`}
            title="마이크로 말하기"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(inputText);
            }}
            className="flex-1 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isListening
                  ? '마이크로 말씀하시는 중입니다...'
                  : isJa
                  ? '일본어로 말해보거나 입력하세요 (예: 持ち帰りでお願いします)'
                  : 'Type or speak in English (e.g. Can I get an iced latte?)'
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-indigo-500 bg-slate-50/50"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isGenerating}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl transition-all shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
