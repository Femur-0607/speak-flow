import { useState } from 'react';
import {
  GraduationCap,
  FileText,
  ChevronDown,
  Sparkles,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface ResearchTopic {
  id: string;
  titleKo: string;
  theorists: string;
  keyYear: string;
  badge: string;
  summary: string;
  problemSolved: string;
  appImplementation: string;
  docPath: string;
}

const RESEARCH_TOPICS: ResearchTopic[] = [
  {
    id: 'swain',
    titleKo: '스웨인의 출력 가설 (Output Hypothesis)',
    theorists: 'Merrill Swain (토론토 대학교 응용언어학 교수)',
    keyYear: '1985, 1995',
    badge: '스피킹 핵심 근거',
    summary:
      '듣기와 읽기(입력)만으로는 "의미적 처리(대충 뜻만 이해)"에 머물러 입이 트이지 않습니다. 실제로 말을 뱉는 순간 문장의 정확한 어순과 형태소를 맞추어야 하는 "통사적 처리(Syntactic Processing)"가 강제되며, 내가 하고 싶은 말과 원어민 표현 간의 괴리(Noticing the Gap)를 뇌가 깨닫게 됩니다.',
    problemSolved:
      '수년간 미드/일드 보고 단어장 외워도 외국인 앞에만 서면 말이 한마디도 안 나오는 현상 해결',
    appImplementation:
      '[현지 실전 스피킹]에서 마이크로 직접 말하도록 강제하고, 내가 말한 음성 텍스트와 목표 문장을 시각적으로 1:1 대조하여 불일치 단어를 즉시 인지하도록 구현했습니다.',
    docPath: 'docs/linguistics/01_output_hypothesis_swain.md',
  },
  {
    id: 'levelt',
    titleKo: '레벨트의 음성 산출 모델과 청크(Chunk) 자동화',
    theorists: 'Willem Levelt (막스 플랑크 심리언어학 연구소), John Sinclair',
    keyYear: '1989, 1991',
    badge: '유창성 & 즉답 회로',
    summary:
      '인간의 언어 산출은 "개념화 → 정식화(문법/어휘 계산) → 조음"의 단계를 거칩니다. 외국어 학습자는 정식화 단계(Formulator)에서 단어와 문법을 일일이 조립하느라 뇌의 작업 기억이 마비(Freezing)됩니다. 원어민은 문법을 조립하는 것이 아니라 정형화된 통청크(Formulaic Sequences)를 인출합니다.',
    problemSolved:
      '현지 점원의 질문에 머릿속으로 문법 계산하느라 3~5초 이상 침묵이 생기는 어색함 해결',
    appImplementation:
      '단어 낱개가 아닌 "Can I get [메뉴] to go?", "氷少なめでお願いします" 같은 현지 필수 고정 프레임을 청크 단위로 학습하여 0.5초 만에 반사적으로 튀어나오게 설계했습니다.',
    docPath: 'docs/linguistics/02_speech_production_model_levelt.md',
  },
  {
    id: 'kadota',
    titleKo: '카도타의 쉐도잉 인지 기제와 작업 기억 모델',
    theorists: 'Shinichi Kadota (門田 修平 교수), Alan Baddeley',
    keyYear: '1986, 2014',
    badge: '원어민 억양 & 박자',
    summary:
      '원어민 음성을 0.5초 시차를 두고 그림자처럼 따라 말하는 쉐도잉은 "듣기 → 한국어 번역 → 외국어 작문"의 번역 회로를 물리적으로 끊어버립니다. 청각과 조음 근육을 직결하여 일본어 고저 악센트(Pitch Accent)와 영어 연음(Connected Speech)을 무의식적으로 복제합니다.',
    problemSolved:
      '또박또박 읽는 어색한 한국인 특유의 억양과, 듣자마자 한국어로 번역하려는 느린 인지 속도 해결',
    appImplementation:
      '[쉐도잉 트레이닝] 탭에서 원어민 음성 듣기 → 즉시 복창(마이크) → AI 정밀 발음 일치도 분석의 3단계 루틴을 제공합니다.',
    docPath: 'docs/linguistics/03_shadowing_and_working_memory_kadota.md',
  },
  {
    id: 'orthography',
    titleKo: '표기 심도(Orthographic Depth)와 비계 페이딩',
    theorists: 'Robert Frost, Lev Vygotsky, Charles Perfetti',
    keyYear: '1978, 1987, 2007',
    badge: '실전 리딩 & 후리가나',
    summary:
      '일본어는 표의문자(한자)와 음소문자(가나)가 뒤섞인 독특한 체계입니다. 한자 위에 히라가나(후리가나)가 항상 붙어있으면 뇌는 한자를 보지 않고 위의 히라가나만 읽는 편법을 씁니다. 반면 아예 없으면 포기하게 됩니다. 따라서 점진적으로 비계를 걷어내는(Fading) 기법이 필수적입니다.',
    problemSolved:
      '후리가나 달린 교재로는 잘 읽히는데, 막상 도쿄 현지 식당 자판기나 역 간판 앞에 서면 까막눈이 되는 현상 해결',
    appImplementation:
      '[현지 실전 리딩]에서 초보 모드(후리가나 ON)와 실전 모드(후리가나 OFF)를 스위치 하나로 전환할 수 있으며, 모르는 단어만 터치해 팝업으로 발음/뜻을 확인하는 온디맨드 사전을 탑재했습니다.',
    docPath: 'docs/linguistics/04_orthographic_depth_and_reading_scaffolding.md',
  },
  {
    id: 'tblt',
    titleKo: '과업 중심 언어 교수법(TBLT)과 화용론(Pragmatics)',
    theorists: 'Rod Ellis (옥스퍼드 언어학자), Jenny Thomas',
    keyYear: '1983, 2003',
    badge: '문화적 호감 & 뉘앙스',
    summary:
      '단순 문법 암기가 아닌 현실의 구체적 목표("얼음 적게 넣은 라떼 포장 주문하기")를 달성하는 과정에서 가장 빠르고 영구적인 언어 습득이 일어납니다. 또한 문법만 맞고 문화적으로 무례한 표현을 방지하는 화용론적 세련됨(Pragmatic Competence)을 함께 길러야 합니다.',
    problemSolved:
      '문법은 맞는데 현지인 점원을 당황하게 하거나 불친절하게 들리는 무미건조한 교과서체 어투 해결',
    appImplementation:
      '[AI 프리토킹 롤플레잉]에서 내가 말한 문장을 분석하여 "더 자연스러운 현지 원어민 표현 (Native Polish)"을 실시간 추천해 줍니다.',
    docPath: 'docs/linguistics/05_tblt_situational_curriculum.md',
  },
];

export const LinguisticsResearchView = () => {
  const [openTopicId, setOpenTopicId] = useState<string>(RESEARCH_TOPICS[0].id);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs font-bold mb-3">
            <GraduationCap className="w-4 h-4 text-indigo-300" />
            <span>SLA (Second Language Acquisition) 학술 연구소</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
            언어학 논문과 과학적 데이터로 입증된 <br />
            <span className="text-indigo-400">현지 실전 언어 습득 엔진</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            단순히 단어를 암기시키는 비효율적인 방식에서 벗어나, 세계적인 인지심리학자와 응용언어학자들의
            검증된 연구 논문을 소프트웨어 기능으로 1:1 직결했습니다.
          </p>
        </div>
      </div>

      {/* Accordion / List of Research Papers */}
      <div className="space-y-4">
        {RESEARCH_TOPICS.map((topic, index) => {
          const isOpen = openTopicId === topic.id;
          return (
            <div
              key={topic.id}
              className={`rounded-2xl border transition-all duration-200 bg-white shadow-xs ${
                isOpen
                  ? 'border-indigo-400 ring-2 ring-indigo-500/10 shadow-md'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => setOpenTopicId(isOpen ? '' : topic.id)}
                className="w-full p-5 text-left flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-extrabold text-sm flex items-center justify-center shrink-0 mt-0.5">
                    0{index + 1}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                        {topic.badge}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {topic.theorists} ({topic.keyYear})
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {topic.titleKo}
                    </h3>
                  </div>
                </div>

                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'transform rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-6 pt-1 border-t border-slate-100 space-y-4 text-xs sm:text-sm animate-in fade-in">
                  {/* Summary */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                      <span>핵심 학술 이론 (Theoretical Core)</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {topic.summary}
                    </p>
                  </div>

                  {/* Problem vs App Solution */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200">
                      <div className="font-bold text-rose-900 text-xs mb-1">
                        ⚠️ 기존 학습법의 문제점
                      </div>
                      <p className="text-rose-800 text-xs leading-relaxed">
                        {topic.problemSolved}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                      <div className="font-bold text-emerald-900 text-xs mb-1 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>SpeakFlow의 구현 솔루션</span>
                      </div>
                      <p className="text-emerald-800 text-xs leading-relaxed">
                        {topic.appImplementation}
                      </p>
                    </div>
                  </div>

                  {/* Markdown File Link */}
                  <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 font-mono text-[11px] bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">
                      <FileText className="w-3.5 h-3.5 text-indigo-500" />
                      {topic.docPath}
                    </span>
                    <span className="text-indigo-600 font-semibold flex items-center gap-1">
                      상세 논문 요약본 수록 완료 <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
