const STORAGE_KEY = "lets-date:selection";
const DATE_DISPLAY_OPTIONS = { weekday: "long", day: "numeric", month: "long" };

function formatSummary({ date, time }) {
  const parsedDate = new Date(`${date}T00:00:00`);
  const dateLabel = parsedDate.toLocaleDateString("ru-RU", DATE_DISPLAY_OPTIONS);
  return `${dateLabel} в ${time}`;
}

const raw = sessionStorage.getItem(STORAGE_KEY);
const selection = raw ? JSON.parse(raw) : null;

if (selection && selection.date && selection.time) {
  document.getElementById("summary").textContent = formatSummary(selection);
}

startConfetti();
