const vocabulary = {

  airport: [
    {
      word: "passport",
      meaning: "護照",
      example: "Please show me your passport.",
      exampleMeaning: "請出示你的護照。"
    },
    {
      word: "boarding pass",
      meaning: "登機證",
      example: "May I see your boarding pass?",
      exampleMeaning: "可以讓我看你的登機證嗎？"
    },
    {
      word: "departure",
      meaning: "出發",
      example: "What time is the departure?",
      exampleMeaning: "幾點出發？"
    },
    {
      word: "arrival",
      meaning: "抵達",
      example: "What is the arrival time?",
      exampleMeaning: "抵達時間是幾點？"
    }
  ],

  hotel: [
    {
      word: "reservation",
      meaning: "預約",
      example: "I have a reservation.",
      exampleMeaning: "我有預約。"
    },
    {
      word: "reception",
      meaning: "櫃台",
      example: "Please ask at reception.",
      exampleMeaning: "請到櫃台詢問。"
    },
    {
      word: "room key",
      meaning: "房間鑰匙",
      example: "Here is your room key.",
      exampleMeaning: "這是你的房間鑰匙。"
    },
    {
      word: "check-out",
      meaning: "退房",
      example: "What time is check-out?",
      exampleMeaning: "退房時間是幾點？"
    }
  ],

  restaurant: [
    {
      word: "menu",
      meaning: "菜單",
      example: "May I see the menu?",
      exampleMeaning: "可以給我看菜單嗎？"
    },
    {
      word: "order",
      meaning: "點餐",
      example: "I'd like to order.",
      exampleMeaning: "我想點餐。"
    },
    {
      word: "bill",
      meaning: "帳單",
      example: "Could I have the bill, please?",
      exampleMeaning: "可以給我帳單嗎？"
    },
    {
      word: "reservation",
      meaning: "訂位",
      example: "I have a dinner reservation.",
      exampleMeaning: "我有晚餐訂位。"
    }
  ],

  shopping: [
    {
      word: "price",
      meaning: "價格",
      example: "What is the price?",
      exampleMeaning: "價格是多少？"
    },
    {
      word: "discount",
      meaning: "折扣",
      example: "Is there any discount?",
      exampleMeaning: "有折扣嗎？"
    },
    {
      word: "cash",
      meaning: "現金",
      example: "Can I pay in cash?",
      exampleMeaning: "我可以付現金嗎？"
    },
    {
      word: "credit card",
      meaning: "信用卡",
      example: "Can I pay by credit card?",
      exampleMeaning: "可以刷信用卡嗎？"
    }
  ]

};

let currentCategory = "airport";
let currentIndex = 0;

let favorites =
  JSON.parse(localStorage.getItem("favorites")) || [];

let score = 0;
let totalQuestions = 0;
let currentQuizWord = null;
let answered = false;

function showStudyMode() {

  document
    .getElementById("studyMode")
    .classList.remove("hidden");

  document
    .getElementById("quizMode")
    .classList.add("hidden");

  document
    .getElementById("speakingMode")
    .classList.add("hidden");
}

function showQuizMode() {

  document
    .getElementById("studyMode")
    .classList.add("hidden");

  document
    .getElementById("quizMode")
    .classList.remove("hidden");

  document
    .getElementById("speakingMode")
    .classList.add("hidden");

  score = 0;
  totalQuestions = 0;

  updateScore();
  createQuizQuestion();
}

  score = 0;
  totalQuestions = 0;

  updateScore();
  createQuizQuestion();

function showWord() {

  const current =
    vocabulary[currentCategory][currentIndex];

  document.getElementById("word").innerText =
    current.word;

  document.getElementById("meaning").innerText =
    current.meaning;

  document.getElementById("example").innerText =
    current.example;

  document.getElementById("exampleMeaning").innerText =
    current.exampleMeaning;

  const categoryNames = {
    airport: "✈️ 機場英文",
    hotel: "🏨 飯店英文",
    restaurant: "🍽️ 餐廳英文",
    shopping: "🛍️ 購物英文"
  };

  document.getElementById("categoryName").innerText =
    categoryNames[currentCategory];

  updateFavoriteButton();
}

function changeCategory(category) {

  currentCategory = category;
  currentIndex = 0;

  showWord();
}

function nextWord() {

  currentIndex++;

  if (
    currentIndex >=
    vocabulary[currentCategory].length
  ) {
    currentIndex = 0;
  }

  showWord();
}

