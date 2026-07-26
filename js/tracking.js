const DEVICE_ID_KEY = "lets-date:device-id";
const SESSION_KEY = "lets-date:session";

// Filled in once the Telegram relay (Cloudflare Worker) is deployed.
const REPORT_URL = "";

let navigatingForward = false;

function getDeviceId() {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = Math.random().toString(36).slice(2, 8).toUpperCase();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

function readSessionState() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  return raw
    ? JSON.parse(raw)
    : { noAttempts: 0, confirmed: false, date: null, time: null, sent: false };
}

function writeSessionState(state) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
}

function recordNoAttempt() {
  const state = readSessionState();
  state.noAttempts += 1;
  writeSessionState(state);
  return state.noAttempts;
}

function recordConfirmation(date, time) {
  const state = readSessionState();
  state.confirmed = true;
  state.date = date;
  state.time = time;
  writeSessionState(state);
}

function markNavigatingForward() {
  navigatingForward = true;
}

function sendReport(state) {
  if (!REPORT_URL || state.sent) {
    return;
  }

  const payload = JSON.stringify({
    device: getDeviceId(),
    userAgent: navigator.userAgent,
    noAttempts: state.noAttempts,
    confirmed: state.confirmed,
    date: state.date,
    time: state.time,
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(REPORT_URL, new Blob([payload], { type: "application/json" }));
  } else {
    fetch(REPORT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    });
  }

  state.sent = true;
  writeSessionState(state);
}

function reportNow() {
  sendReport(readSessionState());
}

function reportAbandonIfNeeded() {
  if (navigatingForward) {
    return;
  }

  const state = readSessionState();
  if (state.sent || (state.noAttempts === 0 && !state.confirmed)) {
    return;
  }

  sendReport(state);
}

window.addEventListener("pagehide", reportAbandonIfNeeded);
