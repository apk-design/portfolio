
// Theme toggle
const themeCheckbox = document.getElementById('theme-checkbox');
if (themeCheckbox){
  const applyTheme = () => {
    if(themeCheckbox.checked){
      document.body.setAttribute('data-theme','dark');
      localStorage.setItem('theme','dark');
    } else {
      document.body.removeAttribute('data-theme');
      localStorage.removeItem('theme');
    }
  };
  themeCheckbox.addEventListener('change', applyTheme);
  if(localStorage.getItem('theme')==='dark'){ themeCheckbox.checked = true; document.body.setAttribute('data-theme','dark'); }
}

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
// Before/After Slider (modular + safe for multiple case studies)
// ---------------------------------------------------------------------------

(function () {
  const sliders = document.querySelectorAll('.ba-container');
  if (!sliders.length) return; // No sliders on this page — exit safely

  sliders.forEach(container => {
    const overlay = container.querySelector('.ba-overlay');
    const handle = container.querySelector('.ba-handle');

    if (!overlay || !handle) return; // Incomplete slider markup — skip

    let dragging = false;

    function setPosition(clientX) {
      const rect = container.getBoundingClientRect();
      let x = clientX - rect.left;

      // Clamp to container bounds
      x = Math.max(0, Math.min(rect.width, x));

      const percent = (x / rect.width) * 100;

      overlay.style.width = percent + "%";
      handle.style.left = percent + "%";
    }

    // ---- Mouse ----
    handle.addEventListener('mousedown', (e) => {
      dragging = true;
      setPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => { dragging = false; });

    window.addEventListener('mousemove', (e) => {
      if (dragging) setPosition(e.clientX);
    });

    // ---- Touch ----
    handle.addEventListener('touchstart', (e) => {
      dragging = true;
      setPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => { dragging = false; });

    window.addEventListener('touchmove', (e) => {
      if (dragging) setPosition(e.touches[0].clientX);
    }, { passive: true });

  });
})();
