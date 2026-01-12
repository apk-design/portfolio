// js/checker/layout.js
// Layout definitions with fixed-unit sizing.
// 1u = 1x1 (we set 50px in CSS). Wider/taller keys use multiples of 1u.

export function getLayout(size) {
  const s = String(size).toLowerCase();
  if (s === "60%") return LAYOUT_60;
  if (s === "65%") return LAYOUT_65;
  if (s === "75%") return LAYOUT_75;
  if (s === "tkl") return LAYOUT_TKL; // use tenkeyless (no numpad)
  if (s === "100%") return LAYOUT_100;
  return LAYOUT_60;
}

export function getExpectedKeys(size) {
  const rows = getLayout(size);
  const out = [];
  for (const row of rows) {
    for (const key of row) {
      if (!key || key.gap || !key.code) continue;
      out.push(key.code);
    }
  }
  return Array.from(new Set(out));
}

// Fixed sizes applied everywhere unless overridden
const TAB = 1.5;
const BACKSLASH = 1.5;
const CAPS = 1.75;
const BACKSPACE = 2;
const ENTER = 2.25;
const LEFT_SHIFT = 2.25;
const SPACE = 6.25;
const MOD_125 = 1.25;

/* ---------- 60% ---------- */
const LAYOUT_60 = [
  [
    k("Escape", "Esc"),
    ...digitsRow(),
    k("Minus", "-"),
    k("Equal", "="),
    k("Backspace", "Backspace", BACKSPACE),
  ],
  [
    k("Tab", "Tab", TAB),
    ...qwertyRow(),
    k("BracketLeft", "["),
    k("BracketRight", "]"),
    k("Backslash", "\\", BACKSLASH),
  ],
  [
    k("CapsLock", "Caps", CAPS),
    ...homeRow(),
    k("Semicolon", ";"),
    k("Quote", "'"),
    k("Enter", "Enter", ENTER),
  ],
  [
    k("ShiftLeft", "Shift", LEFT_SHIFT),
    ...bottomRow(),
    k("Comma", ","),
    k("Period", "."),
    k("Slash", "/"),
    k("ShiftRight", "Shift", 2.75),
  ],
  [
    k("ControlLeft", "Ctrl", MOD_125),
    k("MetaLeft", "Meta", MOD_125),
    k("AltLeft", "Alt", MOD_125),
    k("Space", "Space", SPACE),
    k("AltRight", "Alt", MOD_125),
    k("MetaRight", "Meta", MOD_125),
    k("ContextMenu", "Menu", MOD_125),
    k("ControlRight", "Ctrl", MOD_125),
  ],
];

/* ---------- 65% ---------- */
const LAYOUT_65 = [
  [
    k("Escape", "Esc"),
    ...digitsRow(),
    k("Minus", "-"),
    k("Equal", "="),
    k("Backspace", "Backspace", BACKSPACE),
    k("Delete", "Del"),
  ],
  [
    k("Tab", "Tab", TAB),
    ...qwertyRow(),
    k("BracketLeft", "["),
    k("BracketRight", "]"),
    k("Backslash", "\\", BACKSLASH),
    k("PageUp", "PgUp"),
  ],
  [
    k("CapsLock", "Caps", CAPS),
    ...homeRow(),
    k("Semicolon", ";"),
    k("Quote", "'"),
    k("Enter", "Enter", ENTER),
    k("PageDown", "PgDn"),
  ],
  [
    k("ShiftLeft", "Shift", LEFT_SHIFT),
    ...bottomRow(),
    k("Comma", ","),
    k("Period", "."),
    k("Slash", "/"),
    k("ShiftRight", "Shift", 1.75),
    k("ArrowUp", "↑"),
    k("End", "End"),
  ],
  [
    k("ControlLeft", "Ctrl", 1),
    k("MetaLeft", "Meta", 1),
    k("AltLeft", "Alt", 1),
    k("Space", "Space", SPACE),
    k("AltRight", "Alt", 1),
    k("ControlRight", "Ctrl", 1),
    k("MetaRight", "Meta", 1),
    k("ArrowLeft", "←"),
    k("ArrowDown", "↓"),
    k("ArrowRight", "→"),
  ],
];

