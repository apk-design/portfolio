// js/typing/typing.js
// Assumes tool.html has these elements:
//
// Pack buttons: [data-pack="bourdain"], [data-pack="dracula"] (or any number of packs)
// Length buttons: [data-length="short|medium|long|very"]
// Restart: #typing-restart
//
// Title/subtitle: #typing-title, #typing-sub
// Quote mount: #typing-quote
// Input: #typing-input
//
// Modal: #typing-modal (show/hide via style.display)
// Lines: #typing-accuracy-line, #typing-wpm-line
// Modal buttons: #typing-try-yes, #typing-try-no

const PACK_KEY = "typing:pack";
const LENGTH_KEY = "typing:length";
const LAST_KEY_PREFIX = "typing:last:";

let state = {
  pack: "bourdain",
  length: "short",
  target: "",
  source: "",
  input: "",
  startedAt: null,
  finishedAt: null,
};

const PROMPTS = {
  bourdain: {
    title: "Anthony Bourdain",
    subtitle: "",
    texts: {
      short: [
        { text: "You have to be a romantic to invest yourself, your money, and your time in cheese.", source: "Medium Raw: A Bloody Valentine to the World of Food and the People Who Cook" },
        { text: "Good food is very often, even most often, simple food.", source: "Kitchen Confidential" },
        { text: "Don't lie about it. You made a mistake. Admit it and move on. Just don't do it again. Ever", source: "Kitchen Confidential" },
        { text: "Skills can be taught. Character you either have or you don't have.", source: "Kitchen Confidential" },
        { text: "I don't have to agree with you to like you or respect you.", source: "Anthony Bourdain" },
        { text: "your body is not a temple, it's an amusement park. Enjoy the ride.", source: "Kitchen Confidential" },
      ],
      medium: [
        { text: "If I'm an advocate for anything, it's to move. As far as you can, as much as you can. Across the ocean, or simply across the river.", source: "Anthony Bourdain" },
        { text: "That without experimentation, a willingness to ask questions and try new things, we shall surely become static, repetitive, moribund.", source: "Medium Raw: A Bloody Valentine to the World of Food and the People Who Cook" },
        { text: "Garlic is divine. Avoid at all costs that vile spew you see rotting in oil in screwtop jars. Too lazy to peel fresh? You don't deserve to eat garlic.", source: "Kitchen Confidential" },
      ],
      long: [
        { text: "Maybe that's enlightenment enough: to know that there is no final resting place of the mind, no moment of smug clarity. Perhaps wisdom is realizing how small I am, and unwise, and how far I have yet to go.", source: "Anthony Bourdain" },
        { text: "When I die, I will decidedly not be regretting missed opportunities for a good time. My regrets will be more along the lines of a sad list of people hurt, people let down, assets wasted and advantages squandered.", source: "Kitchen Confidential" },
        { text: "I'm not going anywhere. I hope. It's been an adventure. We took some casualties over the years. Things got broken. Things got lost. But I wouldn't have missed it for the world.", source: "Kitchen Confidential" },
        { text: "Travel changes you. As you move through this life and this world you change things slightly, you leave marks behind, however small. And in return, life and travel leave marks on you.", source: "The Nasty Bits" },
      ],
      very: [
        { text: "I’m a big believer in winging it. I’m a big believer that you’re never going to find perfect city travel experience or the perfect meal without a constant willingness to experience a bad one. Letting the happy accident happen is what a lot of vacation itineraries miss, I think, and I’m always trying to push people to allow those things to happen rather than stick to some rigid itinerary.", source: "Anthony Bourdain" },
      ],
    },
  },

  dracula: {
    title: "Dracula",
    subtitle: "Bram Stoker",
    texts: {
      short: ["Listen to them, the children of the night. What music they make."],
      medium: [
        "There are darknesses in life and there are lights, and you are one of the lights, the light of all lights.",
      ],
      long: [
        "We learn from failure, not from success. When I make a mistake, I always say, 'I never make the same mistake twice.'",
      ],
      very: [
        "I have been so long master that I would be master still, or at least that none other should be master of me.",
      ],
    },
  },
};

