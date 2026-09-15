export const IMG = {
  plastic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnxq9025nfPW3cSna5rTZJkAm3FhQueweA3-1ISzZlFJZ2vEZKwq3IZBEr&s=10",
  cardboard: "https://www.onepresso.net/wp-content/uploads/2018/11/Packing04.jpg",
  clothes: "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//92/MTA-3171836/kaos-urban_-kaos-urban-custom-e-sport-game-mobile-legends--ml---fk0011--_full02.jpg",
  eco: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSo-GRMVvPAH_dva2Lzl95Jfyl6nRZi9lgkozRYKTfbul22RA6UiZdI4Du&s=10"
};

export let products = [
  { id: 101, cat: "Plastik", name: "Botol PET Bening", img: IMG.plastic, price: 2750, weight: "10 kg", loc: "Jakarta Selatan", seller: "Budi Santoso", match: 92, condition: "Clean & sorted" },
  { id: 102, cat: "Kertas", name: "Kardus Corrugated", img: IMG.cardboard, price: 1800, weight: "35 kg", loc: "Depok", seller: "Dina Home", match: 88, condition: "Dry & sorted" }
];

export let savedProducts = []; // Tempat nyimpan ID barang yang dilove
export let orders = []; // Tempat nyimpan data transaksi/beli
export let matches = [];

// Room Chat Terpisah
export let activeChatSeller = null; 
export function setActiveChat(seller) { activeChatSeller = seller; }

export let conversations = []; 

export let learn = [
  ["Mitos atau Fakta: Plastik Bisa Terurai?", IMG.eco, "2 min", "+50 EC"],
  ["Kenapa Kardus Bekas Punya Nilai Tinggi?", IMG.cardboard, "3 min", "+40 EC"]
];

export let state = {
  coins: 0, earnedCoins: 0, redeemedCoins: 0, diverted: 0, value: 0, co2: 0, water: 0, filter: "all", query: "", sort: "new", history: []
};

export const meta = {
  dashboard: ["EcoMatch / Overview", "Good afternoon, GreenSaver.", "Mulai kelola dan ubah waste kamu jadi value hari ini."],
  market: ["EcoMatch / Marketplace", "Find value in what you already have.", "Temukan material, buyer, dan supplier di sekitar ekosistemmu."],
  matches: ["EcoMatch / Smart Match", "We found your next opportunity.", "Match dibuat secara real-time saat kamu mempublikasikan listing."],
  sell: ["EcoMatch / Sell", "Turn waste into value.", "Post dalam kurang dari 2 menit. EcoMatch akan mencarikan buyer yang relevan."],
  orders: ["EcoMatch / Transactions", "Orders & Pickup", "Lacak barang yang kamu beli atau request pickup."],
  messages: ["EcoMatch / Messages", "Talk to your circular network.", "Negosiasi, konfirmasi pickup, dan koordinasi dengan buyer."],
  learn: ["EcoMatch / EcoLearn", "Scroll. Learn. Earn. Impact.", "Konten singkat tentang circular economy yang memberikan reward."],
  challenge: ["EcoMatch / Community", "Small actions. Collective impact.", "Bangun kebiasaan baik bersama komunitas EcoMatch."],
  impact: ["EcoMatch / Impact", "Make your waste visible.", "Lihat dampak lingkungan dan nilai ekonomi yang kamu ciptakan."],
  wallet: ["EcoMatch / EcoWallet", "Your circular rewards.", "Kelola EcoCoin yang kamu dapatkan dari aktivitas di EcoMatch."],
  settings: ["EcoMatch / Account", "Settings", "Atur pengalaman EcoMatch sesuai kebutuhanmu."]
};