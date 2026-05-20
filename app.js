import { TYPES, TYPE_CHART } from "./data.js";

const ANSWER_OPTIONS = [0, 0.25, 0.5, 1, 2, 4];
const MASTERY_THRESHOLD = 3;
const STORAGE_KEY = "pokemonFlashcardState";

const state = {
  cards: [],
  queue: [],
  progress: {},
  customCards: [],
  currentCard: null,
  awaitingNext: false,
};

const elements = {
  questionText: document.getElementById("questionText"),
  questionSub: document.getElementById("questionSub"),
  answerButtons: document.getElementById("answerButtons"),
  feedback: document.getElementById("feedback"),
  nextButton: document.getElementById("nextButton"),
  masteredCount: document.getElementById("masteredCount"),
  remainingCount: document.getElementById("remainingCount"),
  totalCount: document.getElementById("totalCount"),
  resetDeck: document.getElementById("resetDeck"),
  toggleForm: document.getElementById("toggleForm"),
  formPanel: document.getElementById("formPanel"),
  cardForm: document.getElementById("cardForm"),
  attackerType: document.getElementById("attackerType"),
  defenderTypeOne: document.getElementById("defenderTypeOne"),
  defenderTypeTwo: document.getElementById("defenderTypeTwo"),
  multiplier: document.getElementById("multiplier"),
  formError: document.getElementById("formError"),
  formSuccess: document.getElementById("formSuccess"),
  cardSource: document.getElementById("cardSource"),
};

const buildOption = (value, label = value) => {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  return option;
};

const populateTypeSelectors = () => {
  const selects = [elements.attackerType, elements.defenderTypeOne];
  selects.forEach((select) => {
    TYPES.forEach((type) => {
      select.appendChild(buildOption(type));
    });
  });

  elements.defenderTypeTwo.appendChild(buildOption("", "None"));
  TYPES.forEach((type) => {
    elements.defenderTypeTwo.appendChild(buildOption(type));
  });
};

const getEffectiveness = (attacker, defender) =>
  TYPE_CHART[attacker]?.[defender] ?? 1;

const getDualEffectiveness = (attacker, defOne, defTwo) =>
  getEffectiveness(attacker, defOne) * getEffectiveness(attacker, defTwo);

const buildDualTypes = () => {
  const pairs = [];
  for (let i = 0; i < TYPES.length; i += 1) {
    for (let j = i + 1; j < TYPES.length; j += 1) {
      pairs.push([TYPES[i], TYPES[j]]);
    }
  }
  return pairs;
};

const makeCardId = (attacker, defenders) =>
  `${attacker}|${defenders.join("/")}`;

const buildBaseCards = () => {
  const cards = [];
  TYPES.forEach((attacker) => {
    TYPES.forEach((defender) => {
      cards.push({
        id: makeCardId(attacker, [defender]),
        attacker,
        defenders: [defender],
        correct: getEffectiveness(attacker, defender),
        source: "built-in",
      });
    });
  });

  buildDualTypes().forEach(([defOne, defTwo]) => {
    TYPES.forEach((attacker) => {
      cards.push({
        id: makeCardId(attacker, [defOne, defTwo]),
        attacker,
        defenders: [defOne, defTwo],
        correct: getDualEffectiveness(attacker, defOne, defTwo),
        source: "built-in",
      });
    });
  });

  return cards;
};

