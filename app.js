import { $, $$, toast } from './js/utils/helpers.js';
import { state, learn } from './js/models/db.js';
import { initSettings } from './js/models/settingsDB.js';
import { loadTheme, toggleTheme } from './js/services/themeLogic.js';
import { addCoins } from './js/services/coinLogic.js';
import { downloadReport } from './js/services/impactCalc.js';
import { page, render, closeModals, renderLearn, renderChallenge, renderOrders, renderConversations, sync } from './js/controllers/uiCtrl.js';
import { renderMarket, openProduct } from './js/controllers/marketCtrl.js';
import { initSellForm, estimate } from './js/controllers/sellCtrl.js';

// GLOBAL EVENT DELEGATION
document.addEventListener("click", (e) => {
  const p = e.target.closest("[data-page]");
  if (p) {
    e.preventDefault();
    page(p.dataset.page);
    if (window.innerWidth <= 768) $("#sidebar").classList.remove("open");
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

// GLOBAL UI LISTENERS
$("#globalSearch").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    state.query = e.target.value.trim().toLowerCase();
    page("market");
    $("#marketSearch").value = e.target.value;
  }
});
$("#globalSearch").addEventListener("input", (e) => {
  if ($("#market").classList.contains("active")) {
    state.query = e.target.value.toLowerCase();
    renderMarket();
  }
});
$("#marketSearch").addEventListener("input", (e) => { state.query = e.target.value.toLowerCase(); renderMarket(); });
$("#marketSort").addEventListener("change", (e) => { state.sort = e.target.value; renderMarket(); });
$("#distanceRange").addEventListener("input", (e) => { $("#distanceVal").textContent = e.target.value + " km"; });
$("#resetFilters").onclick = () => {
  state.filter = "all"; state.query = "";
  $("#marketSearch").value = "";
  $$(".filter").forEach((x) => x.classList.toggle("active", x.dataset.filter === "all"));
  renderMarket();
  toast("Filter direset.");
};

$("#notifBtn").onclick = () => $("#notifModal").classList.add("open");
$("#helpBtn").onclick = () => toast("Support EcoMatch tersedia 08.00–22.00.");
$("#mobileMenu").onclick = () => $("#sidebar").classList.toggle("open");
$("#profileMenu").onclick = () => page("settings");
$("#themeToggle").onclick = toggleTheme;
$("#downloadReport").onclick = downloadReport;

$("#acceptOffer").onclick = () => {
  toast("Offer diterima. Pickup sedang dijadwalkan.");
  $("#acceptOffer").textContent = "Accepted ✓";
  $("#acceptOffer").disabled = true;
};

$("#chatForm").onsubmit = (e) => {
  e.preventDefault();
  const v = $("#chatMessage").value.trim();
  if (!v) return;
  $("#chatBody").insertAdjacentHTML("beforeend", `<div class="bubble me">${v}</div>`);
  $("#chatMessage").value = "";
  $("#chatBody").scrollTop = $("#chatBody").scrollHeight;

  setTimeout(() => {
    $("#chatBody").insertAdjacentHTML("beforeend", `
      <div class="bubble other">Got it. Aku cek dulu availability dan update kamu ya.</div>
    `);
    $("#chatBody").scrollTop = $("#chatBody").scrollHeight;
  }, 700);
};

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

// INITIALIZE APP
loadTheme();
initSettings();
initSellForm();

render("dashboard");
renderLearn();
renderChallenge();
renderOrders();
renderConversations();

sync();
estimate();