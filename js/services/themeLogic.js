import { $ } from '../utils/helpers.js';
import { toast } from '../utils/helpers.js';

export const THEME_KEY = "ecomatch.theme";

export function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark", isDark);
  const icon = $("#themeIcon");
  if (icon) icon.textContent = isDark ? "☀" : "☾";
  const toggle = $("#themeToggle");
  if (toggle) toggle.title = isDark ? "Switch to light mode" : "Switch to dark mode";
}

export function loadTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    applyTheme(savedTheme);
    return;
  }
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
}

export function toggleTheme() {
  const isDark = document.body.classList.contains("dark");
  const newTheme = isDark ? "light" : "dark";
  localStorage.setItem(THEME_KEY, newTheme);
  applyTheme(newTheme);
  toast(newTheme === "dark" ? "Dark Mode aktif 🌙" : "Light Mode aktif ☀");
}