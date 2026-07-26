const confettiCanvas = document.getElementById("confetti-canvas");
const confettiCtx = confettiCanvas.getContext("2d");

const CONFETTI_COLORS = ["#ff5c8a", "#ffd166", "#06d6a0", "#118ab2", "#ef476f"];
const PARTICLE_COUNT = 160;
const DURATION_MS = 4000;
const GRAVITY = 0.12;

let particles = [];
let animationStart = null;
let animationFrameId = null;

function resizeConfettiCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

function createParticle() {
  return {
    x: Math.random() * confettiCanvas.width,
    y: -20 - Math.random() * confettiCanvas.height * 0.3,
    size: 6 + Math.random() * 6,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    velocityX: (Math.random() - 0.5) * 4,
    velocityY: 2 + Math.random() * 3,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 10,
  };
}

function drawParticle(particle) {
  confettiCtx.save();
  confettiCtx.translate(particle.x, particle.y);
  confettiCtx.rotate((particle.rotation * Math.PI) / 180);
  confettiCtx.fillStyle = particle.color;
  confettiCtx.fillRect(-particle.size / 2, -particle.size / 4, particle.size, particle.size / 2);
  confettiCtx.restore();
}

function updateParticle(particle) {
  particle.x += particle.velocityX;
  particle.y += particle.velocityY;
  particle.velocityY += GRAVITY;
  particle.rotation += particle.rotationSpeed;
}

function animateConfetti(timestamp) {
  if (animationStart === null) {
    animationStart = timestamp;
  }

  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  particles.forEach((particle) => {
    updateParticle(particle);
    drawParticle(particle);
  });

  const elapsed = timestamp - animationStart;
  if (elapsed < DURATION_MS) {
    animationFrameId = requestAnimationFrame(animateConfetti);
  } else {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    particles = [];
    animationFrameId = null;
    animationStart = null;
  }
}

function startConfetti() {
  resizeConfettiCanvas();
  particles = Array.from({ length: PARTICLE_COUNT }, createParticle);

  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
  animationStart = null;
  animationFrameId = requestAnimationFrame(animateConfetti);
}

window.addEventListener("resize", resizeConfettiCanvas);
