// js/tool.js
// Single entry point.
// - Initializes Checker + Typing
// - Handles tab switching (single page)

// IMPORTANT: path assumes your structure:
// js/tool.js
// js/checker/checker.js
// js/typing/typing.js

import { initChecker } from "./checker/checker.js";
import { initTyping } from "./typing/typing.js";

const TAB_KEY = "checker:lastTab";

initChecker();
initTyping();

const tabButtons = Array.from(document.querySelectorAll("[data-tab]"));
const panels = {
  checker: document.getElementById("tab-checker"),
  typing: document.getElementById("tab-typing"),
};

function setTab(name) {
  // buttons
  for (const btn of tabButtons) {
    const active = btn.dataset.tab === name;
    btn.classList.toggle("active", active);
  }

  // panels
  if (panels.checker) panels.checker.classList.toggle("active", name === "checker");
  if (panels.typing) panels.typing.classList.toggle("active", name === "typing");

  try {
    localStorage.setItem(TAB_KEY, name);
  } catch (e) {
    // ignore storage errors
  }
}

// click handlers
for (const btn of tabButtons) {
  btn.addEventListener("click", () => setTab(btn.dataset.tab));
}

// default tab (persist last selection)
let initialTab = "checker";
try {
  const saved = localStorage.getItem(TAB_KEY);
  if (saved === "typing" || saved === "checker") {
    initialTab = saved;
  }
} catch (e) {
  // ignore storage errors
}
setTab(initialTab);
