# 🏛️ 응용언어학 및 제2언어습득론(SLA) 학술 근거 체계

본 프로젝트는 단순한 단어 암기 앱이 아니라, **세계적인 인지심리학 및 제2언어습득론(Second Language Acquisition, SLA) 논문과 학술적 이론**을 뼈대로 삼아 설계된 실전 언어 학습 엔진입니다.

---

## 📑 등재 논문 및 연구 프레임워크 목차

1. [**01. 스웨인의 출력 가설 (Swain's Output Hypothesis)**](./01_output_hypothesis_swain.md)
   * *핵심 주제:* 왜 듣기/읽기만으로는 말이 트이지 않는가? 발화 공백 인지(Noticing the Gap)와 통사적 처리(Syntactic Processing)의 필수성.
2. [**02. 레벨트의 음성 산출 모델 (Levelt's Speech Production Model)**](./02_speech_production_model_levelt.md)
   * *핵심 주제:* 현지에서 말이 얼어붙는 '정식화기 병목 현상(Formulator Bottleneck)' 분석 및 정형화된 언어 청크(Lexical Chunks) 자동화 전략.
3. [**03. 카도타의 쉐도잉 인지 기제 (Kadota's Shadowing Mechanism)**](./03_shadowing_and_working_memory_kadota.md)
   * *핵심 주제:* 배들리(Baddeley)의 작업 기억 모델과 음운 루프(Phonological Loop), 번역 회로를 끊어내는 청각-운동 연합(Auditory-Motor Coupling).
4. [**04. 표기 심도와 실전 리딩의 비계 설정 (Orthographic Depth & Scaffolding)**](./04_orthographic_depth_and_reading_scaffolding.md)
   * *핵심 주제:* 한자-가나 복합 표기 체계의 인지 부하 해소, 후리가나 점진적 페이딩(Fading) 및 현지 간판/메뉴판 스캐닝(Scanning) 훈련.
5. [**05. 과업 중심 언어 교수법과 화용론 (TBLT & Sociopragmatics)**](./05_tblt_situational_curriculum.md)
   * *핵심 주제:* Ellis의 과업 사이클(Pre-task → Task → Language Focus)과 현지인에게 호감을 주는 문화적 뉘앙스(Pragmatic Competence).
6. [**06. 기술 습득 이론과 암묵적 지식 검증 (Automaticity & Implicit Knowledge)**](./06_automaticity_and_implicit_knowledge_validation.md)
   * *핵심 주제:* DeKeyser의 지식 3단계(선언적→절차적→자동화), Bjork의 바람직한 어려움(Desirable Difficulties), 무단서 인출(Blind Recall)과 발화 잠복기(Latency)를 통한 진정한 체득 검증.

---

## 🔬 학술 이론 - 앱 아키텍처 매핑 매트릭스

```
┌─────────────────────────────────┬────────────────────────────────────────┬───────────────────────────────────────────┐
│ 응용언어학 이론 및 연구자       │ 핵심 과학적 기제                       │ SpeakFlow 앱 소프트웨어 구현 컴포넌트     │
├─────────────────────────────────┼────────────────────────────────────────┼───────────────────────────────────────────┤
│ Merrill Swain (1985, 1995)      │ Noticing Function, Pushed Output       │ src/components/SituationSpeaking.tsx      │
│ Output Hypothesis               │ 내가 말한 STT 음성과 목표 문장의 공백 대조 │ 실시간 발음 유사도 채점 및 불일치 단어 감지│
├─────────────────────────────────┼────────────────────────────────────────┼───────────────────────────────────────────┤
│ Willem Levelt (1989)            │ Formulator Bottleneck, Automaticity    │ src/data/situations.ts                    │
│ John Sinclair (1991) Chunking   │ 문법 조립이 아닌 통청크(Chunk) 인출     │ 고정된 프레임(Can I get..., 〜お願いします) │
├─────────────────────────────────┼────────────────────────────────────────┼───────────────────────────────────────────┤
│ Shinichi Kadota (2014)          │ Phonological Loop, Arcuate Fasciculus  │ src/components/ShadowingTrainer.tsx       │
│ Alan Baddeley (1986)            │ 소리 즉시 복창을 통한 조음 근육 기억   │ 듣기 → 따라하기 → 비교하기 3단계 루틴     │
├─────────────────────────────────┼────────────────────────────────────────┼───────────────────────────────────────────┤
│ Frost et al. (1987)             │ Orthographic Depth, Scaffolding Fading │ src/components/LocalReading.tsx           │
│ Lev Vygotsky (1978)             │ 후리가나 상시 노출 폐해 방지 및 팝업사전│ src/components/FuriganaText.tsx           │
├─────────────────────────────────┼────────────────────────────────────────┼───────────────────────────────────────────┤
│ Rod Ellis (2003) TBLT           │ Meaningful Real-world Tasks,           │ src/components/AiRoleplay.tsx             │
│ Jenny Thomas (1983) Pragmatics  │ Sociopragmatic Failure 방지            │ 실시간 AI 대화 & Native Polish 피드백     │
├─────────────────────────────────┼────────────────────────────────────────┼───────────────────────────────────────────┤
│ Robert DeKeyser (2007, 2015)    │ Automaticity, Skill Acquisition Theory │ src/components/LinguisticsResearchView    │
│ Robert A. Bjork (2011)          │ Desirable Difficulties, Blind Recall   │ & 향후 블라인드 인출 / 발화 잠복기 검증  │
│ Rod Ellis (2005) Implicit Test  │ 발화 개시 시간(Latency 1.5초 이내) 측정│ (수행 착각 탈피, 실전 자발적 발화 증명)   │
└─────────────────────────────────┴────────────────────────────────────────┴───────────────────────────────────────────┘
```