/* ---------- 75% ---------- */
const LAYOUT_75 = [
  [
    k("Escape", "Esc"),
    ...fRow(),
  ],
  [
    k("Backquote", "`"),
    ...digitsRow(),
    k("Minus", "-"),
    k("Equal", "="),
    k("Backspace", "Backspace", BACKSPACE),
    k("Delete", "Del"),
  ],
  [
    k("Tab", "Tab", TAB),
    ...qwertyRow(),
    k("BracketLeft", "["),
    k("BracketRight", "]"),
    k("Backslash", "\\", BACKSLASH),
    k("PageUp", "PgUp"),
  ],
  [
    k("CapsLock", "Caps", CAPS),
    ...homeRow(),
    k("Semicolon", ";"),
    k("Quote", "'"),
    k("Enter", "Enter", ENTER),
    k("PageDown", "PgDn"),
  ],
  [
    k("ShiftLeft", "Shift", LEFT_SHIFT),
    ...bottomRow(),
    k("Comma", ","),
    k("Period", "."),
    k("Slash", "/"),
    k("ShiftRight", "Shift", 1.75),
    k("ArrowUp", "↑"),
    k("End", "End"),
  ],
  [
    k("ControlLeft", "Ctrl", 1),
    k("MetaLeft", "Meta", 1),
    k("AltLeft", "Alt", 1.25),
    k("Space", "Space", SPACE),
    k("AltRight", "Alt", 1.25),
    k("ControlRight", "Ctrl", 1),
    k("ContextMenu", "Menu", 1),
    k("ArrowLeft", "←"),
    k("ArrowDown", "↓"),
    k("ArrowRight", "→"),
  ],
];

/* ---------- TKL ---------- */
const LAYOUT_TKL = [
  [
    k("Escape", "Esc"),
    ...fRow(),
    k("PrintScreen", "PrtSc"),
    k("ScrollLock", "ScrLk"),
    k("Pause", "Pause"),
  ],
  [
    k("Backquote", "`"),
    ...digitsRow(),
    k("Minus", "-"),
    k("Equal", "="),
    k("Backspace", "Backspace", BACKSPACE),
    k("Insert", "Ins"),
    k("Home", "Home"),
    k("PageUp", "PgUp"),
  ],
  [
    k("Tab", "Tab", TAB),
    ...qwertyRow(),
    k("BracketLeft", "["),
    k("BracketRight", "]"),
    k("Backslash", "\\", BACKSLASH),
    k("Delete", "Del"),
    k("End", "End"),
    k("PageDown", "PgDn"),
  ],
  [
    k("CapsLock", "Caps", CAPS),
    ...homeRow(),
    k("Semicolon", ";"),
    k("Quote", "'"),
    k("Enter", "Enter", ENTER),
  ],
  [
    k("ShiftLeft", "Shift", LEFT_SHIFT),
    ...bottomRow(),
    k("Comma", ","),
    k("Period", "."),
    k("Slash", "/"),
    k("ShiftRight", "Shift", 2.75),
    k("ArrowUp", "↑"),
  ],
  [
    k("ControlLeft", "Ctrl", MOD_125),
    k("MetaLeft", "Meta", MOD_125),
    k("AltLeft", "Alt", MOD_125),
    k("Space", "Space", SPACE),
    k("AltRight", "Alt", MOD_125),
    k("MetaRight", "Meta", MOD_125),
    k("ContextMenu", "Menu", MOD_125),
    k("ControlRight", "Ctrl", MOD_125),
    k("ArrowLeft", "←"),
    k("ArrowDown", "↓"),
    k("ArrowRight", "→"),
  ],
];

