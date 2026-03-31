(() => {
  const root = document.documentElement;
  const toggleBtn = document.querySelector('[data-theme-toggle]');
  const toggleLabel = document.querySelector('.theme-toggle-label');
  const themeKey = 'lepuslab-theme';

  const getPreferredTheme = () => {
    const saved = localStorage.getItem(themeKey);
    if (saved === 'dark' || saved === 'light' || saved === 'system') return saved;
    return 'system';
  };

  const applyTheme = (mode) => {
    const resolved = mode === 'system'
      ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
      : mode;
    root.setAttribute('data-theme', resolved);
    if (toggleLabel) {
      const labelMap = { system: 'Theme: System', dark: 'Theme: Dark', light: 'Theme: Light' };
      toggleLabel.textContent = labelMap[mode] || 'Theme: System';
    }
  };

  let currentMode = getPreferredTheme();
  applyTheme(currentMode);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const order = ['system', 'dark', 'light'];
      currentMode = order[(order.indexOf(currentMode) + 1) % order.length];
      localStorage.setItem(themeKey, currentMode);
      applyTheme(currentMode);
      initStarfield();
    });
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', () => {
      if (currentMode === 'system') {
        applyTheme('system');
        initStarfield();
      }
    });
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(() => {
      if (currentMode === 'system') {
        applyTheme('system');
        initStarfield();
      }
    });
  }

  let animationId = null;
  let stars = [];
  const canvas = document.getElementById('starfield');
  const ctx = canvas ? canvas.getContext('2d') : null;

  function palette() {
    const lightMode = root.getAttribute('data-theme') === 'light';
    return {
      fill: lightMode ? 'rgba(20, 28, 70, 0.55)' : 'rgba(200, 210, 255, 0.75)',
      dim:  lightMode ? 'rgba(48, 64, 168, 0.18)' : 'rgba(255, 255, 255, 0.08)'
    };
  }

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = Math.floor(window.innerWidth  * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width  = window.innerWidth  + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createStars() {
    if (!canvas) return;
    const count = Math.max(90, Math.floor(window.innerWidth / 10));
    stars = Array.from({ length: count }, () => ({
      x:   Math.random() * window.innerWidth,
      y:   Math.random() * window.innerHeight,
      r:   Math.random() * 1.35 + 0.2,
      vx:  (Math.random() - 0.5) * 0.05,
      vy:  Math.random() * 0.08 + 0.01,
      a:   Math.random() * 0.45 + 0.2,
      tw:  Math.random() * Math.PI * 2,
      tws: Math.random() * 0.03 + 0.008
    }));
  }

  function draw(now = 0) {
    if (!canvas || !ctx) return;
    const colors = palette();
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const gradient = ctx.createRadialGradient(
      window.innerWidth * 0.5, window.innerHeight * 0.35, 0,
      window.innerWidth * 0.5, window.innerHeight * 0.35,
      Math.max(window.innerWidth, window.innerHeight) * 0.8
    );
    gradient.addColorStop(0, colors.dim);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    for (const s of stars) {
      s.x  += s.vx;
      s.y  += s.vy;
      s.tw += s.tws;

      if (s.x < -2) s.x = window.innerWidth + 2;
      if (s.x > window.innerWidth + 2) s.x = -2;
      if (s.y > window.innerHeight + 2) {
        s.x = Math.random() * window.innerWidth;
        s.y = -2;
      }

      const alpha = s.a + Math.sin(s.tw + now * 0.0002) * 0.14;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = colors.fill.replace(/[\d.]+\)$/, '') + `${Math.max(0.08, Math.min(0.9, alpha))})`;
      ctx.fill();
    }

    animationId = requestAnimationFrame(draw);
  }

  function initStarfield() {
    if (!canvas || !ctx) return;
    if (animationId) cancelAnimationFrame(animationId);
    resizeCanvas();
    createStars();
    draw();
  }

  window.addEventListener('resize', initStarfield, { passive: true });
  initStarfield();
})();
