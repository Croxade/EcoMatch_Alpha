import { $, $$ } from '../utils/helpers.js';
import { state, meta, matches, learn, conversations } from '../models/db.js';
import { renderMarket, renderMatches } from './marketCtrl.js';

function setGreeting() {
  const hour = new Date().getHours();
  let greet = "Good evening";
  if (hour >= 5 && hour < 12) greet = "Good morning";
  else if (hour >= 12 && hour < 18) greet = "Good afternoon";
  
  const titleEl = $("#pageTitle");
  if (titleEl && titleEl.textContent.includes("GreenSaver")) {
    titleEl.textContent = `${greet}, GreenSaver.`;
  }
}

export function updateDashboardStats() {
  const target = 50;
  const percent = Math.min(100, Math.round((state.diverted / target) * 100));
  const remaining = Math.max(0, target - state.diverted);

  if ($("#statDiverted")) $("#statDiverted").textContent = state.diverted.toFixed(1) + " kg";
  if ($("#statValue")) $("#statValue").textContent = "Rp " + state.value.toLocaleString("id-ID");
  if ($("#statCo2")) $("#statCo2").textContent = state.co2.toFixed(1) + " kg";

  if ($("#missionPercent")) $("#missionPercent").textContent = percent + "%";
  if ($("#missionRemaining")) $("#missionRemaining").textContent = remaining.toFixed(1) + " kg";
  if ($("#missionProgressText")) $("#missionProgressText").textContent = `${state.diverted.toFixed(1)} / ${target} kg`;
  if ($("#missionBar")) $("#missionBar").style.width = percent + "%";
  if ($("#missionRing")) $("#missionRing").style.background = `conic-gradient(var(--green) ${percent * 3.6}deg, var(--border) 0deg)`;
}

export function sync() {
  ["sideCoins", "dashCoins", "walletCoins"].forEach((id) => {
    const x = $("#" + id);
    if (x) x.textContent = state.coins.toLocaleString("id-ID");
  });
  updateDashboardStats();
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
  
  if (name === "dashboard") setGreeting();
  
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

export function closeModals() { $$(".modal").forEach((x) => x.classList.remove("open")); }

export function renderDash() {
  sync();
  const matchContainer = $("#dashMatches");
  if (matchContainer) {
    matchContainer.innerHTML = matches.length === 0 
      ? `<p class="muted" style="padding:16px;font-size:13px">Belum ada Smart Match. Yuk, post waste kamu!</p>` 
      : matches.slice(0, 3).map(m => `<div class="match-row"><div class="company-logo">${m[0]}</div><main><b>${m[1]}</b><small>Needs ${m[2]}</small></main></div>`).join("");
  }
  const actContainer = $("#dashActivity");
  if (actContainer) {
    actContainer.innerHTML = state.history.length === 0
      ? `<p class="muted" style="padding:16px;font-size:13px">Belum ada aktivitas.</p>`
      : state.history.slice(0, 4).map(a => `<div class="activity"><span><b>${a[0]}</b></span><strong>${a[1]}</strong></div>`).join("");
  }
}

export function renderOrders() {
  if ($("#ordersRows")) $("#ordersRows").innerHTML = `<p class="muted" style="padding:24px;text-align:center">Belum ada transaksi.</p>`;
}

export function renderConversations() {
  const convList = $("#conversationList");
  const chatHead = $(".chat-head");
  const chatBody = $("#chatBody");
  
  if (!convList) return;
  
  if (conversations.length === 0) {
    convList.innerHTML = `<p class="muted" style="padding:20px;text-align:center;font-size:13px">Belum ada pesan.</p>`;
    if (chatHead) chatHead.innerHTML = `<div>Mulai obrolan dari marketplace.</div>`;
    if (chatBody) chatBody.innerHTML = "";
    return;
  }

  convList.innerHTML = conversations.map((c, i) => `
    <div class="conversation ${i === 0 ? "active" : ""}">
      <div class="company-logo">${c.logo}</div>
      <main><b>${c.seller}</b><small>${c.lastMsg}</small></main><time>${c.time}</time>
    </div>
  `).join("");

  if (chatHead) {
    chatHead.innerHTML = `<div class="avatar">${conversations[0].logo}</div><div><b>${conversations[0].seller}</b><small>● Online</small></div>`;
  }
  
  if (chatBody && chatBody.innerHTML.trim() === "") {
    chatBody.innerHTML = `<div class="date">Today</div><div class="bubble other">Halo! Silakan post pertanyaan tentang material.</div>`;
  }
}

export function renderLearn() {
  if ($("#learnGrid")) {
    $("#learnGrid").innerHTML = learn.map((x, i) => `
      <article class="learn-card"><div class="learn-photo"><img src="${x[1]}" loading="lazy"></div>
      <div class="learn-body"><h3>${x[0]}</h3><div class="learn-foot"><b>${x[3]}</b><button data-learn="${i}">Learn</button></div></div></article>
    `).join("");
  }
}

export function renderChallenge() {
  const a = [["♻", "Divert 5 kg plastic", "0 / 5 kg", 100, "0%"], ["▧", "Complete 2 EcoLearn", "0 / 2 lessons", 60, "0%"], ["＋", "Publish listing", "Not started", 150, "0%"]];
  if ($("#challengeList")) $("#challengeList").innerHTML = a.map(x => `<div class="mission"><div class="mission-icon">${x[0]}</div><main><b>${x[1]}</b></main><strong>+${x[3]} EC</strong></div>`).join("");
  if ($("#leaderboard")) $("#leaderboard").innerHTML = `<div class="leader"><span class="rank">1</span><div class="avatar">GS</div><main><b>GreenSaver (You)</b></main><strong>${state.coins} EC</strong></div>`;
}

export function renderWallet() {
  if ($("#walletActivity")) {
    $("#walletActivity").innerHTML = state.history.length === 0 ? `<p class="muted" style="padding:16px;font-size:13px">Belum ada riwayat.</p>` : state.history.slice(0, 7).map(a => `<div class="activity"><span><b>${a[0]}</b></span><strong>${a[1]}</strong></div>`).join("");
  }
}