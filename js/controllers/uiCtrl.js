import { $, $$ } from '../utils/helpers.js';
import { state, meta, matches, learn, conversations, products, activeChatSeller, setActiveChat, orders } from '../models/db.js';
import { renderMarket, renderMatches } from './marketCtrl.js';

function setGreeting() {
  const hour = new Date().getHours();
  let greet = "Good evening";
  if (hour >= 5 && hour < 12) greet = "Good morning";
  else if (hour >= 12 && hour < 18) greet = "Good afternoon";
  const titleEl = $("#pageTitle");
  if (titleEl && titleEl.textContent.includes("GreenSaver")) titleEl.textContent = `${greet}, GreenSaver.`;
}

export function updateDashboardStats() {
  const target = 50;
  const percent = Math.min(100, Math.round((state.diverted / target) * 100));
  const remaining = Math.max(0, target - state.diverted);

  if ($("#heroValue")) $("#heroValue").textContent = "+ Rp " + state.value.toLocaleString("id-ID");
  if ($("#heroDiverted")) $("#heroDiverted").textContent = state.diverted.toFixed(1) + " kg";
  if ($("#statDiverted")) $("#statDiverted").textContent = state.diverted.toFixed(1) + " kg";
  if ($("#statValue")) $("#statValue").textContent = "Rp " + state.value.toLocaleString("id-ID");
  if ($("#statCo2")) $("#statCo2").textContent = state.co2.toFixed(1) + " kg";
  
  if ($("#missionPercent")) $("#missionPercent").textContent = percent + "%";
  if ($("#missionRemaining")) $("#missionRemaining").textContent = remaining.toFixed(1) + " kg";
  if ($("#missionProgressText")) $("#missionProgressText").textContent = `${state.diverted.toFixed(1)} / ${target} kg`;
  if ($("#missionBar")) $("#missionBar").style.width = percent + "%";
  if ($("#missionRing")) $("#missionRing").style.background = `conic-gradient(var(--green) ${percent * 3.6}deg, var(--border) 0deg)`;

  if ($("#impactDiverted")) $("#impactDiverted").textContent = state.diverted.toFixed(1) + " kg";
  if ($("#impactCo2")) $("#impactCo2").textContent = state.co2.toFixed(1) + " kg";
  if ($("#impactWater")) $("#impactWater").textContent = state.water.toLocaleString("id-ID") + " L";
  if ($("#impactValue")) $("#impactValue").textContent = "Rp " + state.value.toLocaleString("id-ID");

  if ($("#walletEarned")) $("#walletEarned").textContent = state.earnedCoins.toLocaleString("id-ID");
  if ($("#walletRedeemed")) $("#walletRedeemed").textContent = state.redeemedCoins.toLocaleString("id-ID");

  if ($("#navMarketBadge")) $("#navMarketBadge").textContent = products.length;
  if ($("#kpiListings")) $("#kpiListings").textContent = products.length;
  if ($("#msgBadge")) $("#msgBadge").textContent = conversations.length > 0 ? conversations.length : "0";
}

export function addCoins(n, label) {
  state.coins += n; state.earnedCoins += n;
  state.history.unshift([label, "+" + n + " EC", "Just now"]);
  sync();
  if ($("#walletActivity")) renderWallet();
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
  if ($("#dashMatches")) $("#dashMatches").innerHTML = matches.length === 0 ? `<p class="muted" style="padding:16px;font-size:13px">Belum ada Smart Match.</p>` : matches.slice(0, 3).map(m => `<div class="match-row"><div class="company-logo">${m[0]}</div><main><b>${m[1]}</b><small>Needs ${m[2]}</small></main></div>`).join("");
}

export function renderOrders() {
  const rows = $("#ordersRows");
  if (!rows) return;
  if (orders.length === 0) {
    rows.innerHTML = `<p class="muted" style="padding:24px;text-align:center">Belum ada transaksi pembelian atau request pickup.</p>`;
    return;
  }
  rows.innerHTML = orders.map(o => `
    <div class="tr">
      <span><b>#${o.id}</b><br><small>${o.product}</small></span>
      <span>${o.partner}</span>
      <span><span class="badge" style="background:#eafaf1;color:#1e8449">${o.status}</span></span>
      <span>${o.value}</span>
      <span>${o.date}</span>
      <span><button class="btn ghost">Track</button></span>
    </div>
  `).join("");
}

// LOGIKA CHAT ROOM TERPISAH
export function renderConversations() {
  const convList = $("#conversationList");
  const chatHead = $(".chat-head");
  const chatBody = $("#chatBody");
  if (!convList) return;
  if (conversations.length === 0) {
    convList.innerHTML = `<p class="muted" style="padding:20px;text-align:center;font-size:13px">Belum ada pesan.</p>`;
    if (chatHead) chatHead.innerHTML = `<div>Pilih seller dari marketplace untuk chat.</div>`;
    if (chatBody) chatBody.innerHTML = "";
    return;
  }

  if (!activeChatSeller || !conversations.find(c => c.seller === activeChatSeller)) {
    setActiveChat(conversations[0].seller);
  }

  convList.innerHTML = conversations.map((c) => `
    <div class="conversation ${c.seller === activeChatSeller ? "active" : ""}" data-chat-id="${c.seller}">
      <div class="company-logo">${c.logo}</div>
      <main><b>${c.seller}</b><small>${c.lastMsg}</small></main><time>${c.time}</time>
    </div>
  `).join("");

  $$(".conversation").forEach(el => {
    el.onclick = () => {
      setActiveChat(el.dataset.chatId);
      renderConversations();
    };
  });

  const activeConv = conversations.find(c => c.seller === activeChatSeller);
  if (activeConv) {
    if (chatHead) chatHead.innerHTML = `<div class="avatar">${activeConv.logo}</div><div><b>${activeConv.seller}</b><small>● Online</small></div>`;
    if (chatBody) {
      chatBody.innerHTML = activeConv.messages.map(m => `<div class="bubble ${m.sender}">${m.text}</div>`).join("");
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }
}

export function renderLearn() { if ($("#learnGrid")) $("#learnGrid").innerHTML = learn.map((x, i) => `<article class="learn-card"><div class="learn-photo"><img src="${x[1]}" loading="lazy"></div><div class="learn-body"><h3>${x[0]}</h3><div class="learn-foot"><b>${x[3]}</b><button data-learn="${i}">Learn</button></div></div></article>`).join(""); }
export function renderChallenge() {
  if ($("#challengeList")) $("#challengeList").innerHTML = `<div class="mission"><div class="mission-icon">♻</div><main><b>Divert 5 kg plastic</b></main><strong>+100 EC</strong></div>`;
  if ($("#leaderboard")) $("#leaderboard").innerHTML = `<div class="leader"><span class="rank">1</span><div class="avatar">GS</div><main><b>GreenSaver (You)</b></main><strong>${state.coins} EC</strong></div>`;
}
export function renderWallet() { if ($("#walletActivity")) $("#walletActivity").innerHTML = state.history.length === 0 ? `<p class="muted" style="padding:16px;font-size:13px">Belum ada riwayat.</p>` : state.history.slice(0, 5).map(a => `<div class="activity"><span><b>${a[0]}</b></span><strong>${a[1]}</strong></div>`).join(""); }