const screens = document.querySelectorAll(".screen");

function showScreen(name) {
  screens.forEach((screen) => {
    screen.hidden = screen.dataset.screen !== name;
  });
}

document.getElementById("btn-yes").addEventListener("click", () => {
  showScreen("details");
});
