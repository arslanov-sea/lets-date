const noBtn = document.getElementById("btn-no");
const dodgeContainer = document.querySelector(".button-row");
const yesBtn = document.getElementById("btn-yes");

const DODGE_RADIUS = 90;
const RETRIGGER_DELAY_MS = 250;
const CORNER_MARGIN = 12;
const CORNER_JITTER = 16;
const BUTTON_GAP = 16;

let isDodging = false;

function setNoButtonPosition(left, top) {
  noBtn.style.left = `${left}px`;
  noBtn.style.top = `${top}px`;
}

function initButtonPositions() {
  const containerRect = dodgeContainer.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();
  const noRect = noBtn.getBoundingClientRect();

  const pairWidth = yesRect.width + BUTTON_GAP + noRect.width;
  const pairLeft = (containerRect.width - pairWidth) / 2;
  const centerTop = (containerRect.height - yesRect.height) / 2;

  yesBtn.style.left = `${pairLeft}px`;
  yesBtn.style.top = `${centerTop}px`;

  setNoButtonPosition(
    pairLeft + yesRect.width + BUTTON_GAP,
    (containerRect.height - noRect.height) / 2
  );
}

// The button-row is tall enough that a corner-anchored position always sits
// well above or below the vertically-centered "yes" button, so no explicit
// overlap check against it is needed.
function pickRandomPosition() {
  const containerRect = dodgeContainer.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const maxLeft = containerRect.width - btnRect.width;
  const maxTop = containerRect.height - btnRect.height;

  const corners = [
    { left: CORNER_MARGIN, top: CORNER_MARGIN },
    { left: maxLeft - CORNER_MARGIN, top: CORNER_MARGIN },
    { left: CORNER_MARGIN, top: maxTop - CORNER_MARGIN },
    { left: maxLeft - CORNER_MARGIN, top: maxTop - CORNER_MARGIN },
  ];

  const corner = corners[Math.floor(Math.random() * corners.length)];
  const jitterX = (Math.random() - 0.5) * CORNER_JITTER;
  const jitterY = (Math.random() - 0.5) * CORNER_JITTER;

  return {
    left: Math.min(Math.max(corner.left + jitterX, 0), maxLeft),
    top: Math.min(Math.max(corner.top + jitterY, 0), maxTop),
  };
}

function triggerDodge() {
  recordNoAttempt();
  const { left, top } = pickRandomPosition();
  setNoButtonPosition(left, top);
}

function handlePointerMove(event) {
  if (event.pointerType === "touch") {
    return;
  }

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

initButtonPositions();
window.addEventListener("resize", initButtonPositions);
dodgeContainer.addEventListener("pointermove", handlePointerMove);
noBtn.addEventListener("touchstart", handleTouchStart, { passive: false });