const shuffle = (items) => {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const normalizeProgress = (cardId) => {
  if (!state.progress[cardId]) {
    state.progress[cardId] = { streak: 0, mastered: false };
  }
  return state.progress[cardId];
};

const saveState = () => {
  const payload = {
    queue: state.queue.map((card) => card.id),
    progress: state.progress,
    customCards: state.customCards,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

const loadState = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

const buildAllCards = () => {
  const baseCards = buildBaseCards();
  const customCards = state.customCards.map((card) => ({ ...card }));
  state.cards = [...baseCards, ...customCards];
};

const rebuildQueue = (savedQueueIds) => {
  const cardMap = new Map(state.cards.map((card) => [card.id, card]));
  const queue = [];

  if (savedQueueIds?.length) {
    savedQueueIds.forEach((id) => {
      const card = cardMap.get(id);
      if (card && !state.progress[id]?.mastered) {
        queue.push(card);
      }
    });
  }

  if (!queue.length) {
    queue.push(...shuffle(state.cards.filter((card) => !state.progress[card.id]?.mastered)));
  }

  state.queue = queue;
};

const applyLoadedState = (saved) => {
  if (!saved) return;
  state.customCards = saved.customCards || [];
  state.progress = saved.progress || {};
  buildAllCards();
  rebuildQueue(saved.queue || []);
};

const initState = () => {
  const saved = loadState();
  if (!saved) {
    state.customCards = [];
    state.progress = {};
    buildAllCards();
    state.queue = shuffle(state.cards);
  } else {
    applyLoadedState(saved);
  }
};

const updateProgressUI = () => {
  const mastered = Object.values(state.progress).filter((item) => item.mastered).length;
  const total = state.cards.length;
  const remaining = total - mastered;

  elements.masteredCount.textContent = mastered;
  elements.remainingCount.textContent = remaining;
  elements.totalCount.textContent = total;
};

const formatDefenders = (defenders) => defenders.join("/");

const renderQuestion = () => {
  const card = state.queue[0];
  state.currentCard = card || null;
  elements.feedback.textContent = "";
  elements.nextButton.style.display = "none";
  elements.answerButtons.innerHTML = "";
  state.awaitingNext = false;

  if (!card) {
    elements.questionText.textContent = "All cards mastered.";
    elements.questionSub.textContent = "Reset the deck to practice again.";
    elements.cardSource.textContent = "Done";
    return;
  }

  const defenderText = formatDefenders(card.defenders);
  elements.cardSource.textContent = card.source === "custom" ? "Custom" : "Built-in";
  elements.questionText.textContent = `Is ${card.attacker} effective against ${defenderText}?`;
  elements.questionSub.textContent = "Pick the exact effectiveness multiplier.";

  ANSWER_OPTIONS.forEach((value) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn answer";
    button.textContent = `${value}x`;
    button.addEventListener("click", () => handleAnswer(value));
    elements.answerButtons.appendChild(button);
  });
};

const setFeedback = (message, isCorrect) => {
  elements.feedback.textContent = message;
  elements.feedback.style.color = isCorrect ? "#2d6a4f" : "#b31237";
};

const handleAnswer = (value) => {
  if (state.awaitingNext || !state.currentCard) return;
  const card = state.currentCard;
  const progress = normalizeProgress(card.id);
  const isCorrect = value === card.correct;

  if (isCorrect) {
    progress.streak += 1;
    if (progress.streak >= MASTERY_THRESHOLD) {
      progress.mastered = true;
      state.queue.shift();
      setFeedback(`Correct. Card mastered at ${card.correct}x.`, true);
    } else {
      state.queue.shift();
      state.queue.push(card);
      setFeedback(`Correct. Streak ${progress.streak}/${MASTERY_THRESHOLD}.`, true);
    }
  } else {
    progress.streak = 0;
    state.queue.shift();
    const insertLimit = Math.max(1, Math.floor(state.queue.length / 2));
    const insertIndex = Math.floor(Math.random() * insertLimit);
    state.queue.splice(insertIndex, 0, card);
    setFeedback(`Not quite. Correct answer is ${card.correct}x.`, false);
  }

  state.awaitingNext = true;
  elements.nextButton.style.display = "inline-flex";
  saveState();
  updateProgressUI();
};

const handleNext = () => {
  if (!state.awaitingNext) return;
  renderQuestion();
};

const resetDeck = () => {
  state.progress = {};
  buildAllCards();
  state.queue = shuffle(state.cards);
  saveState();
  updateProgressUI();
  renderQuestion();
};

const toggleForm = () => {
  elements.formPanel.classList.toggle("active");
};

const clearFormMessages = () => {
  elements.formError.textContent = "";
  elements.formSuccess.textContent = "";
};

const addCustomCard = (event) => {
  event.preventDefault();
  clearFormMessages();

  const attacker = elements.attackerType.value;
  const defOne = elements.defenderTypeOne.value;
  const defTwo = elements.defenderTypeTwo.value;
  const multiplier = Number(elements.multiplier.value);

  if (!attacker || !defOne) {
    elements.formError.textContent = "Attacking and defending types are required.";
    return;
  }

  if (defTwo && defTwo === defOne) {
    elements.formError.textContent = "Defending types must be different.";
    return;
  }

  if (!ANSWER_OPTIONS.includes(multiplier)) {
    elements.formError.textContent = "Multiplier must be a valid option.";
    return;
  }

  const defenders = defTwo ? [defOne, defTwo] : [defOne];
  const id = makeCardId(attacker, defenders);

  if (state.cards.some((card) => card.id === id)) {
    elements.formError.textContent = "This card already exists in the deck.";
    return;
  }

  const newCard = {
    id,
    attacker,
    defenders,
    correct: multiplier,
    source: "custom",
  };

  state.customCards.push(newCard);
  state.cards.push(newCard);
  state.queue.push(newCard);
  state.progress[id] = { streak: 0, mastered: false };

  saveState();
  updateProgressUI();
  elements.formSuccess.textContent = "Custom card added to the deck.";
  elements.cardForm.reset();
};

const init = () => {
  populateTypeSelectors();
  initState();
  updateProgressUI();
  renderQuestion();

  elements.nextButton.addEventListener("click", handleNext);
  elements.resetDeck.addEventListener("click", resetDeck);
  elements.toggleForm.addEventListener("click", toggleForm);
  elements.cardForm.addEventListener("submit", addCustomCard);
};

init();
