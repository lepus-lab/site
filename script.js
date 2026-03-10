const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

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

    if (star.x < 0 || star.x > width) star.vx *= -1;
    if (star.y < 0 || star.y > height) star.vy *= -1;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.88)";
    ctx.fill();
  }

  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < LINK_DISTANCE) {
        const alpha = (1 - dist / LINK_DISTANCE) * 0.16;
        ctx.beginPath();
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(stars[j].x, stars[j].y);
        ctx.strokeStyle = `rgba(198,210,255,${alpha})`;
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
