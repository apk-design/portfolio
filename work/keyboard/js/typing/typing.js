// js/typing/typing.js

let state = {
  pack: "bourdain",
  length: "short",
  target: "",
  source: "",
  input: "",
  stage: "idle", // "idle" | "running" | "done"
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
      ],
      medium: [
        { text: "If I'm an advocate for anything, it's to move. As far as you can, as much as you can. Across the ocean, or simply across the river.", source: "Anthony Bourdain" },
      ],
      long: [
        { text: "Maybe that's enlightenment enough: to know that there is no final resting place of the mind, no moment of smug clarity.", source: "Anthony Bourdain" },
      ],
      very: [
        { text: "I’m a big believer in winging it. Letting the happy accident happen is what a lot of vacation itineraries miss.", source: "Anthony Bourdain" },
      ],
    },
  },
  dracula: {
    title: "Dracula",
    subtitle: "Bram Stoker",
    texts: {
      short: ["Listen to them, the children of the night. What music they make."],
      medium: ["There are darknesses in life and there are lights, and you are one of the lights, the light of all lights."],
      long: ["We learn from failure, not from success."],
      very: ["I have been so long master that I would be master still."],
    },
  },
};

const els = {
  panel: document.getElementById("tab-typing"),
  title: document.getElementById("typing-title"),
  sub: document.getElementById("typing-sub"),
  quote: document.getElementById("typing-quote"),
  quoteWrap: document.querySelector(".quoteWrap"),
  input: document.getElementById("typing-input"),
  restart: document.getElementById("typing-restart"),

  focusWord: document.getElementById("typing-current-word"),
  focusLetter: document.getElementById("typing-current-letter"),

  modal: document.getElementById("typing-modal"),
  accLine: document.getElementById("typing-accuracy-line"),
  wpmLine: document.getElementById("typing-wpm-line"),
  tryNo: document.getElementById("typing-try-no"),
};

export function initTyping() {
  bindTypingControls();
  resetTyping();
}

function isActive() {
  return !!els.panel && els.panel.classList.contains("active");
}

function bindTypingControls() {
  document.querySelectorAll("[data-pack]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-pack]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.pack = btn.dataset.pack;
      resetTyping();
    });
  });

  document.querySelectorAll("[data-length]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-length]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.length = btn.dataset.length;
      resetTyping();
    });
  });

  if (els.restart) els.restart.addEventListener("click", resetTyping);
  if (els.tryNo) els.tryNo.addEventListener("click", hideModal);

  // Use hidden input for typing
  if (els.input) {
    els.input.addEventListener("input", (e) => {
      if (!isActive()) return;
      if (state.stage !== "running") {
        // block typing before start
        els.input.value = "";
        return;
      }
      onInputChange(String(e.target.value ?? ""));
    });
  }

  // Global Enter handler (start only when typing tab is active)
  window.addEventListener("keydown", (e) => {
    if (!isActive()) return;
    if (e.key !== "Enter") return;

    if (state.stage === "idle") {
      startRun();
      e.preventDefault();
      return;
    }

    // If done, Enter restarts
    if (state.stage === "done") {
      resetTyping();
      e.preventDefault();
    }
  });
}

function resetTyping() {
  state.input = "";
  state.startedAt = null;
  state.finishedAt = null;
  state.stage = "idle";

  const picked = pickPrompt(state.pack, state.length);
  state.target = picked.text;
  state.source = picked.source;

  const pack = PROMPTS[state.pack] ?? PROMPTS.bourdain;
  if (els.title) els.title.textContent = pack.title; // ✅ fix: don’t wipe title
  if (els.sub) els.sub.textContent = state.source || pack.subtitle || "";

  if (els.input) els.input.value = "";
  renderQuote(state.target, "");

  hideModal();

  // keep focus ready but it will not start timer until Enter
  if (els.input) els.input.focus();
}

function startRun() {
  state.stage = "running";
  state.startedAt = Date.now();
  if (els.input) els.input.focus();
}

function onInputChange(v) {
  if (state.stage !== "running") return;
  if (state.finishedAt) return;

  state.input = v;
  renderQuote(state.target, state.input);

  if (state.input.length >= state.target.length) {
    state.finishedAt = Date.now();
    state.stage = "done";
    showResults();
  }
}

function renderQuote(target, input) {
  if (!els.quote) return;

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

  // cursor underline on first remaining char
  if (target.length > input.length && frag.childNodes[input.length]) {
    frag.childNodes[input.length].classList.add("cursor");
  }

  els.quote.innerHTML = "";
  els.quote.appendChild(frag);

  // Update focus word/letter
  const idx = input.length;
  const prevSpace = target.lastIndexOf(" ", idx - 1);
  const nextSpace = target.indexOf(" ", idx);
  const start = prevSpace === -1 ? 0 : prevSpace + 1;
  const end = nextSpace === -1 ? target.length : nextSpace;
  const currentWord = target.slice(start, end) || "—";
  const currentLetter = target[idx] ?? "—";
  if (els.focusWord) els.focusWord.textContent = currentWord;
  if (els.focusLetter) els.focusLetter.textContent = currentLetter;

  // Optional: gentle scroll to keep cursor area visible (requires quoteWrap scrollable)
  if (els.quoteWrap) {
    const activeNode = els.quote.childNodes[idx];
    if (activeNode && activeNode.scrollIntoView) {
      activeNode.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }
}

function showResults() {
  const correct = countCorrectChars(state.target, state.input);
  const expected = state.target.length;
  const accuracy = expected === 0 ? 100 : Math.round((correct / expected) * 100);

  const minutes = elapsedMinutes(state.startedAt, state.finishedAt);
  const wpm = minutes <= 0 ? 0 : Math.max(0, Math.round(countWords(state.input) / minutes));

  if (els.accLine) {
    els.accLine.textContent = `${correct}/${expected} characters = ${accuracy}% accuracy`;
  }
  if (els.wpmLine) {
    els.wpmLine.textContent = `Took ${minutes.toFixed(2)} minute(s) = ${wpm} WPM`;
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

  const toObj = (item) => {
    if (typeof item === "string") return { text: item, source: p.subtitle || "" };
    return { text: item.text, source: item.source || p.subtitle || "" };
  };

  const choice = toObj(list[Math.floor(Math.random() * list.length)] ?? "");
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
  for (let i = 0; i < n; i++) if (input[i] === target[i]) c++;
  return c;
}

function elapsedMinutes(start, end) {
  if (!start || !end) return 0;
  return (end - start) / 60000;
}
