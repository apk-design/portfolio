// js/checker/checker.js
import { getLayout } from "./layout.js";

let state = {
  size: "60%",
  pressedNow: new Set(),   // currently held down
  pressedEver: new Set(),  // seen at least once this session
  started: false,
  log: [],
};

const SIZE_KEY = "checker:size";

const els = {
  panel: document.getElementById("tab-checker"),
  keyboard: document.getElementById("checker-keyboard"),
  log: document.getElementById("checker-log"),
  restartBtn: document.getElementById("checker-restart"),
};

// KeyboardEvent.code -> label
let labelMap = new Map();

export function initChecker() {
  loadPersistedSelection();
  bindControls();
  renderKeyboard();
  resetUI();

  // not passive so we can preventDefault for Space/Arrows/etc.
  window.addEventListener("keydown", onKeyDown, { passive: false });
  window.addEventListener("keyup", onKeyUp, { passive: false });
}

/* ---------- active gating ---------- */

function isActive() {
  return !!els.panel && els.panel.classList.contains("active");
}

/* ---------- events ---------- */

function onKeyDown(e) {
  if (!isActive()) return;

  const code = e.code;
  if (!code) return;

  // prevent page scroll / browser actions while testing
  // (space/arrow keys can scroll; tab can yank focus)
  if (
    e.key === " " ||
    e.key === "ArrowUp" ||
    e.key === "ArrowDown" ||
    e.key === "ArrowLeft" ||
    e.key === "ArrowRight" ||
    e.key === "Tab"
  ) {
    e.preventDefault();
  }

  if (!state.started) {
    state.started = true;
  }

  state.pressedNow.add(code);
  state.pressedEver.add(code);

  logEvent("keydown", e);
  updateKeyVisual(code, true);
}

function onKeyUp(e) {
  if (!isActive()) return;

  const code = e.code;
  if (!code) return;

  // match keydown preventDefault behavior
  if (
    e.key === " " ||
    e.key === "ArrowUp" ||
    e.key === "ArrowDown" ||
    e.key === "ArrowLeft" ||
    e.key === "ArrowRight" ||
    e.key === "Tab"
  ) {
    e.preventDefault();
  }

  state.pressedNow.delete(code);

  logEvent("keyup", e);
  updateKeyVisual(code, false);
}

/* ---------- logging ---------- */

function logEvent(type, e) {
  if (!els.log) return;

  const lineText =
    `[${time()}] ${type.padEnd(7)} key="${e.key}" code=${e.code}` +
    ` repeat=${!!e.repeat} location=${e.location}`;

  state.log.push(lineText);

  const div = document.createElement("div");
  div.textContent = lineText;
  els.log.appendChild(div);
  els.log.scrollTop = els.log.scrollHeight;
}

function time() {
  return new Date().toLocaleTimeString();
}

/* ---------- reset / ui ---------- */

function resetTest() {
  state.started = false;
  state.pressedNow.clear();
  state.pressedEver.clear();
  state.log.length = 0;

  if (els.log) {
    els.log.innerHTML = "";
    els.log.appendChild(line("[ready]"));
    els.log.appendChild(line("press a key to begin"));
  }

  renderKeyboard();
  resetUI();
}

function resetUI() {
  if (!els.keyboard) return;

  // clear visuals
  els.keyboard.querySelectorAll(".keycap").forEach((cap) => {
    cap.classList.remove("pressed", "pressing", "seen");
  });
}

/* ---------- keyboard rendering ---------- */

function renderKeyboard() {
  if (!els.keyboard) return;

  els.keyboard.innerHTML = "";
  els.keyboard.dataset.size = state.size;

  labelMap = buildLabelMap(state.size);
  const rows = getLayout(state.size);

  for (const row of rows) {
    const rowEl = document.createElement("div");
    rowEl.className = "kbRow";

    for (const keyDef of row) {
      const cap = document.createElement("div");
      cap.className = "keycap" + (keyDef.gap ? " gap" : "");
      cap.style.setProperty("--w", String(keyDef.w || 1));
      cap.style.setProperty("--h", String(keyDef.h || 1));

      if (!keyDef.gap) {
        cap.dataset.code = keyDef.code;
        cap.innerHTML = `<div class="keyLabel">${escapeHtml(keyDef.label || labelFor(keyDef.code))}</div>`;
      } else {
        cap.setAttribute("aria-hidden", "true");
      }

      rowEl.appendChild(cap);
    }

    els.keyboard.appendChild(rowEl);
  }
}

function updateKeyVisual(code, isDown) {
  if (!els.keyboard) return;

  const el = els.keyboard.querySelector(`[data-code="${code}"]`);
  if (!el) return;

  // - seen: pressed at least once
  // - pressed/pressing: currently down
  el.classList.add("seen");

  if (isDown) el.classList.add("pressing", "pressed");
  else el.classList.remove("pressing", "pressed");
}

function buildLabelMap(size) {
  const map = new Map();
  const rows = getLayout(size);
  for (const row of rows) {
    for (const k of row) {
      if (!k || k.gap || !k.code) continue;
      map.set(k.code, k.label || labelFor(k.code));
    }
  }
  return map;
}

/* ---------- controls ---------- */

function bindControls() {
  if (els.restartBtn) els.restartBtn.addEventListener("click", resetTest);

  // size chips
  document.querySelectorAll("[data-size]").forEach((btn) => {
    btn.addEventListener("click", () => setSize(btn.dataset.size, { reset: true }));
  });
}

function setSize(value, { reset = false } = {}) {
  if (!value) return;

  state.size = value;
  try { localStorage.setItem(SIZE_KEY, value); } catch {}

  document.querySelectorAll("[data-size]").forEach((b) => {
    b.classList.toggle("active", b.dataset.size === value);
  });

  if (reset) resetTest();
}

function loadPersistedSelection() {
  let savedSize = null;
  try { savedSize = localStorage.getItem(SIZE_KEY); } catch {}

  if (savedSize) state.size = savedSize;
  setSize(state.size, { reset: false });
}

/* ---------- helpers ---------- */

function labelFor(code) {
  if (code.startsWith("Key")) return code.slice(3);
  if (code.startsWith("Digit")) return code.slice(5);
  return code;
}

function line(text) {
  const d = document.createElement("div");
  d.textContent = text;
  return d;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
