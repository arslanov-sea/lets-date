const noBtn = document.getElementById("btn-no");
const dodgeContainer = document.querySelector("#screen-ask .button-row");
const yesBtn = document.getElementById("btn-yes");

const dodgePhrases = ["Нет", "Точно?", "Серьёзно?", "Не сюда!", "А если да?", "Почти поймал(а)"];
const DODGE_RADIUS = 90;
const RETRIGGER_DELAY_MS = 250;

let lastEffectIndex = -1;
let isDodging = false;

function setNoButtonPosition(left, top) {
  noBtn.style.left = `${left}px`;
  noBtn.style.top = `${top}px`;
}

function initNoButtonPosition() {
  const containerRect = dodgeContainer.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();
  noBtn.style.position = "absolute";
  noBtn.style.margin = "0";
  setNoButtonPosition(btnRect.left - containerRect.left, btnRect.top - containerRect.top);
}

function pickRandomPosition() {
  const containerRect = dodgeContainer.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();

  const maxLeft = Math.max(containerRect.width - btnRect.width, 0);
  const maxTop = Math.max(containerRect.height - btnRect.height, 0);
  const yesLeftRel = yesRect.left - containerRect.left;
  const yesTopRel = yesRect.top - containerRect.top;

  let left = 0;
  let top = 0;
  let attempts = 0;
  const minDistanceX = btnRect.width * 1.2;
  const minDistanceY = btnRect.height * 1.2;

  do {
    left = Math.random() * maxLeft;
    top = Math.random() * maxTop;
    attempts += 1;
  } while (
    attempts < 12 &&
    Math.abs(left - yesLeftRel) < minDistanceX &&
    Math.abs(top - yesTopRel) < minDistanceY
  );

  return { left, top };
}

function dodgeTeleport() {
  const { left, top } = pickRandomPosition();
  setNoButtonPosition(left, top);
}

function dodgeShrinkGrow() {
  noBtn.style.transform = "scale(0.7)";
  dodgeTeleport();
  setTimeout(() => {
    noBtn.style.transform = "scale(1)";
  }, 200);
}

function dodgeWiggle() {
  noBtn.classList.add("wiggle");
  dodgeTeleport();
  setTimeout(() => {
    noBtn.classList.remove("wiggle");
  }, 300);
}

function dodgeTextSwap() {
  const original = noBtn.textContent;
  const phrase = dodgePhrases[Math.floor(Math.random() * dodgePhrases.length)];
  noBtn.textContent = phrase;
  dodgeTeleport();
  setTimeout(() => {
    noBtn.textContent = original;
  }, 900);
}

const dodgeEffects = [dodgeTeleport, dodgeShrinkGrow, dodgeWiggle, dodgeTextSwap];

function triggerDodge() {
  let index = Math.floor(Math.random() * dodgeEffects.length);
  if (index === lastEffectIndex) {
    index = (index + 1) % dodgeEffects.length;
  }
  lastEffectIndex = index;
  dodgeEffects[index]();
}

function handlePointerMove(event) {
  const rect = noBtn.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);

  if (distance < DODGE_RADIUS && !isDodging) {
    isDodging = true;
    triggerDodge();
    setTimeout(() => {
      isDodging = false;
    }, RETRIGGER_DELAY_MS);
  }
}

function handleTouchStart(event) {
  event.preventDefault();
  triggerDodge();
}

initNoButtonPosition();
window.addEventListener("resize", initNoButtonPosition);
dodgeContainer.addEventListener("pointermove", handlePointerMove);
noBtn.addEventListener("touchstart", handleTouchStart, { passive: false });
