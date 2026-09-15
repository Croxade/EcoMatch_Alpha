import { products, state, matches, conversations, savedProducts, orders, activeChatSeller, setActiveChat } from '../models/db.js';
import { $, rupiah, toast } from '../utils/helpers.js';
import { page, closeModals, renderConversations, updateDashboardStats } from './uiCtrl.js';

export function productCard(p) {
  const isSaved = savedProducts.includes(p.id);
  return `
    <article class="product">
      <div class="product-photo">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <button class="heart" data-save="${p.id}" style="color:${isSaved ? 'red' : 'white'}">${isSaved ? '♥' : '♡'}</button>
      </div>
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
    
    // LOGIKA FILTER TERSIMPAN ♡
    const filterMatch = state.filter === "all" || 
                        (state.filter === "saved" ? savedProducts.includes(p.id) : p.cat === state.filter);
    
    return queryMatch && filterMatch;
  });

  if (state.sort === "high") a.sort((x, y) => y.price - x.price);
  if (state.sort === "low") a.sort((x, y) => x.price - y.price);
  if (state.sort === "new") a.sort((x, y) => y.id - x.id);

  if ($("#resultCount")) $("#resultCount").textContent = a.length;
  if ($("#marketGrid")) $("#marketGrid").innerHTML = a.map(productCard).join("");
  updateDashboardStats(); 
}

export function renderMatches() {
  if ($("#matchList")) {
    $("#matchList").innerHTML = matches.map((m) => `
      <article class="match-card">
        <div class="company-logo">${m[0]}</div>
        <main><h3>${m[1]}</h3><p>Mencari: <b>${m[2]}</b> · Volume ${m[3]}</p><div class="tags"><span>⌖ ${m[4]}</span><span>Verified buyer</span></div></main>
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

  // 1. Logika Chat Seller
  $("#contactSeller").onclick = () => {
    const isExist = conversations.find(c => c.seller === p.seller);
    if (!isExist) {
      conversations.unshift({
        logo: p.seller.substring(0, 2).toUpperCase(), seller: p.seller, lastMsg: `Tanya material: ${p.name}`, time: "Just now",
        messages: [{ sender: "me", text: `Halo kak, untuk material ${p.name} apakah masih tersedia?` }]
      });
    }
    setActiveChat(p.seller);
    closeModals();
    page("messages");
    renderConversations();
    updateDashboardStats();
    toast(`Membuka chat dengan ${p.seller}`);
  };

  // 2. Logika Beli / Request Pickup
  $("#buyListing").onclick = () => {
    const orderID = Math.floor(1000 + Math.random() * 9000);
    orders.unshift({ id: orderID, product: p.name, partner: p.seller, status: "Menunggu Konfirmasi", value: rupiah(p.price * parseFloat(p.weight)), date: "Just now" });
    closeModals();
    page("orders");
    toast(`Berhasil! Pesanan #${orderID} telah dibuat.`);
  };

  // 3. Logika Simpan (Save ke array savedProducts)
  $("#saveListing").onclick = () => {
    if (!savedProducts.includes(p.id)) {
      savedProducts.push(p.id);
      toast(p.name + " disimpan ke daftar Tersimpan ♡");
      renderMarket(); // Biar logo heart di background merah
    } else {
      toast("Barang sudah ada di daftar simpan.");
    }
  };
}