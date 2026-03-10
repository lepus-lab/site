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

let starFill = "rgba(255,255,255,0.88)";
let linkStrokeBase = "198,210,255";
let activeThemePreference = readStoredThemePreference();

function refreshStarPalette() {
  const styles = getComputedStyle(root);
  const starRgb = styles.getPropertyValue("--star-rgb").trim();
  const linkRgb = styles.getPropertyValue("--link-rgb").trim();

  if (starRgb) {
    starFill = `rgba(${starRgb},0.88)`;
  }
  if (linkRgb) {
    linkStrokeBase = linkRgb;
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
  const STAR_COUNT = 95;
  const LINK_DISTANCE = 135;

  function createStar() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.14,
      vy: (Math.random() - 0.5) * 0.14,
      r: Math.random() * 1.4 + 0.4
    };
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    stars = Array.from({ length: STAR_COUNT }, createStar);
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    for (const star of stars) {
      star.x += star.vx;
      star.y += star.vy;

      if (star.x < 0 || star.x > width) {
        star.vx *= -1;
      }
      if (star.y < 0 || star.y > height) {
        star.vy *= -1;
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = starFill;
      ctx.fill();
    }

    for (let i = 0; i < stars.length; i += 1) {
      for (let j = i + 1; j < stars.length; j += 1) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < LINK_DISTANCE) {
          const alpha = (1 - dist / LINK_DISTANCE) * 0.16;
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.strokeStyle = `rgba(${linkStrokeBase},${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(step);
  }

  window.addEventListener("resize", resize);
  resize();
  step();
}
