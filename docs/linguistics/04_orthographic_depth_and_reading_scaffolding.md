# 표기 심도(Orthographic Depth)와 실전 텍스트 리딩의 비계 설정(Scaffolding)

> **핵심 문헌:**  
> - Frost, R., Katz, L., & Bentin, S. (1987). *Strategies for visual word recognition and orthographic depth: A multilingual comparison.*  
> - Perfetti, C. A., Liu, Y., & Tan, L. H. (2007). *How-to-read-in-two-writing-systems: Second language reading.*  
> - Vygotsky, L. S. (1978). *Mind in Society: The Development of Higher Psychological Processes.* (ZPD & Scaffolding)  
> - Nation, I. S. P. (2001). *Learning Vocabulary in Another Language.* Cambridge University Press.

---

## 1. 표기 심도 가설 (Orthographic Depth Hypothesis)

문자 체계가 음소(소리)와 얼마나 1:1로 직결되는가에 따라 언어의 읽기 전략이 근본적으로 달라집니다:

* **얕은 표기 체계 (Shallow Orthography):** 한글, 스페인어, 일본어 히라가나/가타카나
  * 철자를 보면 소리를 100% 예측 가능 → 음운학적 해독(Phonological Decoding) 위주로 읽음.
* **깊은 표기 체계 (Deep Orthography):** 영어, 일본어 한자(漢字)
  * 철자와 발음의 불일치가 심하거나(영어의 `colonel`, `dough`), 문자 자체가 뜻을 담은 표의문자(일본어 한자의 음독/훈독 체계) → 시각적 어휘 인출(Direct Visual / Lexical Access) 필수.

---

## 2. '후리가나(Furigana)의 딜레마'와 인지적 해결책

일본어 학습에서 가장 큰 난제는 한자 위에 히라가나 발음을 달아주는 루비 태그(Ruby / 후리가나)입니다:

1. **상시 표시의 부작용:** 안구 운동 추적(Eye-tracking) 연구에 따르면, 한자 위에 후리가나가 항상 달려 있으면 인간의 뇌는 인지적 지름길(Heuristic)을 택해 **한자를 전혀 보지 않고 상단의 히라가나만 읽게 됩니다**. 결과적으로 현지 간판이나 식당 자판기에 갔을 때 한자를 전혀 못 읽는 현상이 발생합니다.
2. **완전 미표시의 부작용:** 초보 학습자가 후리가나 없는 현지 텍스트를 마주치면 인지 과부하로 독해를 포기하게 됩니다(높은 정의적 여과막 / Affective Filter).

### 💡 해결책: 비고츠키(Vygotsky)의 점진적 비계 페이딩 (Scaffolding Fading)
SpeakFlow는 언어학의 **비계 설정(Scaffolding)** 원리를 소프트웨어 기능으로 완벽하게 구현했습니다:

```
[초보자 모드] ─── 후리가나 ON (Scaffolding 지원) ─── 발음과 어휘 뜻 매핑 형성
       │
       ▼
[실전 현지 모드] ── 후리가나 OFF (현지 실제 간판과 100% 동일한 비주얼 노출)
       │
       ▼
[온디맨드 글로서리] 모르는 한자만 터치(Click)하여 팝업으로 즉시 발음과 뜻 확인 (On-demand Glossing)
```

---

## 3. 현지 텍스트 리딩의 본질: "소설 읽기"가 아닌 "스캐닝(Scanning)"

폴 네이션(Paul Nation) 교수의 어휘 및 독해 연구에 따르면, 여행이나 현지 생활에서의 리딩은 처음부터 끝까지 정독(Extensive Reading)하는 것이 아니라 **핵심 정보만 번개처럼 찾아내는 스캐닝(Scanning)**입니다:

* 라멘집 자판기에서: 국물 맛 설명 전체를 읽는 것이 아니라 `替玉`(면 추가), `かため`(꼬들하게) 단어만 시각적으로 식별.
* 지하철역에서: 안내문 전체가 아니라 `改札口`(개찰구), `乗り換え`(환승) 표지판만 즉시 포착.
* 브런치 카페에서: `Over-easy`(반숙 조리법), `GF`(글루텐 프리) 키워드 식별.

SpeakFlow의 [2차 목적: 현지 실전 리딩] 모듈은 실제 현지의 메뉴판, 개찰구 화면, 공항 전광판을 그대로 시뮬레이션하고 **실전 퀴즈(Task-based Reading Quiz)**를 통해 스캐닝 능력을 훈련하도록 설계되었습니다.
