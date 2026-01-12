// js/checker/checker.js
import { getExpectedKeys, getLayout } from "./layout.js";

let state = {
  started: false,
  finished: false,
  size: "60%",
  os: "windows",
  pressed: new Set(),
  seen: new Set(),
  log: [],
};

const SIZE_KEY = "checker:size";
const OS_KEY = "checker:os";

const els = {
  keyboard: document.getElementById("checker-keyboard"),
  log: document.getElementById("checker-log"),
  restartBtn: document.getElementById("checker-restart"),

  prompt: document.getElementById("checker-prompt"),
  promptYes: document.getElementById("checker-prompt-yes"),
  promptNo: document.getElementById("checker-prompt-no"),

  results: document.getElementById("checker-results"),
  missingList: document.getElementById("checker-missing-list"),

  celebrate: document.getElementById("checker-celebrate"),
};

export function initChecker() {
  loadPersistedSelection();
  bindControls();
  renderKeyboard();
  resetUI();

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
}

/* ---------- EVENTS ---------- */

function onKeyDown(e) {
  if (state.finished) return;

  if (!state.started) {
    state.started = true;
  }

  const code = e.code;
  if (!code) return;

  state.pressed.add(code);
  state.seen.add(code);

  logEvent("keydown", e);
  updateKeyVisual(code, true);

  if (els.promptYes) els.promptYes.disabled = false;
}

function onKeyUp(e) {
  const code = e.code;
  if (!code) return;

  state.pressed.delete(code);
  logEvent("keyup", e);
  updateKeyVisual(code, false);
}

/* ---------- LOGGING ---------- */

function logEvent(type, e) {
  const line = `[${time()}] ${type.padEnd(7)} key="${e.key}" code=${e.code}`;
  state.log.push(line);

  const div = document.createElement("div");
  div.textContent = line;
  els.log.appendChild(div);
  els.log.scrollTop = els.log.scrollHeight;
}

function time() {
  return new Date().toLocaleTimeString();
}

/* ---------- FINISH / RESET ---------- */

function finishTest() {
  state.finished = true;

  const expected = getExpectedKeys(state.size);
  const missing = expected.filter(code => !state.seen.has(code));

  if (els.prompt) els.prompt.style.display = "none";

  if (missing.length === 0) {
    showCelebrate();
  } else {
    showResults(missing);
  }
}

function resetTest() {
  state.started = false;
  state.finished = false;
  state.pressed.clear();
  state.seen.clear();
  state.log.length = 0;

  els.log.innerHTML = "";
  resetUI();
  renderKeyboard();
}

/* ---------- UI ---------- */

function resetUI() {
  if (els.promptYes) els.promptYes.disabled = true;

  if (els.prompt) els.prompt.style.display = "grid";
  if (els.results) els.results.style.display = "none";
  if (els.celebrate) els.celebrate.style.display = "none";

  if (els.keyboard) {
    els.keyboard.querySelectorAll(".keycap").forEach(key => {
      key.classList.remove("pressed", "pressing", "seen");
    });
  }
}

function showResults(missing) {
  if (!els.results || !els.missingList) return;

  els.results.style.display = "grid";
  els.missingList.innerHTML = "";

  missing.forEach(code => {
    const item = document.createElement("div");
    item.className = "missingItem";
    item.innerHTML = `
      <div>${code}</div>
      <div class="missingCode">${code}</div>
    `;
    els.missingList.appendChild(item);
  });
}

function showCelebrate() {
  if (els.celebrate) els.celebrate.style.display = "grid";
}

/* ---------- KEYBOARD RENDERING ---------- */

function renderKeyboard() {
  els.keyboard.innerHTML = "";
  els.keyboard.dataset.size = state.size;

  const rows = getLayout(state.size);

  for (const row of rows) {
    const rowEl = document.createElement("div");
    rowEl.className = "kbRow";

    for (const keyDef of row) {
      const key = document.createElement("div");
      key.className = "keycap" + (keyDef.gap ? " gap" : "");
      key.style.setProperty("--w", String(keyDef.w || 1));
      key.style.setProperty("--h", String(keyDef.h || 1));

      if (!keyDef.gap) {
        key.dataset.code = keyDef.code;
        key.innerHTML = `
          <div class="keyLabel">${keyDef.label || labelFor(keyDef.code)}</div>
          <div class="keyCode">${keyDef.code}</div>
        `;
      } else {
        key.setAttribute("aria-hidden", "true");
      }

      rowEl.appendChild(key);
    }

    els.keyboard.appendChild(rowEl);
  }
}

function updateKeyVisual(code, isDown) {
  if (!els.keyboard) return;
  const key = els.keyboard.querySelector(`[data-code="${code}"]`);
  if (!key) return;

  if (isDown) {
    key.classList.add("pressing", "pressed", "seen");
  } else {
    key.classList.remove("pressing", "pressed");
    key.classList.add("seen");
  }
}

/* ---------- CONTROLS ---------- */

function bindControls() {
  if (els.restartBtn) els.restartBtn.addEventListener("click", resetTest);

  if (els.promptYes) els.promptYes.addEventListener("click", finishTest);
  if (els.promptNo) {
    els.promptNo.addEventListener("click", () => {
      els.hint.textContent = "continue testing";
    });
  }

  // size chips
  document.querySelectorAll("[data-size]").forEach(btn => {
    btn.addEventListener("click", () => {
      setSize(btn.dataset.size, { reset: true });
    });
  });

  // OS toggle (visual only for now)
  document.querySelectorAll("[data-os]").forEach(btn => {
    btn.addEventListener("click", () => {
      setOS(btn.dataset.os);
    });
  });
}

function setSize(value, { reset = false } = {}) {
  state.size = value;
  localStorage.setItem(SIZE_KEY, value);
  document.querySelectorAll("[data-size]").forEach(b => {
    b.classList.toggle("active", b.dataset.size === value);
  });
  if (reset) {
    resetTest();
  }
}

function setOS(value) {
  state.os = value;
  localStorage.setItem(OS_KEY, value);
  document.querySelectorAll("[data-os]").forEach(b => {
    b.classList.toggle("active", b.dataset.os === value);
  });
}

function loadPersistedSelection() {
  const savedSize = localStorage.getItem(SIZE_KEY);
  const savedOS = localStorage.getItem(OS_KEY);
  if (savedSize) state.size = savedSize;
  if (savedOS) state.os = savedOS;
  setSize(state.size);
  setOS(state.os);
}
