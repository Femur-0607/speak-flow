import type { ReadingItem } from '../types';

export const JAPANESE_READING: ReadingItem[] = [
  {
    id: 'ja-read-ramen',
    category: 'restaurant',
    typeBadge: '식당 발권기 / 자판기',
    titleKo: '라멘집 발권기 & 주문 용지 읽기',
    titleNative: 'ラーメン屋の券売機とお好み表',
    content: [
      {
        rawText: '特製とんこつラーメン ¥980 (おすすめ)',
        rubyTokens: [
          { kanji: '特製', furigana: 'とくせい', romaji: 'tokusei', meaning: '특별 제작/특제' },
          { kanji: '豚骨', furigana: 'とんこつ', romaji: 'tonkotsu', meaning: '돼지 뼈 육수' },
        ],
        translationKo: '특제 돈코츠 라멘 980엔 (추천)',
        notes: '가게의 대표 간판 메뉴입니다.',
      },
      {
        rawText: '替玉（一玉 ¥150 / 半玉 ¥100）',
        rubyTokens: [
          { kanji: '替玉', furigana: 'かえだま', romaji: 'kaedama', meaning: '면 사리 리필' },
          { kanji: '一玉', furigana: 'ひとたま', romaji: 'hitotama', meaning: '한 그릇 분량' },
          { kanji: '半玉', furigana: 'はんたま', romaji: 'hantama', meaning: '반 그릇 분량' },
        ],
        translationKo: '면 추가 (한 덩이 150엔 / 반 덩이 100엔)',
        notes: '국물이 남아있을 때 면만 추가할 때 누르는 버튼입니다.',
      },
      {
        rawText: '麺の硬さ: かため / 普通 / やわらかめ',
        rubyTokens: [
          { kanji: '麺', furigana: 'めん', romaji: 'men', meaning: '면' },
          { kanji: '硬', furigana: 'かた', romaji: 'kata', meaning: '단단함/익힘 정도' },
          { kanji: '普通', furigana: 'ふつう', romaji: 'futsuu', meaning: '보통' },
        ],
        translationKo: '면의 익힘 정도: 꼬들하게(카타메) / 보통(후츠) / 부드럽게(야와라카메)',
        notes: '현지인들은 대부분 식감이 살아있는 [かため(카타메)]를 선호합니다.',
      },
      {
        rawText: '味の濃さ: こいめ / 基本 / うすめ',
        rubyTokens: [
          { kanji: '味', furigana: 'あじ', romaji: 'aji', meaning: '맛' },
          { kanji: '濃', furigana: 'こ', romaji: 'ko', meaning: '진함' },
          { kanji: '基本', furigana: 'きほん', romaji: 'kihon', meaning: '기본' },
        ],
        translationKo: '국물 간: 진하게(코이메) / 기본(키혼) / 연하게(우스메)',
        notes: '일본 라멘 국물이 짜게 느껴진다면 [うすめ(우스메)]를 선택하세요.',
      },
      {
        rawText: 'トッピング: 煮玉子 / チャーシュー / ねぎ増し',
        rubyTokens: [
          { kanji: '煮玉子', furigana: 'にたまご', romaji: 'nitamago', meaning: '맛달걀' },
          { kanji: '増', furigana: 'ま', romaji: 'ma', meaning: '추가/곱빼기' },
        ],
        translationKo: '토핑: 반숙 맛달걀 / 차슈(고기) / 파 추가',
        notes: '増し(마시)는 "더 얹음/추가"라는 뜻입니다.',
      },
    ],
    interactiveWords: [
      { text: '替玉', reading: 'かえだま (카에다마)', meaningKo: '면 사리 추가', explanation: '라멘을 다 먹고 국물에 면만 새로 추가하는 시스템' },
      { text: 'かため', reading: 'かため (카타메)', meaningKo: '면을 꼬들꼬들하게 삶음', explanation: '현지 매니아들이 가장 많이 고르는 면 익힘도' },
      { text: 'うすめ', reading: 'うすめ (우스메)', meaningKo: '국물 간을 싱겁게/연하게 함', explanation: '짠 국물이 부담스러울 때 필수 선택지' },
      { text: '煮玉子', reading: 'にたまご (니타마고)', meaningKo: '간장 양념 반숙란', explanation: '라멘에 올려먹는 특제 계란 토핑' },
      { text: 'おすすめ', reading: 'おすすめ (오스스메)', meaningKo: '추천 메뉴', explanation: '메뉴판에서 이 단어가 보이면 가게의 시그니처!' },
    ],
    quiz: {
      question: '라멘 국물이 너무 짤까 봐 걱정될 때 주문 용지에서 선택해야 할 단어는?',
      options: ['こいめ (코이메)', 'うすめ (우스메)', 'かため (카타메)', 'ねぎ増し (네기마시)'],
      correctIndex: 1,
      explanation: 'うすめ(우스메)는 "연하게/싱겁게"라는 뜻으로, 국물 간을 약하게 해달라는 옵션입니다.',
    },
  },
  {
    id: 'ja-read-station',
    category: 'transit',
    typeBadge: '지하철 & 기차역 안내',
    titleKo: '도쿄 지하철역 표지판 & 개찰구 읽기',
    titleNative: '駅の案内サインと改札口',
    content: [
      {
        rawText: '中央改札口 / 東口・西口方面',
        rubyTokens: [
          { kanji: '中央', furigana: 'ちゅうおう', romaji: 'chuuou', meaning: '중앙' },
          { kanji: '改札口', furigana: 'かいさつぐち', romaji: 'kaisatsuguchi', meaning: '개찰구' },
          { kanji: '方面', furigana: 'ほうめん', romaji: 'houmen', meaning: '방면' },
        ],
        translationKo: '중앙 개찰구 / 동쪽 출구・서쪽 출구 방면',
        notes: '티켓이나 교통카드를 찍고 나가는 곳입니다.',
      },
      {
        rawText: '精算機 / ICカードチャージ',
        rubyTokens: [
          { kanji: '精算機', furigana: 'せいさんき', romaji: 'seisanki', meaning: '요금 정산기' },
        ],
        translationKo: '요금 정산기 / 교통카드 충전',
        notes: '잔액이 부족해 개찰구를 못 나갈 때 이곳에서 차액을 지불합니다.',
      },
      {
        rawText: '快速: この電車は次の駅に止まりません',
        rubyTokens: [
          { kanji: '快速', furigana: 'かいそく', romaji: 'kaisoku', meaning: '쾌속열차' },
          { kanji: '次', furigana: 'つぎ', romaji: 'tsugi', meaning: '다음' },
          { kanji: '止', furigana: 'と', romaji: 'to', meaning: '멈추다' },
        ],
        translationKo: '쾌속: 이 전철은 다음 역에 정차하지 않습니다',
        notes: '작은 역에 가려면 各駅停車(각역정차-완행)를 타야 합니다.',
      },
    ],
    interactiveWords: [
      { text: '改札口', reading: 'かいさつぐち (카이사츠구치)', meaningKo: '개찰구', explanation: '카드를 태그하고 역 안팎으로 드나드는 곳' },
      { text: '精算機', reading: 'せいさんき (세이산키)', meaningKo: '요금 정산기', explanation: '잔액 부족(ERROR) 떴을 때 개찰구 바로 옆 정산기를 이용' },
      { text: '乗り換え', reading: 'のりかえ (노리카에)', meaningKo: '환승', explanation: '다른 노선으로 갈아타는 화살표 표지판' },
      { text: '出口', reading: 'でぐち (데구치)', meaningKo: '출구', explanation: '지상이나 밖으로 나가는 출구' },
    ],
    quiz: {
      question: '지하철 개찰구에서 잔액 부족으로 삐- 소리가 나며 막혔을 때 찾아야 할 기계는?',
      options: ['自動販売機 (자동판매기)', '精算機 (세이산키)', '券売機 (발권기)', '改札口 (개찰구)'],
      correctIndex: 1,
      explanation: '精算機(세이산키, 정산기)는 잔액이 모자랄 때 개찰구 안쪽에서 추가 요금을 정산하는 기계입니다.',
    },
  },
  {
    id: 'ja-read-convenience',
    category: 'convenience',
    typeBadge: '편의점 셀프 계산대',
    titleKo: '편의점 계산대 화면 읽기',
    titleNative: 'コンビニのレジ・タッチパネル画面',
    content: [
      {
        rawText: 'レジ袋の利用: はい (有料 ¥3) / いいえ',
        rubyTokens: [
          { kanji: '袋', furigana: 'ふくろ', romaji: 'fukuro', meaning: '봉투' },
          { kanji: '利用', furigana: 'りよう', romaji: 'riyou', meaning: '이용' },
          { kanji: '有料', furigana: 'ゆうりょう', romaji: 'yuuryou', meaning: '유료' },
        ],
        translationKo: '비닐봉투 사용: 예 (유료 3엔) / 아니오',
        notes: '봉투가 필요 없으면 [いいえ(아니오)]를 터치하세요.',
      },
      {
        rawText: 'お支払い方法を選択してください',
        rubyTokens: [
          { kanji: '払', furigana: 'はら', romaji: 'hara', meaning: '지불' },
          { kanji: '方法', furigana: 'ほうほう', romaji: 'houhou', meaning: '방법' },
          { kanji: '選択', furigana: 'せんたく', romaji: 'sentaku', meaning: '선택' },
        ],
        translationKo: '결제 방법을 선택해 주세요',
        notes: '화면에 카드, 교통카드, 현금 버튼이 뜹니다.',
      },
      {
        rawText: '交通系IC / クレジットカード / 現金',
        rubyTokens: [
          { kanji: '交通系', furigana: 'こうつうけい', romaji: 'koutsuukei', meaning: '교통계' },
          { kanji: '現金', furigana: 'げんきん', romaji: 'genkin', meaning: '현금' },
        ],
        translationKo: '교통계 IC(스이카/파스모) / 신용카드 / 현금',
        notes: '애플페이나 스이카 카드로 결제할 때는 [交通系IC]를 누릅니다.',
      },
    ],
    interactiveWords: [
      { text: 'レジ袋', reading: 'レジぶくろ (레지부쿠로)', meaningKo: '비닐봉투', explanation: '계산대 비닐봉투' },
      { text: '交通系IC', reading: 'こうつうけいアイシー (코-츠-케이 아이시-)', meaningKo: '교통카드(Suica, Pasmo 등)', explanation: '단말기에 카드나 스마트폰을 태그하여 결제' },
      { text: '現金', reading: 'げんきん (겐킨)', meaningKo: '현금 (지폐/동전)', explanation: '현금 투입구에 돈을 넣는 방식' },
    ],
    quiz: {
      question: '스이카(Suica) 카드로 찍어서 결제하려고 할 때 화면에서 눌러야 하는 것은?',
      options: ['現金 (겐킨)', '交通系IC (코츠케이 IC)', 'レジ袋 (레지부쿠로)', 'お弁当 (오벤토)'],
      correctIndex: 1,
      explanation: '교통카드(스이카, 파스모, 이코카 등)는 모두 交通系IC (교통계 IC) 카테고리에 속합니다.',
    },
  },
];

