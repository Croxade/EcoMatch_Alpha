import { $, $$ } from '../utils/helpers.js';
import { state, meta, matches, learn } from '../models/db.js';
import { renderMarket, renderMatches } from './marketCtrl.js';

export function sync() {
  ["sideCoins", "dashCoins", "walletCoins"].forEach((id) => {
    const x = $("#" + id);
    if (x) x.textContent = state.coins.toLocaleString("id-ID");
  });
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
  $("#dashMatches").innerHTML = matches.slice(0, 3).map(m => `
    <div class="match-row">
      <div class="company-logo">${m[0]}</div>
      <main><b>${m[1]}</b><small>Needs ${m[2]} · ${m[3]}</small></main>
      <div class="match-score-mini"><b>${m[5]}</b><small>${m[6]}</small></div>
    </div>
  `).join("");

  $("#dashActivity").innerHTML = state.history.slice(0, 4).map(a => `
    <div class="activity">
      <span><b>${a[0]}</b><small>${a[2]}</small></span>
      <strong>${a[1]}</strong>
    </div>
  `).join("");
}

export function renderOrders() {
  const rows = [
    ["#ECM-1842", "EcoRecycle Indonesia", "Waiting pickup", "Rp 27.500", "Tomorrow 09:00", "orange"],
    ["#ECM-1809", "PaperLoop", "Completed", "Rp 63.000", "Jul 13", ""],
    ["#ECM-1762", "ReWear Indonesia", "In transit", "Rp 153.000", "Jul 12", "blue"],
    ["#ECM-1711", "MetalCycle", "Completed", "Rp 352.000", "Jul 09", ""],
    ["#ECM-1689", "TechCycle", "Completed", "Rp 129.500", "Jul 05", ""],
    ["#ECM-1624", "PlastCycle", "Waiting pickup", "Rp 83.200", "Jul 03", "orange"]
  ];

  $("#ordersRows").innerHTML = rows.map(r => `
    <div class="tr">
      <span><b>${r[0]}</b><small style="display:block;color:#9aa39e;font-size:6px">Marketplace</small></span>
      <span>${r[1]}</span>
      <span><em class="status ${r[5]}">${r[2]}</em></span>
      <span>${r[3]}</span><span>${r[4]}</span>
      <button class="text-btn" data-order="${r[0]}">•••</button>
    </div>
  `).join("");
}

export function renderConversations() {
  const conversations = [
    ["ER", "EcoRecycle Indonesia", "Ready to discuss pickup.", "2m"],
    ["PL", "PaperLoop", "Can you confirm the volume?", "18m"],
    ["RW", "ReWear Indonesia", "Thanks! See you tomorrow.", "1h"],
    ["MC", "MetalCycle", "Offer updated.", "3h"]
  ];

  $("#conversationList").innerHTML = conversations.map((c, i) => `
    <div class="conversation ${i === 0 ? "active" : ""}">
      <div class="company-logo">${c[0]}</div>
      <main><b>${c[1]}</b><small>${c[2]}</small></main><time>${c[3]}</time>
    </div>
  `).join("");
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
    ["♻", "Divert 5 kg plastic", "2 / 5 kg", 100, "40%"],
    ["▧", "Complete 2 EcoLearn", "1 / 2 lessons", 60, "50%"],
    ["＋", "Publish one listing", "Not started", 150, "0%"],
    ["⌁", "Make a Smart Match", "Not started", 110, "0%"],
    ["♡", "Invite a friend", "Not started", 100, "0%"]
  ];

  $("#challengeList").innerHTML = a.map(x => `
    <div class="mission">
      <div class="mission-icon">${x[0]}</div>
      <main><b>${x[1]}</b><small>${x[2]}</small><div class="progress"><i style="width:${x[4]}"></i></div></main>
      <strong>+${x[3]} EC</strong>
    </div>
  `).join("");

  const leaders = [
    ["1", "AR", "Andi R.", "2.840 EC"], ["2", "MN", "Maya N.", "2.420 EC"], ["3", "GS", "GreenSaver", "2.180 EC"],
    ["4", "FK", "Fikri K.", "1.940 EC"], ["5", "SA", "Salsa A.", "1.760 EC"]
  ];

  $("#leaderboard").innerHTML = leaders.map(x => `
    <div class="leader">
      <span class="rank">${x[0]}</span><div class="avatar">${x[1]}</div>
      <main><b>${x[2]}</b><small>Eco Warrior</small></main><strong>${x[3]}</strong>
    </div>
  `).join("");
}

export function renderWallet() {
  $("#walletActivity").innerHTML = state.history.concat([
    ["Daily streak bonus", "+20 EC", "Jul 11"], ["Referral reward", "+100 EC", "Jul 10"]
  ]).slice(0, 7).map(a => `
    <div class="activity">
      <span><b>${a[0]}</b><small>${a[2]}</small></span>
      <strong>${a[1]}</strong>
    </div>
  `).join("");
}