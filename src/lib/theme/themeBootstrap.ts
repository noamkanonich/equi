export const APPEARANCE_STORAGE_KEY = "equi-appearance-settings";

export const getThemeBootstrapScript = () => `
(function () {
  try {
    var raw = localStorage.getItem("${APPEARANCE_STORAGE_KEY}");
    if (!raw) return;
    var parsed = JSON.parse(raw);
    var theme = parsed && parsed.state && parsed.state.appearanceSettings && parsed.state.appearanceSettings.theme;
    var mode = theme === "dark" ? "dark" : theme === "light" ? "light" : null;
    if (theme === "system" || !mode) {
      mode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.style.colorScheme = mode;
    document.documentElement.dataset.theme = mode;
  } catch (e) {}
})();
`.trim();
