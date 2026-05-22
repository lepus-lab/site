// migrate old key from main.js era
try {
  const old = localStorage.getItem("lepuslab-theme");
  if (old && !localStorage.getItem("theme-preference")) {
    localStorage.setItem("theme-preference", old);
    localStorage.removeItem("lepuslab-theme");
  }
} catch (_) {}

const root = document.documentElement;
const themeToggle = document.querySelector("[data-theme-toggle]");
const THEME_PREFERENCE_KEY = "theme-preference";
const THEME_MODES = ["system", "light", "dark"];
const mediaQuery = typeof window.matchMedia === "function"
  ? window.matchMedia("(prefers-color-scheme: light)")
  : null;

function readStoredThemePreference() {
  try {
    const value = localStorage.getItem(THEME_PREFERENCE_KEY);
    return THEME_MODES.includes(value) ? value : "system";
  } catch (_) {
    return "system";
  }
}

function saveThemePreference(themePreference) {
  try {
    localStorage.setItem(THEME_PREFERENCE_KEY, themePreference);
  } catch (_) {
    // Ignore storage write failures in restricted environments.
  }
}

function nextThemePreference(themePreference) {
  const index = THEME_MODES.indexOf(themePreference);
  return THEME_MODES[(index + 1) % THEME_MODES.length];
}

function resolveTheme(themePreference) {
  if (themePreference === "light" || themePreference === "dark") {
    return themePreference;
  }
  return mediaQuery && mediaQuery.matches ? "light" : "dark";
}

function normalizePreference(themePreference) {
  return themePreference.charAt(0).toUpperCase() + themePreference.slice(1);
}

let starRgb = "194,200,212";
let glowRgb = "198,210,255";
let starAlpha = 0.42;
let glowAlpha = 0.055;
let activeThemePreference = readStoredThemePreference();

function refreshStarPalette() {
  const styles = getComputedStyle(root);
  const nextStarRgb = styles.getPropertyValue("--star-rgb").trim();
  const nextGlowRgb = styles.getPropertyValue("--link-rgb").trim();
  const nextStarAlpha = Number.parseFloat(styles.getPropertyValue("--star-alpha").trim());
  const nextGlowAlpha = Number.parseFloat(styles.getPropertyValue("--starfield-glow-alpha").trim());

  if (nextStarRgb) {
    starRgb = nextStarRgb;
  }
  if (nextGlowRgb) {
    glowRgb = nextGlowRgb;
  }
  if (Number.isFinite(nextStarAlpha)) {
    starAlpha = nextStarAlpha;
  }
  if (Number.isFinite(nextGlowAlpha)) {
    glowAlpha = nextGlowAlpha;
  }
}

function updateThemeToggle(themePreference) {
  if (!themeToggle) {
    return;
  }

  const nextPreference = nextThemePreference(themePreference);
  const currentLabel = normalizePreference(themePreference);
  const label = `Theme: ${currentLabel}`;
  const nextLabel = normalizePreference(nextPreference);

  const labelNode = themeToggle.querySelector(".theme-toggle-label");
  if (labelNode) {
    labelNode.textContent = label;
  }

  themeToggle.setAttribute("aria-label", `Theme preference ${currentLabel}. Click to switch to ${nextLabel}.`);
  themeToggle.setAttribute("title", `Theme preference: ${currentLabel}. Click to switch to ${nextLabel}.`);
  themeToggle.setAttribute("aria-pressed", themePreference === "system" ? "false" : "true");
}

function applyThemePreference(themePreference) {
  activeThemePreference = themePreference;
  const resolvedTheme = resolveTheme(themePreference);
  root.setAttribute("data-theme", resolvedTheme);
  root.setAttribute("data-theme-preference", themePreference);
  updateThemeToggle(themePreference);
  refreshStarPalette();
}

applyThemePreference(activeThemePreference);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextPreference = nextThemePreference(activeThemePreference);
    saveThemePreference(nextPreference);
    applyThemePreference(nextPreference);
  });
}

const syncSystemTheme = (event) => {
  if (activeThemePreference === "system") {
    root.setAttribute("data-theme", event.matches ? "light" : "dark");
    refreshStarPalette();
    updateThemeToggle(activeThemePreference);
  }
};

if (mediaQuery && typeof mediaQuery.addEventListener === "function") {
  mediaQuery.addEventListener("change", syncSystemTheme);
} else if (mediaQuery && typeof mediaQuery.addListener === "function") {
  mediaQuery.addListener(syncSystemTheme);
}

const canvas = document.getElementById("starfield");
const ctx = canvas ? canvas.getContext("2d") : null;

if (canvas && ctx) {
  let width = 0;
  let height = 0;
  let stars = [];

  function createStar() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.35 + 0.2,
      vx: (Math.random() - 0.5) * 0.05,
      vy: Math.random() * 0.08 + 0.01,
      a: Math.random() * 0.32 + 0.12,
      tw: Math.random() * Math.PI * 2,
      tws: Math.random() * 0.03 + 0.008
    };
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const starCount = Math.max(64, Math.floor(width / 20));
    stars = Array.from({ length: starCount }, createStar);
  }

  function step(now = 0) {
    ctx.clearRect(0, 0, width, height);

    const glow = ctx.createRadialGradient(
      width * 0.5,
      height * 0.35,
      0,
      width * 0.5,
      height * 0.35,
      Math.max(width, height) * 0.8
    );
    glow.addColorStop(0, `rgba(${glowRgb},${glowAlpha})`);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    for (const star of stars) {
      star.x += star.vx;
      star.y += star.vy;
      star.tw += star.tws;

      if (star.x < -2) {
        star.x = width + 2;
      }
      if (star.x > width + 2) {
        star.x = -2;
      }
      if (star.y > height + 2) {
        star.x = Math.random() * width;
        star.y = -2;
      }

      const alpha = star.a + Math.sin(star.tw + now * 0.0002) * 0.1;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${starRgb},${Math.max(0.05, Math.min(starAlpha, alpha))})`;
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  window.addEventListener("resize", resize);
  resize();
  step();
}