function previousWord() {

  currentIndex--;

  if (currentIndex < 0) {
    currentIndex =
      vocabulary[currentCategory].length - 1;
  }

  showWord();
}

function playWord() {

  const current =
    vocabulary[currentCategory][currentIndex];

  const speech =
    new SpeechSynthesisUtterance(current.word);

  speech.lang = "en-US";
  speech.rate = 0.8;

  speechSynthesis.cancel();
  speechSynthesis.speak(speech);
}

function playExample() {

  const current =
    vocabulary[currentCategory][currentIndex];

  const speech =
    new SpeechSynthesisUtterance(current.example);

  speech.lang = "en-US";
  speech.rate = 0.85;

  speechSynthesis.cancel();
  speechSynthesis.speak(speech);
}

function toggleFavorite() {

  const current =
    vocabulary[currentCategory][currentIndex];

  const exists =
    favorites.some(
      item =>
        item.word === current.word &&
        item.meaning === current.meaning
    );

  if (exists) {

    favorites =
      favorites.filter(
        item =>
          !(
            item.word === current.word &&
            item.meaning === current.meaning
          )
      );

  } else {

    favorites.push(current);
  }

  localStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
  );

  updateFavoriteButton();
}

function updateFavoriteButton() {

  const current =
    vocabulary[currentCategory][currentIndex];

  const exists =
    favorites.some(
      item =>
        item.word === current.word &&
        item.meaning === current.meaning
    );

  const button =
    document.getElementById("favoriteButton");

  if (exists) {
    button.innerText = "❤️ 已收藏";
  } else {
    button.innerText = "🤍 收藏";
  }
}

function showFavorites() {

  const list =
    document.getElementById("favoriteList");

  list.innerHTML = "";

  if (favorites.length === 0) {

    list.innerHTML =
      "<p>目前還沒有收藏單字</p>";

    return;
  }

  favorites.forEach(item => {

    const div =
      document.createElement("div");

    div.className = "favorite-item";

    div.innerHTML =
      "<strong>" +
      item.word +
      "</strong> - " +
      item.meaning;

    list.appendChild(div);
  });
}

/* --------------------
   Quiz 測驗功能
-------------------- */

function getAllWords() {

  return [
    ...vocabulary.airport,
    ...vocabulary.hotel,
    ...vocabulary.restaurant,
    ...vocabulary.shopping
  ];
}

function createQuizQuestion() {

  answered = false;

  document
    .getElementById("nextQuestionButton")
    .classList.add("hidden");

  document.getElementById("quizResult").innerText = "";

  const allWords = getAllWords();

  currentQuizWord =
    allWords[
      Math.floor(Math.random() * allWords.length)
    ];

  document.getElementById("quizWord").innerText =
    currentQuizWord.word;

  let options = [currentQuizWord.meaning];

  while (options.length < 4) {

    const randomWord =
      allWords[
        Math.floor(Math.random() * allWords.length)
      ];

    if (!options.includes(randomWord.meaning)) {
      options.push(randomWord.meaning);
    }
  }

  options = shuffleArray(options);

  const optionsContainer =
    document.getElementById("quizOptions");

  optionsContainer.innerHTML = "";

  options.forEach(option => {

    const button =
      document.createElement("button");

    button.innerText = option;

    button.onclick = function() {
      checkQuizAnswer(button, option);
    };

    optionsContainer.appendChild(button);
  });
}

function checkQuizAnswer(button, selectedAnswer) {

  if (answered) {
    return;
  }

  answered = true;
  totalQuestions++;

  const buttons =
    document.querySelectorAll(
      "#quizOptions button"
    );

  buttons.forEach(btn => {

    if (
      btn.innerText ===
      currentQuizWord.meaning
    ) {
      btn.classList.add("correct");
    }
  });

  if (
    selectedAnswer ===
    currentQuizWord.meaning
  ) {

    score++;

    document.getElementById(
      "quizResult"
    ).innerText =
      "✅ 答對了！";

  } else {

    button.classList.add("wrong");

    document.getElementById(
      "quizResult"
    ).innerText =
      "❌ 答錯了，正確答案是：" +
      currentQuizWord.meaning;
  }

  updateScore();

  document
    .getElementById("nextQuestionButton")
    .classList.remove("hidden");
}

function nextQuestion() {
  createQuizQuestion();
}

function updateScore() {

  document.getElementById("score").innerText =
    "分數：" +
    score +
    " / " +
    totalQuestions;
}