/* ---------- 100% ---------- */
const LAYOUT_100 = [
  [
    k("Escape", "Esc"),
    ...fRow(),
    gap(1), gap(1),
    k("PrintScreen", "PrtSc"),
    k("ScrollLock", "ScrLk"),
    k("Pause", "Pause"),
    gap(1), gap(1), gap(1), gap(1),
  ],
  [
    k("Backquote", "`"),
    ...digitsRow(),
    k("Minus", "-"),
    k("Equal", "="),
    k("Backspace", "Backspace", BACKSPACE),
    k("Insert", "Ins"),
    k("Home", "Home"),
    k("PageUp", "PgUp"),
    k("NumLock", "Num", 1, 1),
    k("NumpadDivide", "/", 1, 1),
    k("NumpadMultiply", "*", 1, 1),
    k("NumpadSubtract", "-", 1, 1),
  ],
  [
    k("Tab", "Tab", TAB),
    ...qwertyRow(),
    k("BracketLeft", "["),
    k("BracketRight", "]"),
    k("Backslash", "\\", BACKSLASH),
    k("Delete", "Del"),
    k("End", "End"),
    k("PageDown", "PgDn"),
    k("Numpad7", "7", 1, 1),
    k("Numpad8", "8", 1, 1),
    k("Numpad9", "9", 1, 1),
    k("NumpadAdd", "+", 1, 1),
  ],
  [
    k("CapsLock", "Caps", CAPS),
    ...homeRow(),
    k("Semicolon", ";"),
    k("Quote", "'"),
    k("Enter", "Enter", ENTER),
    gap(1), gap(1), gap(1),
    k("Numpad4", "4"),
    k("Numpad5", "5"),
    k("Numpad6", "6"),
    gap(1),
  ],
  [
    k("ShiftLeft", "Shift", LEFT_SHIFT),
    ...bottomRow(),
    k("Comma", ","),
    k("Period", "."),
    k("Slash", "/"),
    k("ShiftRight", "Shift", 2.75),
    k("ArrowUp", "↑"),
    gap(1), gap(1), gap(1),
    k("Numpad1", "1"),
    k("Numpad2", "2"),
    k("Numpad3", "3"),
    k("NumpadEnter", "Enter", 1, 3), // 3u tall; pad handled in CSS
  ],
  [
    k("ControlLeft", "Ctrl", MOD_125),
    k("MetaLeft", "Meta", MOD_125),
    k("AltLeft", "Alt", MOD_125),
    k("Space", "Space", SPACE),
    k("AltRight", "Alt", MOD_125),
    k("MetaRight", "Meta", MOD_125),
    k("ContextMenu", "Menu", MOD_125),
    k("ControlRight", "Ctrl", MOD_125),
    k("ArrowLeft", "←"),
    k("ArrowDown", "↓"),
    k("ArrowRight", "→"),
    k("Numpad0", "0", 2, 1),
    k("NumpadDecimal", ".", 1),
  ],
];

/* ---------- helpers ---------- */

function k(code, label, w = 1, h = 1) {
  return { code, label, w, h };
}

function gap(w = 1, h = 1) {
  return { gap: true, w, h };
}

function digitsRow() {
  return [
    k("Digit1","1"), k("Digit2","2"), k("Digit3","3"), k("Digit4","4"), k("Digit5","5"),
    k("Digit6","6"), k("Digit7","7"), k("Digit8","8"), k("Digit9","9"), k("Digit0","0"),
  ];
}

function qwertyRow() {
  return [
    k("KeyQ","Q"), k("KeyW","W"), k("KeyE","E"), k("KeyR","R"), k("KeyT","T"),
    k("KeyY","Y"), k("KeyU","U"), k("KeyI","I"), k("KeyO","O"), k("KeyP","P"),
  ];
}

function homeRow() {
  return [
    k("KeyA","A"), k("KeyS","S"), k("KeyD","D"), k("KeyF","F"), k("KeyG","G"),
    k("KeyH","H"), k("KeyJ","J"), k("KeyK","K"), k("KeyL","L"),
  ];
}

function bottomRow() {
  return [
    k("KeyZ","Z"), k("KeyX","X"), k("KeyC","C"), k("KeyV","V"), k("KeyB","B"),
    k("KeyN","N"), k("KeyM","M"),
  ];
}

function fRow() {
  return [
    k("F1","F1",1,1), k("F2","F2",1,1), k("F3","F3",1,1), k("F4","F4",1,1),
    k("F5","F5",1,1), k("F6","F6",1,1), k("F7","F7",1,1), k("F8","F8",1,1),
    k("F9","F9",1,1), k("F10","F10",1,1), k("F11","F11",1,1), k("F12","F12",1,1),
  ];
}
