import { $, $$, toast } from '../utils/helpers.js';

export const SETTINGS_KEY = "ecomatch.settings.v2";
export const SETTINGS_DEFAULTS = {
  name: "GreenSaver", city: "Jakarta Selatan", material: "Plastik", account: "Individual",
  about: "Interested in reducing household waste and finding responsible buyers.",
  matchNotify: true, showPartners: true, notifMatch: true, notifOrder: true, notifReward: true, notifWeekly: false,
  publicProfile: true, approxLocation: true, leaderboard: true,
  pickupMethod: "EcoMatch Pickup", pickupRadius: "0–10 km", pickupDay: "Weekdays", pickupTime: "09:00–12:00",
  autoPickup: true, pickupConfirm: true
};

function settingValue(id) {
  const x = $("#" + id);
  return x?.type === "checkbox" ? x.checked : (x?.value ?? "");
}

function collectSettings() {
  return {
    name: settingValue("setName"), city: settingValue("setCity"), material: settingValue("setMaterial"), account: settingValue("setAccount"), about: settingValue("setAbout"),
    matchNotify: settingValue("setMatchNotify"), showPartners: settingValue("setShowPartners"),
    notifMatch: settingValue("setNotifMatch"), notifOrder: settingValue("setNotifOrder"), notifReward: settingValue("setNotifReward"), notifWeekly: settingValue("setNotifWeekly"),
    publicProfile: settingValue("setPublicProfile"), approxLocation: settingValue("setApproxLocation"), leaderboard: settingValue("setLeaderboard"),
    pickupMethod: settingValue("setPickupMethod"), pickupRadius: settingValue("setPickupRadius"), pickupDay: settingValue("setPickupDay"), pickupTime: settingValue("setPickupTime"),
    autoPickup: settingValue("setAutoPickup"), pickupConfirm: settingValue("setPickupConfirm")
  };
}

function applySettings(v) {
  const x = { ...SETTINGS_DEFAULTS, ...v };
  const keys = { setName: "name", setCity: "city", setMaterial: "material", setAccount: "account", setAbout: "about", setPickupMethod: "pickupMethod", setPickupRadius: "pickupRadius", setPickupDay: "pickupDay", setPickupTime: "pickupTime" };
  
  Object.keys(keys).forEach(id => {
    const el = $("#" + id);
    if (el) el.value = x[keys[id]];
  });

  const toggleKeys = { setMatchNotify: "matchNotify", setShowPartners: "showPartners", setNotifMatch: "notifMatch", setNotifOrder: "notifOrder", setNotifReward: "notifReward", setNotifWeekly: "notifWeekly", setPublicProfile: "publicProfile", setApproxLocation: "approxLocation", setLeaderboard: "leaderboard", setAutoPickup: "autoPickup", setPickupConfirm: "pickupConfirm" };
  
  Object.keys(toggleKeys).forEach(id => {
    const el = $("#" + id);
    if (el) el.checked = !!x[toggleKeys[id]];
  });

  const name = x.name || "GreenSaver";
  $$(".profile-mini b").forEach((el) => { el.textContent = name; });
  const topUser = $(".user-btn span");
  if (topUser) topUser.textContent = name;

  const save = $("#settingsSaved");
  if (save) { save.textContent = "All changes saved"; save.classList.remove("dirty"); }
}

export function loadSettings() {
  try { applySettings(JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}")); } 
  catch (e) { applySettings(SETTINGS_DEFAULTS); }
}

export function saveSettings() {
  const data = collectSettings();
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
  applySettings(data);
  toast("Settings saved successfully.");
}

export function markSettingsDirty() {
  const x = $("#settingsSaved");
  if (x) { x.textContent = "Unsaved changes"; x.classList.add("dirty"); }
}

export function initSettings() {
  loadSettings();
  $$("[data-settings-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$("[data-settings-tab]").forEach(t => t.classList.toggle("active", t === tab));
      $$("[data-settings-pane]").forEach(p => p.classList.toggle("active", p.dataset.settingsPane === tab.dataset.settingsTab));
    });
  });

  $$("#settings input, #settings select, #settings textarea").forEach((el) => {
    el.addEventListener("input", markSettingsDirty);
    el.addEventListener("change", markSettingsDirty);
  });

  $("#saveSettings").onclick = saveSettings;
  $("#resetSettings").onclick = () => {
    applySettings(SETTINGS_DEFAULTS);
    localStorage.removeItem(SETTINGS_KEY);
    toast("Settings direset ke default.");
  };
}