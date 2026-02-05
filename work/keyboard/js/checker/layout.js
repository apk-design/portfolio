// js/checker/layout.js
// Canonical layout geometry.
// All visual alignment must come from:
// - key widths/heights (w/h in "u" units)
// - gap() spacer keys
// No CSS transforms. No per-key nudging.

export function getLayout(size) {
  const s = String(size).toLowerCase();
  if (s === "60%") return LAYOUT_60;
  if (s === "65%") return LAYOUT_65;
  if (s === "75%") return LAYOUT_75;
  if (s === "tkl") return LAYOUT_TKL;
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

/* ---------- unit constants ---------- */

const GAP = 0.5;          // visual separation between clusters (kbdlab style)
const TAB = 1.5;
const BACKSLASH = 1.5;
const CAPS = 1.75;
const BACKSPACE = 2;
const ENTER = 2.25;
const LEFT_SHIFT = 2.25;
const SPACE = 6.25;

// bottom-row mods
const MOD_125 = 1.25;

/* ---------- 60% ---------- */
/*
Row 1: ` 1..0 - = Backspace
Row 2: Tab Q..P [ ] \ 
Row 3: Caps A..L ; ' Enter
Row 4: LShift Z..M , . / RShift(2.75)
Row 5: Ctrl Meta Alt Space Alt Meta Menu Ctrl (all 1.25)
*/
const LAYOUT_60 = [
  [
    k("Backquote", "`"),
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
/*
Adds:
- right-side nav column: Del / PgUp / PgDn / End (1u)
- arrow cluster (1u)
Bottom row mods (65): Ctrl/Alt/Meta are 1u (per your rule)
*/
const LAYOUT_65 = [
  [
    k("Backquote", "`"),
    ...digitsRow(),
    k("Minus", "-"),
    k("Equal", "="),
    k("Backspace", "Backspace", BACKSPACE),
    gap(GAP),
    k("Delete", "Del"),
  ],
  [
    k("Tab", "Tab", TAB),
    ...qwertyRow(),
    k("BracketLeft", "["),
    k("BracketRight", "]"),
    k("Backslash", "\\", BACKSLASH),
    gap(GAP),
    k("PageUp", "PgUp"),
  ],
  [
    k("CapsLock", "Caps", CAPS),
    ...homeRow(),
    k("Semicolon", ";"),
    k("Quote", "'"),
    k("Enter", "Enter", ENTER),
    gap(GAP),
    k("PageDown", "PgDn"),
  ],
  [
    k("ShiftLeft", "Shift", LEFT_SHIFT),
    ...bottomRow(),
    k("Comma", ","),
    k("Period", "."),
    k("Slash", "/"),
    k("ShiftRight", "Shift", 1.75),
    gap(GAP),
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
    gap(GAP),
    k("ArrowLeft", "←"),
    k("ArrowDown", "↓"),
    k("ArrowRight", "→"),
    gap(1), // keeps a clean empty cell under the End column visually
  ],
];

/* ---------- 75% ---------- */
/*
Adds:
- function row
- right-side nav column (Del / PgUp / PgDn / End)
- arrow cluster
Bottom row mods (75): Alt is 1.25, Ctrl/Menu 1u (per your rule)
*/
const LAYOUT_75 = [
  [
    k("Escape", "Esc"),
    gap(GAP),
    ...fRowGrouped(),
    gap(GAP),
    k("Delete", "Del"),
  ],
  [
    k("Backquote", "`"),
    ...digitsRow(),
    k("Minus", "-"),
    k("Equal", "="),
    k("Backspace", "Backspace", BACKSPACE),
    gap(GAP),
    k("PageUp", "PgUp"),
  ],
  [
    k("Tab", "Tab", TAB),
    ...qwertyRow(),
    k("BracketLeft", "["),
    k("BracketRight", "]"),
    k("Backslash", "\\", BACKSLASH),
    gap(GAP),
    k("PageDown", "PgDn"),
  ],
  [
    k("CapsLock", "Caps", CAPS),
    ...homeRow(),
    k("Semicolon", ";"),
    k("Quote", "'"),
    k("Enter", "Enter", ENTER),
    gap(GAP),
    k("End", "End"),
  ],
  [
    k("ShiftLeft", "Shift", LEFT_SHIFT),
    ...bottomRow(),
    k("Comma", ","),
    k("Period", "."),
    k("Slash", "/"),
    k("ShiftRight", "Shift", 1.75),
    gap(GAP),
    k("ArrowUp", "↑"),
    gap(1),
  ],
  [
    k("ControlLeft", "Ctrl", 1),
    k("MetaLeft", "Meta", 1),
    k("AltLeft", "Alt", 1.25),
    k("Space", "Space", SPACE),
    k("AltRight", "Alt", 1.25),
    k("ControlRight", "Ctrl", 1),
    k("ContextMenu", "Menu", 1),
    gap(GAP),
    k("ArrowLeft", "←"),
    k("ArrowDown", "↓"),
    k("ArrowRight", "→"),
    gap(1),
  ],
];

/* ---------- TKL ---------- */
/*
Standard ANSI TKL:
- F row
- 3-key block: PrtSc / ScrLk / Pause
- nav cluster: Ins/Home/PgUp and Del/End/PgDn
- arrow cluster
Bottom row mods: 1.25u
Right shift: 2.75u
*/
const LAYOUT_TKL = [
  [
    k("Escape", "Esc"),
    gap(GAP),
    ...fRowGrouped(),
    gap(GAP),
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
    gap(GAP),
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
    gap(GAP),
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
    gap(GAP),
    gap(3), // empty space where nav cluster doesn't exist on this row
  ],
  [
    k("ShiftLeft", "Shift", LEFT_SHIFT),
    ...bottomRow(),
    k("Comma", ","),
    k("Period", "."),
    k("Slash", "/"),
    k("ShiftRight", "Shift", 2.75),
    gap(GAP),
    gap(1),            // spacer before arrow block
    k("ArrowUp", "↑"),
    gap(1),            // spacer after arrow block
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
    gap(GAP),
    k("ArrowLeft", "←"),
    k("ArrowDown", "↓"),
    k("ArrowRight", "→"),
  ],
];

/* ---------- 100% ---------- */
/*
Full size ANSI:
- TKL block + nav cluster + arrow cluster
- numpad on the right
Your rules:
- Numpad0 = 2u wide
- NumpadEnter = 2u tall
- everything else numpad = 1u
*/
const LAYOUT_100 = [
  [
    k("Escape", "Esc"),
    gap(GAP),
    ...fRowGrouped(),
    gap(GAP),
    k("PrintScreen", "PrtSc"),
    k("ScrollLock", "ScrLk"),
    k("Pause", "Pause"),
    gap(GAP),
    k("NumLock", "Num"),
    k("NumpadDivide", "/"),
    k("NumpadMultiply", "*"),
    k("NumpadSubtract", "-"),
  ],
  [
    k("Backquote", "`"),
    ...digitsRow(),
    k("Minus", "-"),
    k("Equal", "="),
    k("Backspace", "Backspace", BACKSPACE),
    gap(GAP),
    k("Insert", "Ins"),
    k("Home", "Home"),
    k("PageUp", "PgUp"),
    gap(GAP),
    k("Numpad7", "7"),
    k("Numpad8", "8"),
    k("Numpad9", "9"),
    k("NumpadAdd", "+"),
  ],
  [
    k("Tab", "Tab", TAB),
    ...qwertyRow(),
    k("BracketLeft", "["),
    k("BracketRight", "]"),
    k("Backslash", "\\", BACKSLASH),
    gap(GAP),
    k("Delete", "Del"),
    k("End", "End"),
    k("PageDown", "PgDn"),
    gap(GAP),
    k("Numpad4", "4"),
    k("Numpad5", "5"),
    k("Numpad6", "6"),
    gap(1),
  ],
  [
    k("CapsLock", "Caps", CAPS),
    ...homeRow(),
    k("Semicolon", ";"),
    k("Quote", "'"),
    k("Enter", "Enter", ENTER),
    gap(GAP),
    gap(3), // empty space under nav cluster
    gap(GAP),
    k("Numpad1", "1"),
    k("Numpad2", "2"),
    k("Numpad3", "3"),
    k("NumpadEnter", "Enter", 1, 2), // 2u tall
  ],
  [
    k("ShiftLeft", "Shift", LEFT_SHIFT),
    ...bottomRow(),
    k("Comma", ","),
    k("Period", "."),
    k("Slash", "/"),
    k("ShiftRight", "Shift", 2.75),
    gap(GAP),
    gap(1),
    k("ArrowUp", "↑"),
    gap(1),
    gap(GAP),
    k("Numpad0", "0", 2, 1),        // 2u wide
    k("NumpadDecimal", "."),
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
    gap(GAP),
    k("ArrowLeft", "←"),
    k("ArrowDown", "↓"),
    k("ArrowRight", "→"),
    gap(GAP),
    gap(1), gap(1), gap(1), gap(1), // blank under numpad enter stack area
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

function fRowGrouped() {
  return [
    k("F1","F1"), k("F2","F2"), k("F3","F3"), k("F4","F4"),
    gap(GAP),
    k("F5","F5"), k("F6","F6"), k("F7","F7"), k("F8","F8"),
    gap(GAP),
    k("F9","F9"), k("F10","F10"), k("F11","F11"), k("F12","F12"),
  ];
}
