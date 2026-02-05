
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

const NAV_BREAKPOINT = 1024;

const NAV_LINKS = [
  { key: 'home', label: 'Home', href: 'index.html' },
  { key: 'resume', label: 'Resume', href: 'resume.html' },
  { key: 'work', label: 'Work', href: 'work.html' }
];

const computePathPrefix = () => {
  const path = window.location.pathname.split('?')[0];
  const segments = path.split('/').filter(Boolean);
  const repoIndex = segments.indexOf('portfolio');
  const relevant = repoIndex >= 0 ? segments.slice(repoIndex + 1) : segments;
  const depth = Math.max(0, relevant.length ? relevant.length - 1 : 0);
  return depth ? '../'.repeat(depth) : '';
};

const getActiveNavKey = () => {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('/resume')) return 'resume';
  if (path.includes('/work')) return 'work';
  return 'home';
};

const buildGlobalNav = () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const prefix = computePathPrefix();
  const activeKey = getActiveNavKey();
  const navLinksMarkup = NAV_LINKS.map(link => {
    const href = `${prefix}${link.href}`;
    const activeClass = activeKey === link.key ? ' active' : '';
    return `<a class="nav-btn${activeClass}" href="${href}">${link.label}</a>`;
  }).join('');

  navbar.innerHTML = `
    <div class="left">
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Toggle navigation">
        <span class="sr-only">Toggle navigation</span>
        <span class="nav-toggle-bar"></span>
        <span class="nav-toggle-bar"></span>
        <span class="nav-toggle-bar"></span>
      </button>
    </div>
    <div class="logo-slot">
      <a href="${prefix}index.html" aria-label="Home">
        <img src="${prefix}assets/logo_amberkumar.svg" alt="Amber Kumar logo" class="logo">
      </a>
    </div>
    <nav class="center nav-links" id="primary-nav" aria-label="Primary navigation">
      ${navLinksMarkup}
    </nav>
    <div class="right nav-actions">
      <div class="nav-translate" aria-label="Language selection">
        <div id="google_translate_element"></div>
      </div>
      <div class="theme-toggle" role="button" tabindex="0" aria-label="Toggle site theme">
        <label class="theme-switch">
          <input type="checkbox" id="theme-checkbox">
          <span class="slider"></span>
        </label>
      </div>
    </div>
  `;
};

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
      toggleWrapper.setAttribute('role', 'button');
      toggleWrapper.setAttribute('tabindex', '0');
      toggleWrapper.setAttribute('aria-label', 'Toggle site theme');
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
  const toggleWrapper = checkbox.closest('.theme-toggle');

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

  const toggleFromWrapper = () => {
    checkbox.checked = !checkbox.checked;
    applyTheme();
  };

  if (toggleWrapper && !toggleWrapper.dataset.bound) {
    toggleWrapper.addEventListener('click', (event) => {
      if (event.target.closest('.theme-switch')) return;
      toggleFromWrapper();
    });
    toggleWrapper.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleFromWrapper();
      }
    });
    toggleWrapper.dataset.bound = 'true';
  }

  if (localStorage.getItem('theme') === 'dark') {
    checkbox.checked = true;
    document.body.setAttribute('data-theme', 'dark');
  } else {
    checkbox.checked = false;
    document.body.removeAttribute('data-theme');
  }
};

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

// Mobile nav toggle
const initMobileNav = () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const navToggle = navbar.querySelector('.nav-toggle');
  const navLinks = navbar.querySelector('.nav-links');
  if (!navToggle || !navLinks) return;

  const closeNav = () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navbar.classList.remove('nav-open');
  };

  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', (!expanded).toString());
    navbar.classList.toggle('nav-open', !expanded);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= NAV_BREAKPOINT) {
        closeNav();
      }
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > NAV_BREAKPOINT) {
      closeNav();
    }
  });
};

const initTranslatePlacement = () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const navLinks = navbar.querySelector('.nav-links');
  const navActions = navbar.querySelector('.nav-actions');
  const translate = navbar.querySelector('.nav-translate');
  if (!navLinks || !navActions || !translate) return;

  const moveTranslate = () => {
    if (window.innerWidth <= NAV_BREAKPOINT) {
      if (translate.parentElement !== navLinks) {
        navLinks.appendChild(translate);
      }
    } else if (translate.parentElement !== navActions) {
      navActions.insertBefore(translate, navActions.firstChild || null);
    }
  };

  moveTranslate();
  window.addEventListener('resize', moveTranslate);
};

// Fade-in cards
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); }});
},{threshold:0.2});
document.querySelectorAll('.card').forEach(el=>observer.observe(el));

// ---------------------------------------------------------------------------
// Project page fade-in + progress/anchor nav
// ---------------------------------------------------------------------------
const initProjectEffects = () => {
  const projectSections = document.querySelectorAll('.project-page section');
  if (projectSections.length) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    projectSections.forEach(sec => io.observe(sec));
  }

  const progressBars = document.querySelectorAll('.progress-bar');
  const navLinks = document.querySelectorAll('.anchor-nav a');
  if (progressBars.length === 0 && navLinks.length === 0) return;

  const sectionsWithId = document.querySelectorAll('main section[id]');

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
    progressBars.forEach(bar => { bar.style.width = `${scrollPercent}%`; });

    let current = '';
    sectionsWithId.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (scrollTop >= sectionTop) current = section.id;
    });

    if (navLinks.length) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', updateProgress);
  updateProgress();
};

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

// ---------------------------------------------------------------------------
// Google Translate Widget
// ---------------------------------------------------------------------------
const initGoogleTranslate = () => {
  const translateTarget = document.getElementById('google_translate_element');
  if (!translateTarget) return;

  window.googleTranslateElementInit = () => {
    new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
  };

  if (document.querySelector('script[data-google-translate]')) return;

  const gtScript = document.createElement('script');
  gtScript.type = 'text/javascript';
  gtScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  gtScript.dataset.googleTranslate = 'true';
  document.body.appendChild(gtScript);
};

document.addEventListener('DOMContentLoaded', () => {
  buildGlobalNav();
  initThemeToggle();
  initMobileNav();
  initTranslatePlacement();
  initGoogleTranslate();
  initProjectEffects();
});
