import { products, state, matches } from '../models/db.js';
import { $, rupiah, toast } from '../utils/helpers.js';
import { page, closeModals } from './uiCtrl.js';

export function productCard(p) {
  return `
    <article class="product">
      <div class="product-photo">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <button class="heart" data-save="${p.id}">♡</button>
      </div>
      <div class="product-body">
        <span class="badge">${p.cat}</span>
        <h3>${p.name}</h3>
        <p>${p.condition} · ${p.weight}</p>
        <div class="product-price">${rupiah(p.price)}<small>/kg</small></div>
        <div class="product-meta"><span>⌖ ${p.loc}</span><span>${p.match}% match</span></div>
        <button data-product="${p.id}">View listing →</button>
      </div>
    </article>
  `;
}

export function renderMarket() {
  let a = products.filter(
    (p) => (state.filter === "all" || p.cat === state.filter) &&
      (!state.query || `${p.name} ${p.cat} ${p.loc} ${p.seller}`.toLowerCase().includes(state.query))
  );

  if (state.sort === "high") a.sort((x, y) => y.price - x.price);
  if (state.sort === "low") a.sort((x, y) => x.price - y.price);
  if (state.sort === "new") a.sort((x, y) => y.id - x.id);
  if (state.sort === "match") a.sort((x, y) => y.match - x.match);

  $("#resultCount").textContent = a.length;
  $("#marketGrid").innerHTML = a.map(productCard).join("");
}

export function renderMatches() {
  $("#matchList").innerHTML = matches.map(
    (m) => `
      <article class="match-card">
        <div class="company-logo">${m[0]}</div>
        <main>
          <h3>${m[1]}</h3>
          <p>Looking for <b>${m[2]}</b> · Volume ${m[3]}</p>
          <div class="tags"><span>⌖ ${m[4]}</span><span>Verified buyer</span></div>
        </main>
        <div class="score-box"><strong>${m[5]}</strong><small>match score</small><small>${m[6]}</small></div>
        <button class="btn primary" data-contact="${m[1]}">Contact buyer</button>
      </article>
    `
  ).join("");
}

export function openProduct(id) {
  const p = products.find((x) => x.id == id);
  if (!p) return;

  $("#modalImg").src = p.img;
  $("#modalBadge").textContent = p.cat;
  $("#modalTitle").textContent = p.name;
  $("#modalInfo").textContent = `${p.condition} · ${p.weight}. Material ini tersedia di ${p.loc} dan cocok untuk buyer yang mencari ${p.cat.toLowerCase()}.`;
  $("#modalPrice").textContent = rupiah(p.price) + "/kg";
  $("#modalLoc").textContent = "⌖ " + p.loc;
  $("#modalSeller").textContent = "Seller: " + p.seller;
  $("#modalMatch").textContent = p.match + "% match";

  $("#detailModal").classList.add("open");

  $("#contactSeller").onclick = () => {
    closeModals();
    page("messages");
    toast("Conversation dengan seller dibuka.");
  };

  $("#saveListing").onclick = () => { toast("Listing disimpan ke Saved."); };
}