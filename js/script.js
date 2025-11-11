
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