const els = {
  panel: document.getElementById("tab-typing"),
  title: document.getElementById("typing-title"),
  sub: document.getElementById("typing-sub"),
  quote: document.getElementById("typing-quote"),
  focusWord: document.getElementById("typing-current-word"),
  focusLetter: document.getElementById("typing-current-letter"),
  quoteWrap: document.querySelector(".quoteWrap"),
  input: document.getElementById("typing-input"),
  restart: document.getElementById("typing-restart"),

  modal: document.getElementById("typing-modal"),
  accLine: document.getElementById("typing-accuracy-line"),
  wpmLine: document.getElementById("typing-wpm-line"),
  tryYes: document.getElementById("typing-try-yes"),
  tryNo: document.getElementById("typing-try-no"),
};

export function initTyping() {
  hydrateFromStorage();
  bindTypingControls();
  resetTyping();
}

function hydrateFromStorage() {
  try {
    const savedPack = localStorage.getItem(PACK_KEY);
    if (savedPack && PROMPTS[savedPack]) state.pack = savedPack;
    const savedLen = localStorage.getItem(LENGTH_KEY);
    if (savedLen && PROMPTS[state.pack]?.texts?.[savedLen]) state.length = savedLen;
  } catch (e) {
    // ignore storage failures
  }

  // reflect active buttons
  document.querySelectorAll("[data-pack]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.pack === state.pack);
  });
  document.querySelectorAll("[data-length]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.length === state.length);
  });
}

function bindTypingControls() {
  // pack buttons
  document.querySelectorAll("[data-pack]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-pack]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.pack = btn.dataset.pack;
      try { localStorage.setItem(PACK_KEY, state.pack); } catch (e) {}
      resetTyping();
    });
  });

  // length buttons
  document.querySelectorAll("[data-length]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-length]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.length = btn.dataset.length;
      try { localStorage.setItem(LENGTH_KEY, state.length); } catch (e) {}
      resetTyping();
    });
  });

  // restart
  if (els.restart) {
    els.restart.addEventListener("click", () => resetTyping());
  }

  // modal controls
  if (els.tryYes) els.tryYes.addEventListener("click", () => resetTyping());
  if (els.tryNo) els.tryNo.addEventListener("click", () => hideModal());

  // input
  if (els.input) {
    els.input.addEventListener("input", (e) => {
      const v = e.target.value ?? "";
      onInputChange(String(v));
    });
  }

  // allow Enter to focus/start typing when on the typing tab
  window.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    if (els.panel && !els.panel.classList.contains("active")) return;
    if (!els.input) return;
    els.input.focus();
    if (!state.startedAt) {
      state.startedAt = Date.now();
    }
    e.preventDefault();
  });
}

function resetTyping() {
  state.input = "";
  state.startedAt = null;
  state.finishedAt = null;
  const picked = pickPrompt(state.pack, state.length);
  state.target = picked.text;
  state.source = picked.source;

  // header
  const pack = PROMPTS[state.pack] ?? PROMPTS.bourdain;
  if (els.title) els.title.textContent = "";
  if (els.sub) els.sub.textContent = state.source || pack.subtitle || "";

  // input
  if (els.input) {
    els.input.value = "";
    els.input.focus();
  }

  // quote render
  renderQuote(state.target, "");

  hideModal();
}

function onInputChange(v) {
  if (state.finishedAt) return; // ignore after finish

  if (!state.startedAt && v.length > 0) state.startedAt = Date.now();

  state.input = v;
  renderQuote(state.target, state.input);

  if (state.input.length >= state.target.length) {
    state.finishedAt = Date.now();
    showResults();
  }
}

