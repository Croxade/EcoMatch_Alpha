import { $, $$, rupiah, toast } from '../utils/helpers.js';
import { products, state, matches, IMG } from '../models/db.js';
import { page, updateDashboardStats } from './uiCtrl.js';
import { addCoins } from '../services/coinLogic.js';

export let selectedCat = "Plastik";

export function estimate() {
  const wInput = $("#sellWeight");
  const pInput = $("#sellPrice");
  const kg = Number(wInput ? wInput.value : 0);
  const price = Number(pInput ? pInput.value : 0);

  const estimateEl = $("#estimate");
  if (estimateEl) estimateEl.textContent = rupiah(kg * price);

  const prevName = $("#previewName");
  const nameInput = $("#sellName");
  if (prevName) prevName.textContent = (nameInput && nameInput.value) ? nameInput.value : "Material baru";

  const prevPrice = $("#previewPrice");
  if (prevPrice) prevPrice.innerHTML = rupiah(price) + " <small>/ kg</small>";

  const prevDesc = $("#previewDesc");
  const condInput = $("#sellCondition");
  if (prevDesc) prevDesc.textContent = condInput ? condInput.value : "";

  const prevCat = $("#previewCat");
  if (prevCat) prevCat.textContent = selectedCat.toUpperCase();
}

export function initSellForm() {
  $$(".cat").forEach((b) => {
    b.addEventListener("click", () => {
      $$(".cat").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      selectedCat = b.dataset.cat;
      estimate();
      toast("Kategori " + selectedCat + " dipilih.");
    });
  });

  ["sellName", "sellWeight", "sellPrice", "sellCondition", "sellLocation", "sellDesc"].forEach((id) => {
    const el = $("#" + id);
    if (el) {
      el.addEventListener("input", estimate);
      el.addEventListener("change", estimate);
    }
  });

  const form = $("#sellForm");
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const name = $("#sellName").value.trim() || "Material baru";
      const kg = Number($("#sellWeight").value);
      const price = Number($("#sellPrice").value);
      const imageMap = { Plastik: "plastic", Kertas: "cardboard", Kain: "clothes", Logam: "metal", Elektronik: "laptop", Organik: "eco" };

      products.unshift({
        id: Date.now(), cat: selectedCat, name,
        img: IMG[imageMap[selectedCat] || "eco"],
        price, weight: kg + " kg", loc: $("#sellLocation").value, seller: "GreenSaver", match: 97, condition: $("#sellCondition").value
      });

      matches.unshift([
        selectedCat.substring(0, 2).toUpperCase(), "EcoPartner Hub", name, `${kg} kg`, `${$("#sellLocation").value} · Pickup`, "97%", rupiah(price) + "/kg"
      ]);

      state.diverted += kg;
      state.value += (kg * price);
      state.co2 += Number((kg * 0.75).toFixed(1));
      state.history.unshift(["Listing baru · " + name, "+" + rupiah(kg * price), "Just now"]);

      updateDashboardStats();
      addCoins(100, "Listing bonus");
      
      form.reset();
      estimate();
      
      page("dashboard");
      toast("Listing berhasil! Dashboard sudah diperbarui.");
    };
  }
}