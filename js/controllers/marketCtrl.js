import { products, state, matches, conversations } from '../models/db.js';
import { $, rupiah, toast } from '../utils/helpers.js';
import { page, closeModals, updateDashboardStats, setActiveConversation } from './uiCtrl.js';

// Simpanan/wishlist produk. Disimpan di sini (bukan db.js) karena struktur
// db.js belum expose field ini. Pakai Set of id biar cepat dicek & unik.
const savedIds = new Set();
export function isSaved(id) { return savedIds.has(String(id)); }
export function toggleSave(id) {
  id = String(id);
  const nowSaved = !savedIds.has(id);
  if (nowSaved) savedIds.add(id); else savedIds.delete(id);
  return nowSaved;
}

// Order/riwayat pembelian. Sama seperti savedIds, disimpan lokal di sini.
export const orders = [];
export function createOrder(p) {
  const qty = parseFloat(p.weight) || 1;
  const order = {
    id: "ORD-" + Date.now().toString().slice(-6),
    product: p.name,
    seller: p.seller,
    status: "Menunggu konfirmasi",
    value: p.price * qty,
    date: "Hari ini"
  };
  orders.unshift(order);
  return order;
}

export function productCard(p) {
  return `
    <article class="product">
      <div class="product-photo"><img src="${p.img}" alt="${p.name}" loading="lazy"><button class="heart ${isSaved(p.id) ? "active" : ""}" data-save="${p.id}">${isSaved(p.id) ? "♥" : "♡"}</button></div>
      <div class="product-body">
        <span class="badge">${p.cat}</span><h3>${p.name}</h3><p>${p.condition} · ${p.weight}</p>
        <div class="product-price">${rupiah(p.price)}<small>/kg</small></div>
        <div class="product-meta"><span>⌖ ${p.loc}</span></div>
        <button data-product="${p.id}">View listing →</button>
      </div>
    </article>
  `;
}

export function renderMarket() {
  let a = products.filter((p) => {
    const searchString = `${p.name} ${p.cat} ${p.loc} ${p.seller}`.toLowerCase();
    const queryMatch = !state.query || searchString.includes(state.query.toLowerCase());
    const filterMatch = state.filter === "all" || (state.filter === "saved" ? isSaved(p.id) : p.cat === state.filter);
    return queryMatch && filterMatch;
  });

  if (state.sort === "high") a.sort((x, y) => y.price - x.price);
  if (state.sort === "low") a.sort((x, y) => x.price - y.price);
  if (state.sort === "new") a.sort((x, y) => y.id - x.id);

  if ($("#resultCount")) $("#resultCount").textContent = a.length;
  if ($("#marketGrid")) $("#marketGrid").innerHTML = a.map(productCard).join("");
  updateDashboardStats(); // Pastikan badge marketplace sinkron
}

export function renderMatches() {
  if ($("#matchList")) {
    $("#matchList").innerHTML = matches.map((m) => `
      <article class="match-card">
        <div class="company-logo">${m[0]}</div>
        <main>
          <h3>${m[1]}</h3>
          <p>Mencari: <b>${m[2]}</b> · Volume ${m[3]}</p>
          <div class="tags"><span>⌖ ${m[4]}</span><span>Verified buyer</span></div>
        </main>
        <div class="score-box"><strong>${m[5]}</strong><small>Match</small><small>${m[6]}</small></div>
        <button class="btn primary" data-contact="${m[1]}">Contact</button>
      </article>
    `).join("");
  }
}

export function openProduct(id) {
  const p = products.find((x) => x.id == id);
  if (!p) return;

  $("#modalImg").src = p.img;
  $("#modalBadge").textContent = p.cat;
  $("#modalTitle").textContent = p.name;
  $("#modalInfo").textContent = `${p.condition} · ${p.weight}. Tersedia di ${p.loc}.`;
  $("#modalPrice").textContent = rupiah(p.price) + "/kg";
  $("#modalLoc").textContent = "⌖ " + p.loc;
  $("#modalSeller").textContent = "Seller: " + p.seller;

  $("#detailModal").classList.add("open");

  const saveBtn = $("#saveListing");
  if (saveBtn) {
    saveBtn.textContent = isSaved(p.id) ? "♥ Saved" : "♡ Save";
    saveBtn.onclick = () => {
      const nowSaved = toggleSave(p.id);
      saveBtn.textContent = nowSaved ? "♥ Saved" : "♡ Save";
      renderMarket(); // sinkronin heart icon di grid marketplace
      toast(nowSaved ? "Listing disimpan. Cek tab ♥ Saved di Marketplace." : "Listing dihapus dari Saved.");
    };
  }

  const buyBtn = $("#buyNow");
  if (buyBtn) {
    buyBtn.onclick = () => {
      const order = createOrder(p);
      closeModals();
      page("orders");
      toast(`Pesanan ${order.id} dibuat. Cek status di Pesanan & Pickup.`);
    };
  }

  $("#contactSeller").onclick = () => {
    let idx = conversations.findIndex(c => c.seller === p.seller);
    if (idx === -1) {
      conversations.unshift({
        logo: p.seller.substring(0, 2).toUpperCase(),
        seller: p.seller,
        lastMsg: `Tanya material: ${p.name}`,
        time: "Just now",
        messages: [{ from: "other", text: "Halo! Silakan post pertanyaan tentang material." }]
      });
      idx = 0;
    }

    closeModals();
    page("messages");
    setActiveConversation(idx);
    updateDashboardStats();

    // Isi draft di kolom chat, biar user yang mutusin kirim atau ubah dulu
    setTimeout(() => {
      const chatInput = $("#chatMessage");
      if (chatInput) chatInput.value = `Halo kak, untuk material ${p.name} apakah masih tersedia?`;
    }, 100);

    toast(`Membuka chat dengan ${p.seller}`);
  };
}