function renderQuote(target, input) {
  if (!els.quote) return;

  // build spans with your CSS classes: quoteCorrect, quoteWrong, quoteRemaining
  // keep it simple: strict char-by-char compare
  const frag = document.createDocumentFragment();

  for (let i = 0; i < target.length; i++) {
    const expected = target[i];
    const typed = input[i];

    const span = document.createElement("span");
    if (typed === undefined) span.className = "quoteRemaining";
    else if (typed === expected) span.className = "quoteCorrect";
    else span.className = "quoteWrong";

    span.textContent = expected;
    frag.appendChild(span);
  }

  // Add blinking cursor underline to the first remaining character if any
  if (target.length > input.length && frag.childNodes[input.length]) {
    frag.childNodes[input.length].classList.add("cursor");
  }

  els.quote.innerHTML = "";
  els.quote.appendChild(frag);

  // Scroll the quote upward based on typing progress
  if (els.quoteWrap) {
    const scrollable = Math.max(0, els.quote.scrollHeight - els.quoteWrap.clientHeight);
    const progress = target.length ? Math.min(1, input.length / target.length) : 0;
    els.quoteWrap.scrollTop = scrollable * progress;
  }

  // Update focus displays
  if (els.focusWord || els.focusLetter) {
    const idx = input.length;
    const prevSpace = target.lastIndexOf(" ", idx - 1);
    const nextSpace = target.indexOf(" ", idx);
    const start = prevSpace === -1 ? 0 : prevSpace + 1;
    const end = nextSpace === -1 ? target.length : nextSpace;
    const currentWord = target.slice(start, end) || "—";
    const currentLetter = target[idx] ?? "—";
    if (els.focusWord) els.focusWord.textContent = currentWord;
    if (els.focusLetter) els.focusLetter.textContent = currentLetter;
  }
}

function showResults() {
  const correct = countCorrectChars(state.target, state.input);
  const expected = state.target.length;

  const accuracy = expected === 0 ? 100 : Math.round((correct / expected) * 100);

  const minutes = elapsedMinutes(state.startedAt, state.finishedAt);
  const wpm = minutes <= 0 ? 0 : Math.max(0, Math.round(countWords(state.input) / minutes));

  if (els.accLine) {
    els.accLine.innerHTML = `<span class="mono">${correct}/${expected}</span> characters = <span class="good mono">${accuracy}%</span> accuracy`;
  }
  if (els.wpmLine) {
    els.wpmLine.innerHTML = `Took <span class="mono">${minutes.toFixed(2)}</span> minute(s) = <span class="good mono">${wpm}</span> WPM`;
  }

  if (els.modal) els.modal.style.display = "block";
}

function hideModal() {
  if (els.modal) els.modal.style.display = "none";
}

/* ---------- helpers ---------- */

function pickPrompt(pack, length) {
  const p = PROMPTS[pack] ?? PROMPTS.bourdain;
  const list = (p.texts && p.texts[length]) ? p.texts[length] : p.texts.short;

  let last = null;
  const storageKey = `${LAST_KEY_PREFIX}${pack}:${length}`;
  try {
    last = localStorage.getItem(storageKey);
  } catch (e) {
    // ignore storage errors
  }

  const toObj = (item) => {
    if (typeof item === "string") return { text: item, source: p.subtitle || "" };
    return { text: item.text, source: item.source || p.subtitle || "" };
  };

  let choice = toObj(list[0] ?? "");
  if (list.length > 1) {
    // try to avoid repeating the last choice
    for (let i = 0; i < list.length * 2; i++) {
      const candidate = toObj(list[Math.floor(Math.random() * list.length)]);
      if (candidate.text !== last) {
        choice = candidate;
        break;
      }
    }
  }

  try {
    localStorage.setItem(storageKey, choice.text);
  } catch (e) {
    // ignore storage errors
  }

  return choice;
}

function countWords(s) {
  const t = String(s).trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

function countCorrectChars(target, input) {
  let c = 0;
  const n = Math.min(target.length, input.length);
  for (let i = 0; i < n; i++) {
    if (input[i] === target[i]) c++;
  }
  return c;
}

function elapsedMinutes(start, end) {
  if (!start || !end) return 0;
  return (end - start) / 60000;
}
