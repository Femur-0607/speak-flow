# SLA-Pilot (제2언어습득론 기반 현지 실전 언어 내비게이터) 🧭🎙️📖

> **학술 근거:** 응용언어학 및 제2언어습득론(Second Language Acquisition, SLA) 5대 논문 체계화  
> **1차 목적:** 현지 실전 스피킹 (Merrill Swain의 출력 가설 & Willem Levelt의 음성 산출 모델)  
> **2차 목적:** 현지 실전 텍스트 리딩 (Robert Frost의 표기 심도 가설 & Lev Vygotsky의 비계 페이딩)  
> **대상 언어:** 🇯🇵 일본어(日本語) & 🇺🇸 영어(English)

---

## 🏛️ 응용언어학 및 SLA 논문 아카이브 (`docs/linguistics/`)

본 프로젝트는 단순 암기식 앱이 아닌, 엄밀한 인지언어학 및 심리언어학 연구를 기반으로 코드가 설계되었습니다:

1. [**01. 스웨인의 출력 가설 (Output Hypothesis)**](docs/linguistics/01_output_hypothesis_swain.md)
   * *핵심 문헌:* Swain, M. (1985, 1995, 2005)
   * *해결 과제:* 듣기/읽기만으로는 입이 트이지 않는 이유와, 통사적 처리(Syntactic Processing) 및 공백 인지(Noticing the Gap)의 필수성.
2. [**02. 레벨트의 음성 산출 모델과 청크 자동화 (Speech Production & Chunks)**](docs/linguistics/02_speech_production_model_levelt.md)
   * *핵심 문헌:* Levelt, W. J. M. (1989), Pawley & Syder (1983), Sinclair (1991)
   * *해결 과제:* 현지에서 말이 얼어붙는 '정식화기 병목 현상(Formulator Bottleneck)' 해소 및 고정 관용 청크 인출 회로 구축.
3. [**03. 카도타의 쉐도잉 인지 기제와 작업 기억 (Shadowing & Working Memory)**](docs/linguistics/03_shadowing_and_working_memory_kadota.md)
   * *핵심 문헌:* Kadota, S. (門田 修平, 2014), Baddeley, A. D. (1986), Tamai, K. (1997)
   * *해결 과제:* 모국어 번역 회로 차단, 청각-운동 연합(Arcuate Fasciculus), 일본어 피치 악센트 및 영어 연음 체득.
4. [**04. 표기 심도와 실전 리딩의 비계 설정 (Orthographic Depth & Scaffolding)**](docs/linguistics/04_orthographic_depth_and_reading_scaffolding.md)
   * *핵심 문헌:* Frost et al. (1987), Perfetti et al. (2007), Vygotsky (1978), Nation (2001)
   * *해결 과제:* '후리가나의 딜레마' 해결(점진적 페이딩), 현지 간판/메뉴판 스캐닝(Scanning) 훈련.
5. [**05. 과업 중심 언어 교수법과 화용론 (TBLT & Sociopragmatics)**](docs/linguistics/05_tblt_situational_curriculum.md)
   * *핵심 문헌:* Ellis, R. (2003), Skehan, P. (1998), Thomas, J. (1983)
   * *해결 과제:* 실전 과업 수행 사이클 및 현지 문화적 호감을 얻는 화용론적 뉘앙스(Native Polish).

---

## 🌟 핵심 구현 기능

### 1. 🎙️ 현지 실전 스피킹 (Situational Speaking)
* **현지 리얼 시나리오**: 카페 주문/커스텀, 이자카야/식당 더치페이, 편의점 봉투/도시락 온열, 복잡한 전철역 승강장/출구, 호텔 체크인 전 짐 보관 등.
* **실시간 Web Speech STT & 음성 유사도 채점**: 마이크로 발화 시 목표 문장과 음운/어휘 일치율(0~100점)을 정밀 채점하고 불일치 단어를 시각적으로 하이라이트.
* **현지인 화용론 팁**: 일본어의 공손한 사양 표현(`大丈夫です`), 영어 주문의 표준 프레임(`Can I get...`) 등 수록.

### 2. 🎧 3단계 쉐도잉(Shadowing) 트레이닝
* `원어민 듣기` → `즉시 마이크 복창(Shadowing)` → `AI 발음 비교` 루틴을 통해 조음 근육 기억(Muscle Memory) 확립.

### 3. 📖 현지 실전 리딩 시뮬레이터 (Local Reading Simulator)
* 라멘집 자판기(`替玉`, `かため`, `うすめ`), 지하철 개찰구(`改札口`, `精算機`), 브런치 카페 메뉴(`Over-easy`, `GF`), 공항 전광판(`Boarding Now`, `Final Call`) 등 실제 시각 자료 재현.
* **후리가나 토글(비계 페이딩)**: 초보 모드(후리가나 ON) vs 실전 모드(후리가나 OFF) 전환 및 단어 터치 팝업 사전 제공.
* **상황 퀴즈**: 현지 상황 질문에 맞추어 올바른 버튼이나 옵션을 골라내는 즉각 퀴즈 탑재.

### 4. 🤖 AI 실시간 롤플레잉 파트너
* 현지 바리스타, 이자카야 셰프, 호텔 직원 페르소나와 마이크 음성 대화.
* 내가 말한 문장에 대해 **"더 자연스러운 원어민 현지 표현 (Native Polish)"** 실시간 피드백.

### 5. 🏛️ 인앱 SLA 언어학 연구소
* 5대 논문의 핵심 이론, 해결 과제, 구현 방식을 앱 내에서 인터랙티브하게 열람 가능.

---

## 🚀 빠른 시작

```bash
# 디렉터리 이동
cd C:\Users\didwl\.gemini\antigravity\scratch\speak-flow

# 패키지 설치
npm install

# 로컬 개발 서버 실행
npm run dev
```

브라우저에서 **`http://localhost:5173/`** 접속
