
// Google Analytics
(function(){
  const GA_ID = 'G-VC107MK7W0';
  if(!GA_ID || typeof document === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', GA_ID);
  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(gaScript);
})();

// Theme toggle
const initThemeToggle = () => {
  const ensureToggle = () => {
    let checkbox = document.getElementById('theme-checkbox');
    if (checkbox) return checkbox;

    const navbar = document.querySelector('.navbar');
    if (!navbar) return null;

    let toggleWrapper = navbar.querySelector('.theme-toggle');
    if (!toggleWrapper) {
      toggleWrapper = document.createElement('div');
      toggleWrapper.className = 'right theme-toggle';
      toggleWrapper.innerHTML = `
        <label class="theme-switch">
          <input type="checkbox" id="theme-checkbox">
          <span class="slider"></span>
        </label>
      `;
      navbar.appendChild(toggleWrapper);
    }
    return toggleWrapper.querySelector('#theme-checkbox');
  };

  const checkbox = ensureToggle();
  if (!checkbox) return;

  const applyTheme = () => {
    if (checkbox.checked) {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
      localStorage.removeItem('theme');
    }
  };

  if (!checkbox.dataset.bound) {
    checkbox.addEventListener('change', applyTheme);
    checkbox.dataset.bound = 'true';
  }

  if (localStorage.getItem('theme') === 'dark') {
    checkbox.checked = true;
    document.body.setAttribute('data-theme', 'dark');
  } else {
    checkbox.checked = false;
    document.body.removeAttribute('data-theme');
  }
};

initThemeToggle();

// Navbar show on scroll-up + transparent -> solid on scroll
let lastScroll = 0;
const nav = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  const y = window.pageYOffset || document.documentElement.scrollTop;
  if (y > 50) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
  if (y < lastScroll) { nav.style.transform = 'translateY(0)'; }
  else { nav.style.transform = 'translateY(-100%)'; }
  lastScroll = y;
});

// Fade-in cards
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); }});
},{threshold:0.2});
document.querySelectorAll('.card').forEach(el=>observer.observe(el));

// ---------------------------------------------------------------------------
// Before/After Slider
// ---------------------------------------------------------------------------

(function () {
  const sliders = document.querySelectorAll('.ba-container');
  if (!sliders.length) return; // No sliders on this page — exit safely

  sliders.forEach(container => {
    const beforeImg = container.querySelector('.ba-before');
    const handle = container.querySelector('.ba-handle');

    if (!beforeImg || !handle) return; // Incomplete slider markup — skip

    let dragging = false;

    const applyPercent = (percent) => {
      const clamped = Math.max(0, Math.min(100, percent));
      beforeImg.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
      handle.style.left = `${clamped}%`;
    };

    const setPosition = (clientX) => {
      const rect = container.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      applyPercent((x / rect.width) * 100);
    };

    const startDrag = (clientX) => {
      dragging = true;
      setPosition(clientX);
    };

    const moveDrag = (clientX) => {
      if (!dragging) return;
      setPosition(clientX);
    };

    const endDrag = () => { dragging = false; };

    // ---- Mouse ----
    const onMouseDown = (e) => {
      if (e.button !== 0) return; // only respond to primary button
      startDrag(e.clientX);
    };
    handle.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', (e) => moveDrag(e.clientX));
    window.addEventListener('mouseup', endDrag);

    // ---- Touch ----
    const onTouchStart = (e) => startDrag(e.touches[0].clientX);
    handle.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', (e) => moveDrag(e.touches[0].clientX), { passive: true });
    window.addEventListener('touchend', endDrag);

    // Default to 50/50 split
    applyPercent(50);
  });
})();