function shuffleArray(array) {

  for (
    let i = array.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );

    [array[i], array[j]] =
      [array[j], array[i]];
  }

  return array;
}

/* --------------------
   口說練習
-------------------- */

const speakingSentences = [
  {
    sentence: "I'd like to check in.",
    meaning: "我想辦理入住。"
  },
  {
    sentence: "Where is the restroom?",
    meaning: "洗手間在哪裡？"
  },
  {
    sentence: "Could I have the menu, please?",
    meaning: "可以給我菜單嗎？"
  },
  {
    sentence: "How much is this?",
    meaning: "這個多少錢？"
  },
  {
    sentence: "Can I pay by credit card?",
    meaning: "可以刷信用卡嗎？"
  },
  {
    sentence: "Where is the train station?",
    meaning: "火車站在哪裡？"
  },
  {
    sentence: "I have a reservation.",
    meaning: "我有預約。"
  }
];

let speakingIndex = 0;

function showSpeakingMode() {

  document
    .getElementById("studyMode")
    .classList.add("hidden");

  document
    .getElementById("quizMode")
    .classList.add("hidden");

  document
    .getElementById("speakingMode")
    .classList.remove("hidden");

  showSpeakingSentence();
}

function showSpeakingSentence() {

  const current =
    speakingSentences[speakingIndex];

  document
    .getElementById("speakingSentence")
    .innerText =
    current.sentence;

  document
    .getElementById("speakingMeaning")
    .innerText =
    current.meaning;

  document
    .getElementById("listeningStatus")
    .innerText =
    "按下麥克風開始練習";

  document
    .getElementById("spokenResult")
    .innerHTML = "";
}

function nextSpeakingSentence() {

  speakingIndex++;

  if (
    speakingIndex >=
    speakingSentences.length
  ) {
    speakingIndex = 0;
  }

  showSpeakingSentence();
}

function playSpeakingSentence() {

  const current =
    speakingSentences[speakingIndex];

  const speech =
    new SpeechSynthesisUtterance(
      current.sentence
    );

  speech.lang = "en-US";
  speech.rate = 0.85;

  speechSynthesis.cancel();
  speechSynthesis.speak(speech);
}

function startSpeakingPractice() {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {

    alert(
      "你的瀏覽器目前不支援語音辨識，請使用 Chrome 測試。"
    );

    return;
  }

  const recognition =
    new SpeechRecognition();

  recognition.lang = "en-US";

  recognition.interimResults = false;

  recognition.maxAlternatives = 1;

  document
    .getElementById("listeningStatus")
    .innerText =
    "🎤 正在聽你說話...";

  recognition.start();

  recognition.onresult =
    function(event) {

      const spoken =
        event.results[0][0].transcript;

      checkSpeakingAnswer(spoken);
    };

  recognition.onerror =
    function(event) {

      document
        .getElementById("listeningStatus")
        .innerText =
        "❌ 語音辨識失敗：" +
        event.error;
    };

  recognition.onend =
    function() {

      document
        .getElementById("listeningStatus")
        .innerText =
        "語音辨識完成";
    };
}

function normalizeText(text) {

  return text
    .toLowerCase()
    .replace(/[.,!?']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function checkSpeakingAnswer(spoken) {

  const target =
    speakingSentences[
      speakingIndex
    ].sentence;

  const targetClean =
    normalizeText(target);

  const spokenClean =
    normalizeText(spoken);

  let message = "";

  if (
    targetClean === spokenClean
  ) {

    message =
      "🌟 Excellent! 完全正確！";

  } else {

    const similarity =
      calculateSimilarity(
        targetClean,
        spokenClean
      );

    if (similarity >= 0.8) {

      message =
        "👍 很接近了！";

    } else if (similarity >= 0.5) {

      message =
        "🙂 不錯，再試一次會更好！";

    } else {

      message =
        "💪 再聽一次發音後重新試試看。";
    }
  }

  document
    .getElementById("spokenResult")
    .innerHTML =
    "<strong>你說的是：</strong><br>" +
    spoken +
    "<br><br>" +
    "<strong>目標句子：</strong><br>" +
    target +
    "<br><br>" +
    message;
}

function calculateSimilarity(
  target,
  spoken
) {

  const targetWords =
    target.split(" ");

  const spokenWords =
    spoken.split(" ");

  let correctWords = 0;

  targetWords.forEach(word => {

    if (
      spokenWords.includes(word)
    ) {
      correctWords++;
    }

  });

  return (
    correctWords /
    targetWords.length
  );
}

showWord();