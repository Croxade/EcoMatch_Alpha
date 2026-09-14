export const IMG = {
  plastic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnxq9025nfPW3cSna5rTZJkAm3FhQueweA3-1ISzZlFJZ2vEZKwq3IZBEr&s=10",
  cardboard: "https://www.onepresso.net/wp-content/uploads/2018/11/Packing04.jpg",
  clothes: "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//92/MTA-3171836/kaos-urban_-kaos-urban-custom-e-sport-game-mobile-legends--ml---fk0011--_full02.jpg",
  metal: "https://upload.wikimedia.org/wikipedia/commons/1/11/Konservendose-1.jpg",
  laptop: "https://dlcdnwebimgs.asus.com/gain/B239AD46-0C86-422B-BF95-B2AC08FE96DF/w750/h470/fwebp",
  eco: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSo-GRMVvPAH_dva2Lzl95Jfyl6nRZi9lgkozRYKTfbul22RA6UiZdI4Du&s=10",
  paper: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80",
  textile: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5mB1oW7DwpQSeABJPzZsigivaV8hpVD9hvPnJ_SOsIz6jg6sVv9lfL8pd&s=10"
};

export let products = [
  { id: 1, cat: "Plastik", name: "Botol PET Bening", img: IMG.plastic, price: 2750, weight: "10 kg", loc: "Jakarta Selatan", seller: "GreenSaver", match: 92, condition: "Clean & sorted" },
  { id: 2, cat: "Kertas", name: "Kardus Corrugated", img: IMG.cardboard, price: 1800, weight: "35 kg", loc: "Jakarta Selatan", seller: "Dina Home", match: 88, condition: "Dry & sorted" },
  { id: 3, cat: "Kain", name: "Pakaian Layak Pakai", img: IMG.clothes, price: 8500, weight: "18 kg", loc: "Depok", seller: "Ruang Berbagi", match: 84, condition: "Good condition" },
  { id: 4, cat: "Logam", name: "Kaleng Aluminium", img: IMG.metal, price: 16500, weight: "22 kg", loc: "Tangerang", seller: "Ari Workshop", match: 81, condition: "Compressed" },
  { id: 5, cat: "Elektronik", name: "Laptop Rusak / Parts", img: IMG.laptop, price: 18500, weight: "7 kg", loc: "Jakarta Barat", seller: "TechCycle", match: 79, condition: "For parts" },
  { id: 6, cat: "Plastik", name: "Jerigen HDPE", img: IMG.plastic, price: 3200, weight: "26 kg", loc: "Bekasi", seller: "Nanda", match: 76, condition: "Clean" },
  { id: 7, cat: "Kertas", name: "Majalah & HVS", img: IMG.paper, price: 1600, weight: "12 kg", loc: "Jakarta Timur", seller: "Kampus Hijau", match: 73, condition: "Dry" },
  { id: 8, cat: "Kain", name: "Sisa Kain Katun", img: IMG.textile, price: 6500, weight: "31 kg", loc: "Tangerang", seller: "SewLab", match: 71, condition: "Sorted" }
];

export let matches = [
  ["ER", "EcoRecycle Indonesia", "PET Bening", "50–100 kg", "Jakarta · Pickup", "92%", "Rp 2.750/kg"],
  ["PL", "PaperLoop", "Kardus Corrugated", "30–80 kg", "Jakarta · Drop-off", "88%", "Rp 1.800/kg"],
  ["RW", "ReWear Indonesia", "Textile / Cotton", "10–50 kg", "Depok · Pickup", "84%", "Rp 8.500/kg"],
  ["MC", "MetalCycle", "Aluminium", "20–100 kg", "Tangerang · Pickup", "81%", "Rp 16.500/kg"]
];

export let learn = [
  ["Mitos atau Fakta: Plastik Bisa Terurai?", IMG.eco, "2 min", "+50 EC"],
  ["Kenapa Kardus Bekas Punya Nilai Tinggi?", IMG.cardboard, "3 min", "+40 EC"],
  ["Textile Waste: Masalah yang Tak Terlihat", IMG.textile, "4 min", "+80 EC"],
  ["Cara Memilah Sampah di Rumah", IMG.eco, "2 min", "+30 EC"],
  ["Circular Economy untuk Anak Muda", IMG.paper, "3 min", "+60 EC"],
  ["Dari Limbah Jadi Bahan Baku", IMG.metal, "4 min", "+100 EC"]
];

export let state = {
  coins: 12850, filter: "all", query: "", sort: "match",
  history: [
    ["Listing Botol PET · #ECM-1842", "+Rp 27.500", "Today"],
    ["EcoLearn · Plastic 101", "+50 EC", "Today"],
    ["Pickup Kardus · #ECM-1809", "+Rp 63.000", "Yesterday"],
    ["Challenge · 5 kg plastic", "+100 EC", "Yesterday"]
  ]
};

export const meta = {
  dashboard: ["EcoMatch / Overview", "Good afternoon, GreenSaver.", "Hari ini adalah hari yang bagus untuk mengubah sesuatu yang tidak terpakai menjadi bernilai."],
  market: ["EcoMatch / Marketplace", "Find value in what you already have.", "Temukan material, buyer, dan supplier di sekitar ekosistemmu."],
  matches: ["EcoMatch / Smart Match", "We found your next opportunity.", "Match berdasarkan material, volume, lokasi, harga, dan kebutuhan buyer."],
  sell: ["EcoMatch / Sell", "Turn waste into value.", "Post dalam kurang dari 2 menit. EcoMatch akan mencarikan buyer yang relevan."],
  orders: ["EcoMatch / Transactions", "Orders & Pickup", "Kelola proses dari deal sampai material diterima buyer."],
  messages: ["EcoMatch / Messages", "Talk to your circular network.", "Negosiasi, konfirmasi pickup, dan koordinasi dengan buyer."],
  learn: ["EcoMatch / EcoLearn", "Scroll. Learn. Earn. Impact.", "Konten singkat tentang circular economy yang memberikan reward."],
  challenge: ["EcoMatch / Community", "Small actions. Collective impact.", "Bangun kebiasaan baik bersama komunitas EcoMatch."],
  impact: ["EcoMatch / Impact", "Make your waste visible.", "Lihat dampak lingkungan dan nilai ekonomi yang kamu ciptakan."],
  wallet: ["EcoMatch / EcoWallet", "Your circular rewards.", "Kelola EcoCoin yang kamu dapatkan dari aktivitas di EcoMatch."],
  settings: ["EcoMatch / Account", "Settings", "Atur pengalaman EcoMatch sesuai kebutuhanmu."]
};