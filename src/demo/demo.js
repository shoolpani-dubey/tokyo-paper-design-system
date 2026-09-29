// Theme switcher for the component reference pages. The components need no JavaScript.
const themeButtons = document.querySelectorAll("[data-set-theme]");

themeButtons.forEach((button) => {
  if ((document.documentElement.dataset.theme ?? "") === button.dataset.setTheme) {
    themeButtons.forEach((b) => b.setAttribute("aria-pressed", b === button));
  }

  button.addEventListener("click", () => {
    const theme = button.dataset.setTheme;
    if (theme) document.documentElement.dataset.theme = theme;
    else delete document.documentElement.dataset.theme;
    themeButtons.forEach((b) => b.setAttribute("aria-pressed", b === button));
  });
});
