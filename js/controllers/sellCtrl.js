import { $, $$, rupiah, toast } from '../utils/helpers.js';
import { products, state, matches, IMG } from '../models/db.js';
import { page, updateDashboardStats } from './uiCtrl.js';
import { addCoins } from '../services/coinLogic.js';

export let selectedCat = "Plastik";

export function estimate() {
  const kg = Number($("#sellWeight")?.value || 0);
  const price = Number($("#sellPrice")?.value || 0);

  if ($("#estimate")) $("#estimate").textContent = rupiah(kg * price);
  if ($("#previewName")) $("#previewName").textContent = $("#sellName").value || "Botol PET bening";
  if ($("#previewPrice")) $("#previewPrice").innerHTML = rupiah(price) + " <small>/ kg</small>";
  if ($("#previewDesc")) $("#previewDesc").textContent = $("#sellCondition").value;
  if ($("#previewCat")) $("#previewCat").textContent = (selectedCat || "Plastik").toUpperCase();
}

export function initSellForm() {
  $$(".cat").forEach((b) => {
    b.onclick = () => {
      $$(".cat").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      selectedCat = b.dataset.cat;
      $("#previewCat").textContent = selectedCat.toUpperCase();
      toast("Kategori " + selectedCat + " dipilih.");
    };
  });

  ["sellName", "sellWeight", "sellPrice", "sellCondition", "sellLocation", "sellDesc"].forEach((id) => {
    const x = $("#" + id);
    if (x) {
      x.addEventListener("input", estimate);
      x.addEventListener("change", estimate);
    }
  });

  $("#sellForm").onsubmit = (e) => {
    e.preventDefault();
    const name = $("#sellName").value.trim() || "Material baru";
    const kg = Number($("#sellWeight").value);
    const price = Number($("#sellPrice").value);
    const imageMap = { Plastik: "plastic", Kertas: "cardboard", Kain: "clothes", Logam: "metal", Elektronik: "laptop" };

    // Masukkan ke array products
    products.unshift({
      id: Date.now(), cat: selectedCat, name,
      img: IMG[imageMap[selectedCat] || "eco"],
      price, weight: kg + " kg", loc: $("#sellLocation").value, seller: "GreenSaver", match: 97, condition: $("#sellCondition").value
    });

    // Tambah Smart Match baru
    matches.unshift([
      selectedCat.substring(0, 2).toUpperCase(),
      "EcoPartner Hub",
      name,
      `${kg} kg`,
      `${$("#sellLocation").value} · Pickup`,
      "97%",
      rupiah(price) + "/kg"
    ]);

    // AKUMULASI NILAI DARI INPUT USER
    state.diverted += kg;
    state.value += (kg * price);
    state.co2 += Number((kg * 0.75).toFixed(1)); // Kalkulasi estimasi CO2 avoided

    state.history.unshift(["Listing baru · " + name, "+" + rupiah(kg * price), "Just now"]);
    
    // Update tampilan dashboard secara instan
    updateDashboardStats();

    addCoins(100, "Listing bonus");
    page("dashboard");
    toast("Listing live! Statistik dashboard dan Monthly Mission berhasil diperbarui.");
  };
}