export const ENGLISH_READING: ReadingItem[] = [
  {
    id: 'en-read-menu',
    category: 'restaurant',
    typeBadge: 'Cafe & Brunch Menu',
    titleKo: '브런치 카페 메뉴판 & 옵션 읽기',
    titleNative: 'All-Day Breakfast & Brunch Specials',
    content: [
      {
        rawText: 'Classic Avocado Toast - $14.50 (V / GF Available)',
        translationKo: '클래식 아보카도 토스트 - $14.50 (채식주의 / 글루텐 프리 옵션 가능)',
        notes: 'V = Vegetarian, GF = Gluten-Free',
      },
      {
        rawText: 'Two eggs any style: Sunny-side up / Over easy / Scrambled',
        translationKo: '계란 2개 조리 선택: 써니사이드업(안 뒤집은 반숙) / 오버이지(살짝 뒤집은 반숙) / 스크램블',
        notes: '계란 굽기 조절 단어는 미국 식당의 필수 기본 상식입니다.',
      },
      {
        rawText: 'Served with sourdough toast and dressed market greens',
        translationKo: '사워도우 토스트 및 드레싱을 곁들인 샐러드가 함께 제공됩니다.',
        notes: 'dressed = 소스/드레싱이 이미 버무려진 상태',
      },
    ],
    interactiveWords: [
      { text: 'Sunny-side up', reading: '써니사이드업', meaningKo: '노른자가 해처럼 보이는 뒤집지 않은 반숙', explanation: '노른자가 그대로 노랗게 살아있는 프라이' },
      { text: 'Over easy', reading: '오버 이지', meaningKo: '앞뒤를 살짝만 뒤집어 노른자는 톡 터지는 반숙', explanation: '미국인들이 가장 즐겨먹는 부드러운 반숙 상태' },
      { text: 'GF Available', reading: '글루텐 프리 어베일러블', meaningKo: '글루텐 프리 빵/재료로 변경 가능', explanation: '밀가루 알레르기나 소화 문제 시 선택 가능' },
      { text: 'Dressed greens', reading: '드레스트 그린스', meaningKo: '드레싱 소스가 버무려진 채소 샐러드', explanation: '소스가 따로 나오지 않고 이미 뿌려져 나옴' },
    ],
    quiz: {
      question: '계란 프라이를 시킬 때, "노른자를 터뜨릴 수 있는 촉촉한 반숙(앞뒤 살짝 구움)"을 원하면 골라야 할 단어는?',
      options: ['Hard boiled (완숙 삶은달걀)', 'Over easy (오버 이지)', 'Scrambled (스크램블)', 'Raw (날달걀)'],
      correctIndex: 1,
      explanation: 'Over easy는 계란을 한 번 뒤집되, 노른자는 전혀 익지 않고 액체 상태로 살아있는 대표적인 반숙 스타일입니다.',
    },
  },
  {
    id: 'en-read-airport',
    category: 'transit',
    typeBadge: 'Flight Information Display',
    titleKo: '공항 운항 전광판 & 탑승 안내문',
    titleNative: 'Airport Flight Status & Gate Board',
    content: [
      {
        rawText: 'Flight AA142 | Gate B18 | Status: BOARDING NOW',
        translationKo: '항공편 AA142 | B18 탑승구 | 상태: 지금 탑승 중',
        notes: '즉시 탑승구로 이동해 줄을 서야 하는 상태입니다.',
      },
      {
        rawText: 'Flight DL089 | Gate C04 | Status: DELAYED (Est. departure: 16:45)',
        translationKo: '항공편 DL089 | C04 탑승구 | 상태: 지연됨 (예상 출발: 16:45)',
        notes: '지연되었으므로 새 출발 시간을 확인해야 합니다.',
      },
      {
        rawText: 'Final Call for Passengers on Flight UA901 to Tokyo',
        translationKo: '도쿄행 UA901편 탑승객을 위한 마지막 탑승 안내 (파이널 콜)',
        notes: '문이 닫히기 직전이므로 즉시 탑승구로 뛰어가야 합니다.',
      },
    ],
    interactiveWords: [
      { text: 'Boarding Now', reading: '보딩 나우', meaningKo: '현재 비행기 탑승 중', explanation: '비행기에 탑승이 시작되었음을 알림' },
      { text: 'Final Call', reading: '파이널 콜', meaningKo: '마지막 탑승 안내 (마감 직전)', explanation: '탑승구가 곧 닫히므로 즉시 탑승해야 함' },
      { text: 'Delayed', reading: '딜레이드', meaningKo: '지연됨', explanation: '출발 시간이 늦춰짐' },
      { text: 'Gate Closed', reading: '게이트 클로즈드', meaningKo: '탑승 마감', explanation: '더 이상 탈 수 없음' },
    ],
    quiz: {
      question: '전광판에 내 비행기 상태가 "FINAL CALL"로 표시되어 있다면 어떻게 해야 할까요?',
      options: ['면세점에 들러 쇼핑을 한다', '의자에 앉아 느긋하게 기다린다', '즉시 탑승 게이트로 뛰어가서 탑승한다', '체크인 카운터로 되돌아간다'],
      correctIndex: 2,
      explanation: 'Final Call은 게이트 문을 닫기 직전의 마지막 호출 경고이므로 지체 없이 즉시 탑승해야 합니다.',
    },
  },
];
