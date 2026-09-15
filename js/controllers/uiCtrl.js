import { $, $$ } from '../utils/helpers.js';
import { state, meta, matches, learn } from '../models/db.js';
import { renderMarket, renderMatches } from './marketCtrl.js';

export function sync() {
  ["sideCoins", "dashCoins", "walletCoins"].forEach((id) => {
    const x = $("#" + id);
    if (x) x.textContent = state.coins.toLocaleString("id-ID");
  });

  // Sinkronisasi statistik dasbor dari state 0
  const statDiv = $("#statDiverted");
  if (statDiv) statDiv.textContent = state.diverted.toFixed(1) + " kg";

  const statVal = $("#statValue");
  if (statVal) statVal.textContent = "Rp " + state.value.toLocaleString("id-ID");

  const statCo2 = $("#statCo2");
  if (statCo2) statCo2.textContent = state.co2.toFixed(1) + " kg";
}

export function page(name) {
  $$(".page").forEach((x) => x.classList.remove("active"));
  $("#" + name).classList.add("active");
  $$(".nav").forEach((x) => x.classList.toggle("active", x.dataset.page === name));

  if (meta[name]) {
    $("#crumb").textContent = meta[name][0];
    $("#pageTitle").textContent = meta[name][1];
    $("#pageDesc").textContent = meta[name][2];
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
  render(name);
}

export function render(name) {
  if (name === "dashboard") renderDash();
  if (name === "market") renderMarket();
  if (name === "matches") renderMatches();
  if (name === "orders") renderOrders();
  if (name === "messages") renderConversations();
  if (name === "learn") renderLearn();
  if (name === "challenge") renderChallenge();
  if (name === "wallet") renderWallet();
}

export function closeModals() {
  $$(".modal").forEach((x) => x.classList.remove("open"));
}

export function renderDash() {
  sync();
  const matchContainer = $("#dashMatches");
  if (matchContainer) {
    matchContainer.innerHTML = matches.length === 0 
      ? `<p class="muted" style="padding:16px;font-size:13px">Belum ada Smart Match. Yuk, post waste kamu di menu Jual!</p>` 
      : matches.slice(0, 3).map(m => `
        <div class="match-row">
          <div class="company-logo">${m[0]}</div>
          <main><b>${m[1]}</b><small>Needs ${m[2]} · ${m[3]}</small></main>
          <div class="match-score-mini"><b>${m[5]}</b><small>${m[6]}</small></div>
        </div>
      `).join("");
  }

  const actContainer = $("#dashActivity");
  if (actContainer) {
    actContainer.innerHTML = state.history.length === 0
      ? `<p class="muted" style="padding:16px;font-size:13px">Belum ada aktivitas. Mulai jelajahi EcoLearn atau post waste.</p>`
      : state.history.slice(0, 4).map(a => `
        <div class="activity">
          <span><b>${a[0]}</b><small>${a[2]}</small></span>
          <strong>${a[1]}</strong>
        </div>
      `).join("");
  }
}

export function renderOrders() {
  const rows = []; // Kosong dari 0
  const ordersRows = $("#ordersRows");
  if (ordersRows) {
    ordersRows.innerHTML = rows.length === 0 
      ? `<p class="muted" style="padding:24px;text-align:center">Belum ada transaksi atau pickup.</p>` 
      : "";
  }
}

export function renderConversations() {
  const conversations = []; // Kosong dari 0
  const convList = $("#conversationList");
  if (convList) {
    convList.innerHTML = conversations.length === 0
      ? `<p class="muted" style="padding:20px;text-align:center;font-size:13px">Belum ada pesan aktif.</p>`
      : "";
  }
}

export function renderLearn() {
  $("#learnGrid").innerHTML = learn.map((x, i) => `
    <article class="learn-card">
      <div class="learn-photo">
        <img src="${x[1]}" alt="" loading="lazy">
        <span>${i % 2 ? "VIDEO" : "ARTICLE"}</span>
      </div>
      <div class="learn-body">
        <h3>${x[0]}</h3>
        <p>Pelajari konsep penting circular economy dalam waktu singkat.</p>
        <div class="learn-foot">
          <b>${x[3]} · ${x[2]}</b>
          <button data-learn="${i}">Learn + earn</button>
        </div>
      </div>
    </article>
  `).join("");
}

export function renderChallenge() {
  const a = [
    ["♻", "Divert 5 kg plastic", "0 / 5 kg", 100, "0%"],
    ["▧", "Complete 2 EcoLearn", "0 / 2 lessons", 60, "0%"],
    ["＋", "Publish one listing", "Not started", 150, "0%"]
  ];

  $("#challengeList").innerHTML = a.map(x => `
    <div class="mission">
      <div class="mission-icon">${x[0]}</div>
      <main><b>${x[1]}</b><small>${x[2]}</small><div class="progress"><i style="width:${x[4]}"></i></div></main>
      <strong>+${x[3]} EC</strong>
    </div>
  `).join("");

  const leaders = [
    ["1", "GS", "GreenSaver (You)", "0 EC"]
  ];

  $("#leaderboard").innerHTML = leaders.map(x => `
    <div class="leader">
      <span class="rank">${x[0]}</span><div class="avatar">${x[1]}</div>
      <main><b>${x[2]}</b><small>Eco Warrior</small></main><strong>${x[3]}</strong>
    </div>
  `).join("");
}

export function renderWallet() {
  const walletAct = $("#walletActivity");
  if (walletAct) {
    walletAct.innerHTML = state.history.length === 0
      ? `<p class="muted" style="padding:16px;font-size:13px">Belum ada riwayat EcoCoin.</p>`
      : state.history.slice(0, 7).map(a => `
        <div class="activity">
          <span><b>${a[0]}</b><small>${a[2]}</small></span>
          <strong>${a[1]}</strong>
        </div>
      `).join("");
  }
}