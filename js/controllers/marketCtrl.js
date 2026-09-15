import { products, state, matches, conversations } from '../models/db.js';
import { $, rupiah, toast } from '../utils/helpers.js';
import { page, closeModals, renderConversations } from './uiCtrl.js';

export function productCard(p) {
  return `
    <article class="product">
      <div class="product-photo"><img src="${p.img}" alt="${p.name}" loading="lazy"><button class="heart" data-save="${p.id}">♡</button></div>
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
    const filterMatch = state.filter === "all" || p.cat === state.filter;
    return queryMatch && filterMatch;
  });

  if (state.sort === "high") a.sort((x, y) => y.price - x.price);
  if (state.sort === "low") a.sort((x, y) => x.price - y.price);
  if (state.sort === "new") a.sort((x, y) => y.id - x.id);

  if ($("#resultCount")) $("#resultCount").textContent = a.length;
  if ($("#kpiListings")) $("#kpiListings").textContent = products.length;
  if ($("#marketGrid")) $("#marketGrid").innerHTML = a.map(productCard).join("");
}

export function renderMatches() {
  if ($("#matchList")) {
    $("#matchList").innerHTML = matches.map((m) => `
      <article class="match-card"><div class="company-logo">${m[0]}</div><main><h3>${m[1]}</h3><p>Looking for <b>${m[2]}</b></p></main></article>
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

  $("#contactSeller").onclick = () => {
    const isExist = conversations.find(c => c.seller === p.seller);
    if (!isExist) {
      conversations.unshift({
        logo: p.seller.substring(0, 2).toUpperCase(),
        seller: p.seller,
        lastMsg: `Tanya material: ${p.name}`,
        time: "Just now"
      });
    }

    closeModals();
    page("messages");
    renderConversations();
    
    setTimeout(() => {
      const chatInput = $("#chatMessage");
      if (chatInput) chatInput.value = `Halo kak, untuk material ${p.name} apakah masih tersedia?`;
    }, 100);

    toast(`Membuka chat dengan ${p.seller}`);
  };

  $("#saveListing").onclick = () => { toast("Listing disimpan ke Saved."); };
}