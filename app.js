import { $, $$, toast } from './js/utils/helpers.js';
import { state, learn } from './js/models/db.js';
import { initSettings } from './js/models/settingsDB.js';
import { loadTheme, toggleTheme } from './js/services/themeLogic.js';
import { addCoins } from './js/services/coinLogic.js';
import { downloadReport } from './js/services/impactCalc.js';
import { page, render, closeModals, renderLearn, renderChallenge, renderOrders, renderConversations, sync, updateDashboardStats } from './js/controllers/uiCtrl.js';
import { renderMarket, openProduct } from './js/controllers/marketCtrl.js';
import { initSellForm, estimate } from './js/controllers/sellCtrl.js';

// FUNGSI PENGAMAN: Cek elemen dulu sebelum dipasang event (Anti-Crash)
const safeListen = (id, event, callback) => {
  const el = $(id);
  if (el) el.addEventListener(event, callback);
};

// DELEGASI EVENT UMUM (Anti-Crash)
document.addEventListener("click", (e) => {
  const p = e.target.closest("[data-page]");
  if (p) {
    e.preventDefault();
    page(p.dataset.page);
    const sidebar = $("#sidebar");
    if (window.innerWidth <= 768 && sidebar) sidebar.classList.remove("open");
    return;
  }

  const prod = e.target.closest("[data-product]");
  if (prod) { openProduct(prod.dataset.product); return; }

  if (e.target.closest("[data-close]")) { closeModals(); return; }

  const f = e.target.closest("[data-filter]");
  if (f) {
    state.filter = f.dataset.filter;
    $$(".filter").forEach((x) => x.classList.toggle("active", x === f));
    renderMarket();
    return;
  }

  const save = e.target.closest("[data-save]");
  if (save) { save.textContent = "♥"; toast("Listing disimpan."); return; }

  const learnBtn = e.target.closest("[data-learn]");
  if (learnBtn) {
    const x = learn[Number(learnBtn.dataset.learn)];
    addCoins(Number(x[3].replace(/\D/g, "")), "EcoLearn · " + x[0]);
    learnBtn.textContent = "Completed ✓";
    learnBtn.disabled = true;
    return;
  }

  const contact = e.target.closest("[data-contact]");
  if (contact) {
    page("messages");
    toast("Chat dibuka dengan " + contact.dataset.contact);
    return;
  }
});

// LISTENER KHUSUS (Dibungkus pakai safeListen)
safeListen("#globalSearch", "keydown", (e) => {
  if (e.key === "Enter") {
    state.query = e.target.value.trim().toLowerCase();
    page("market");
    if ($("#marketSearch")) $("#marketSearch").value = e.target.value;
  }
});

safeListen("#globalSearch", "input", (e) => {
  if ($("#market")?.classList.contains("active")) {
    state.query = e.target.value.toLowerCase();
    renderMarket();
  }
});

safeListen("#marketSearch", "input", (e) => { state.query = e.target.value.toLowerCase(); renderMarket(); });
safeListen("#marketSort", "change", (e) => { state.sort = e.target.value; renderMarket(); });
safeListen("#distanceRange", "input", (e) => { if ($("#distanceVal")) $("#distanceVal").textContent = e.target.value + " km"; });

safeListen("#resetFilters", "click", () => {
  state.filter = "all"; state.query = "";
  if ($("#marketSearch")) $("#marketSearch").value = "";
  $$(".filter").forEach((x) => x.classList.toggle("active", x.dataset.filter === "all"));
  renderMarket();
  toast("Filter direset.");
});

safeListen("#notifBtn", "click", () => $("#notifModal")?.classList.add("open"));
safeListen("#helpBtn", "click", () => toast("Support EcoMatch tersedia 08.00–22.00."));
safeListen("#mobileMenu", "click", () => $("#sidebar")?.classList.toggle("open"));
safeListen("#profileMenu", "click", () => page("settings"));
safeListen("#themeToggle", "click", toggleTheme);
safeListen("#downloadReport", "click", downloadReport);

safeListen("#acceptOffer", "click", () => {
  toast("Offer diterima. Pickup sedang dijadwalkan.");
  const btn = $("#acceptOffer");
  if (btn) { btn.textContent = "Accepted ✓"; btn.disabled = true; }
});

safeListen("#chatForm", "submit", (e) => {
  e.preventDefault();
  const msgEl = $("#chatMessage");
  const v = msgEl ? msgEl.value.trim() : "";
  if (!v) return;
  const body = $("#chatBody");
  if (body) {
    body.insertAdjacentHTML("beforeend", `<div class="bubble me">${v}</div>`);
    body.scrollTop = body.scrollHeight;
  }
  if (msgEl) msgEl.value = "";

  setTimeout(() => {
    if (body) {
      body.insertAdjacentHTML("beforeend", `<div class="bubble other">Got it. Aku cek dulu availability dan update kamu ya.</div>`);
      body.scrollTop = body.scrollHeight;
    }
  }, 700);
});

$$("[data-redeem]").forEach((b) => {
  b.addEventListener("click", () => {
    const n = Number(b.dataset.redeem);
    if (state.coins < n) { toast("EcoCoin belum cukup."); return; }
    state.coins -= n;
    state.history.unshift(["Redeemed EcoCoin", "-" + n + " EC", "Just now"]);
    sync();
    render("wallet");
    toast("Redemption berhasil diproses.");
  });
});

// INISIASI APP UTAMA
try {
  loadTheme();
  initSettings();
  initSellForm(); // Sekarang form pasti nyala!
  
  render("dashboard");
  renderLearn();
  renderChallenge();
  renderOrders();
  renderConversations();

  sync();
  if (typeof updateDashboardStats === "function") updateDashboardStats();
  estimate();
} catch (err) {
  console.error("Gagal inisiasi App:", err);
}