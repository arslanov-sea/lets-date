const screens = document.querySelectorAll(".screen");

function showScreen(name) {
  screens.forEach((screen) => {
    screen.hidden = screen.dataset.screen !== name;
  });
}

const DATE_DISPLAY_OPTIONS = { weekday: "long", day: "numeric", month: "long" };

function formatSummary({ date, time }) {
  const parsedDate = new Date(`${date}T00:00:00`);
  const dateLabel = parsedDate.toLocaleDateString("ru-RU", DATE_DISPLAY_OPTIONS);
  return `${dateLabel} в ${time}`;
}

document.getElementById("btn-yes").addEventListener("click", () => {
  showScreen("details");
});

document.getElementById("btn-confirm").addEventListener("click", () => {
  const details = getSelectedDetails();
  document.getElementById("summary").textContent = formatSummary(details);
  showScreen("celebrate");
  startConfetti();
});
