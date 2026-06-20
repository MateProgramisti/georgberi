  // ---------- language toggle ----------
  const LANG_KEY_DEFAULT = 'ka';
  let currentLang = LANG_KEY_DEFAULT;

  function applyLanguage(lang){
    currentLang = lang;
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'ka');

    // plain text swaps
    document.querySelectorAll('[data-ka][data-en]').forEach(el => {
      const value = el.getAttribute(`data-${lang}`);
      if (value !== null) el.textContent = value;
    });

    // inner-HTML swaps (for nodes containing <br>, <em>, etc.)
    document.querySelectorAll('[data-ka-html][data-en-html]').forEach(el => {
      const value = el.getAttribute(`data-${lang}-html`);
      if (value !== null) el.innerHTML = value;
    });

    // placeholder swaps
    document.querySelectorAll('[data-ka-placeholder][data-en-placeholder]').forEach(el => {
      const value = el.getAttribute(`data-${lang}-placeholder`);
      if (value !== null) el.setAttribute('placeholder', value);
    });

    // aria-label swaps
    document.querySelectorAll('[data-ka-aria][data-en-aria]').forEach(el => {
      const value = el.getAttribute(`data-${lang}-aria`);
      if (value !== null) el.setAttribute('aria-label', value);
    });

    // title tag (textContent works fine for <title>)
    const titleEl = document.getElementById('pageTitle');
    if (titleEl){
      const value = titleEl.getAttribute(`data-${lang}`);
      if (value !== null) document.title = value;
    }

    // meta description
    const descEl = document.getElementById('pageDescription');
    if (descEl){
      const value = descEl.getAttribute(`data-${lang}`);
      if (value !== null) descEl.setAttribute('content', value);
    }
  }

  const langToggle = document.getElementById('langToggle');
  if (langToggle){
    langToggle.addEventListener('click', () => {
      applyLanguage(currentLang === 'ka' ? 'en' : 'ka');
    });
  }

  // header scroll state
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  });

  // mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');
  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
    });
  });

  // scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  // subtle mouse-driven nudge on the hero swing (breeze effect), respects reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pendulum = document.getElementById('pendulum');
  if (pendulum && !prefersReduced && window.matchMedia('(hover: hover)').matches){
    pendulum.style.animationPlayState = 'paused';
    let target = 0;
    let current = 0;
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5; // -0.5 to 0.5
      target = x * 16; // degrees
    });
    function tick(){
      current += (target - current) * 0.04;
      pendulum.style.transform = `rotate(${current}deg)`;
      requestAnimationFrame(tick);
    }
    tick();
  }

  // contact form (no backend — just a friendly confirmation)
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msgKey = `data-${currentLang}-msg`;
    status.textContent = status.getAttribute(msgKey) || status.getAttribute('data-ka-msg');
    status.classList.add('ok');
    form.reset();
  });
