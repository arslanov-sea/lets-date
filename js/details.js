const DAYS_AHEAD = 7;
const TIME_START_HOUR = 10;
const TIME_END_HOUR = 20;
const TIME_STEP_MINUTES = 30;

const WEEKDAY_LABELS = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
const MONTH_LABELS = [
  "янв", "фев", "мар", "апр", "май", "июн",
  "июл", "авг", "сен", "окт", "ноя", "дек",
];

const dateOptionsContainer = document.getElementById("date-options");
const timeOptionsContainer = document.getElementById("time-options");
const confirmBtn = document.getElementById("btn-confirm");

let selectedDate = null;
let selectedTime = null;

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateLabel(date) {
  const weekday = WEEKDAY_LABELS[date.getDay()];
  const month = MONTH_LABELS[date.getMonth()];
  return `${weekday}, ${date.getDate()} ${month}`;
}

function buildDateOptions() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let offset = 0; offset < DAYS_AHEAD; offset += 1) {
    const date = new Date(today);
    date.setDate(date.getDate() + offset);

    const option = document.createElement("button");
    option.type = "button";
    option.className = "option";
    option.textContent = formatDateLabel(date);
    option.dataset.value = toIsoDate(date);

    option.addEventListener("click", () => selectOption(option, dateOptionsContainer, (value) => {
      selectedDate = value;
    }));

    dateOptionsContainer.appendChild(option);
  }
}

function buildTimeOptions() {
  for (let hour = TIME_START_HOUR; hour <= TIME_END_HOUR; hour += 1) {
    for (let minute = 0; minute < 60; minute += TIME_STEP_MINUTES) {
      if (hour === TIME_END_HOUR && minute > 0) {
        break;
      }

      const label = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      const option = document.createElement("button");
      option.type = "button";
      option.className = "option";
      option.textContent = label;
      option.dataset.value = label;

      option.addEventListener("click", () => selectOption(option, timeOptionsContainer, (value) => {
        selectedTime = value;
      }));

      timeOptionsContainer.appendChild(option);
    }
  }
}

function selectOption(option, container, assign) {
  container.querySelectorAll(".option").forEach((el) => el.classList.remove("selected"));
  option.classList.add("selected");
  assign(option.dataset.value);
  updateConfirmState();
}

function updateConfirmState() {
  confirmBtn.disabled = !(selectedDate && selectedTime);
}

const STORAGE_KEY = "lets-date:selection";

confirmBtn.addEventListener("click", () => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ date: selectedDate, time: selectedTime }));
  window.location.href = "celebrate.html";
});

buildDateOptions();
buildTimeOptions();
