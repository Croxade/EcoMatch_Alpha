import { $, $$, rupiah, toast } from '../utils/helpers.js';
import { products, state, matches, IMG } from '../models/db.js';
import { page, updateDashboardStats, addCoins } from './uiCtrl.js';

export let selectedCat = "Plastik";

export function estimate() {
  const wInput = $("#sellWeight");
  const pInput = $("#sellPrice");
  const kg = Number(wInput ? wInput.value : 0);
  const price = Number(pInput ? pInput.value : 0);

  if ($("#estimate")) $("#estimate").textContent = rupiah(kg * price);
  
  const nameInput = $("#sellName");
  if ($("#previewName")) $("#previewName").textContent = (nameInput && nameInput.value) ? nameInput.value : "Material baru";
  if ($("#previewPrice")) $("#previewPrice").innerHTML = rupiah(price) + " <small>/ kg</small>";
  
  const condInput = $("#sellCondition");
  if ($("#previewDesc")) $("#previewDesc").textContent = condInput ? condInput.value : "";
  if ($("#previewCat")) $("#previewCat").textContent = selectedCat.toUpperCase();
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
        price, weight: kg + " kg", loc: $("#sellLocation").value, seller: "GreenSaver (You)", match: 99, condition: $("#sellCondition").value
      });

      // SMART MATCH LOGIC: Menambahkan Buyer yang Relevan & Sinkron!
      matches.unshift([
        selectedCat.substring(0, 2).toUpperCase(), 
        "EcoPartner Hub", 
        name, // Nama barang yang sama
        `${kg}–${kg+50} kg`, // Mencari volume serupa
        `${$("#sellLocation").value} · Pickup`,
        "98%", 
        rupiah(price + 250) + "/kg" // Berani bayar lebih mahal sedikit
      ]);

      state.diverted += kg;
      state.value += (kg * price);
      state.co2 += Number((kg * 0.75).toFixed(1));
      state.water += Number((kg * 42.5).toFixed(0)); // Water saved logic (asumsi 42.5L/kg)
      
      state.history.unshift(["Listing baru · " + name, "+" + rupiah(kg * price), "Just now"]);

      updateDashboardStats();
      addCoins(100, "Listing bonus");
      
      form.reset();
      estimate();
      
      page("matches"); // Langsung arahin ke halaman match biar dia liat hasilnya
      toast("Listing berhasil! Ada buyer baru untuk material kamu.");
    };
  }
}