// js/tool.js
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
  for (const btn of tabButtons) {
    btn.classList.toggle("active", btn.dataset.tab === name);
  }

  if (panels.checker) panels.checker.classList.toggle("active", name === "checker");
  if (panels.typing) panels.typing.classList.toggle("active", name === "typing");

  // global signal for any module that wants it
  document.documentElement.dataset.activeTab = name;
  window.dispatchEvent(new CustomEvent("tool:tabchange", { detail: { tab: name } }));

  try { localStorage.setItem(TAB_KEY, name); } catch {}
}

for (const btn of tabButtons) {
  btn.addEventListener("click", () => setTab(btn.dataset.tab));
}

let initialTab = "checker";
try {
  const saved = localStorage.getItem(TAB_KEY);
  if (saved === "typing" || saved === "checker") initialTab = saved;
} catch {}

setTab(initialTab);
