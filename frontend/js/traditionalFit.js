// frontend/js/traditionalFit.js

// Simple database of traditional outfits WITH gradient "image" strips
const TF_OUTFITS = [
  {
    id: "saree_slim_border",
    type: "Saree",
    name: "Silk Saree with Slim Border",
    shapes: ["hourglass", "pear", "apple"],
    tones: ["medium", "deep"],
    undertones: ["warm", "neutral"],
    // rich maroon → gold → deep green
    gradient: "linear-gradient(135deg, #5b0000 0%, #b8860b 40%, #013220 100%)",
    description: "Classic silk drape that highlights the waist and falls smoothly over curves.",
    tips: "Style with temple jewellery, bangles and an embellished clutch.",
    colorTags: ["maroon", "gold", "deep green"]
  },
  {
    id: "saree_soft_pastel",
    type: "Saree",
    name: "Soft Pastel Georgette Saree",
    shapes: ["rectangle", "apple", "pear"],
    tones: ["fair", "medium"],
    undertones: ["cool", "neutral"],
    // blush pink → lavender → mint
    gradient: "linear-gradient(135deg, #f4c2c2 0%, #c8a2c8 50%, #98ff98 100%)",
    description: "Light, flowy saree that creates gentle movement without adding bulk.",
    tips: "Pair with a structured blouse and delicate jewellery.",
    colorTags: ["blush pink", "lavender", "mint"]
  },
  {
    id: "lehenga_pastel",
    type: "Lehenga",
    name: "Pastel Embroidered Lehenga",
    shapes: ["rectangle", "pear"],
    tones: ["fair", "medium"],
    undertones: ["cool", "neutral"],
    // peach → mint → powder blue
    gradient: "linear-gradient(135deg, #ffdab9 0%, #b2f2bb 40%, #b0e0e6 100%)",
    description: "Soft pastel lehenga that adds volume to the lower body in a balanced way.",
    tips: "Wear with statement earrings and a sleek hairdo.",
    colorTags: ["peach", "mint", "powder blue"]
  },
  {
    id: "lehenga_jewel",
    type: "Lehenga",
    name: "Jewel-Toned Velvet Lehenga",
    shapes: ["hourglass", "pear"],
    tones: ["medium", "deep"],
    undertones: ["warm", "neutral"],
    // emerald → ruby → navy
    gradient: "linear-gradient(135deg, #006b3c 0%, #8b0000 40%, #000080 100%)",
    description: "Rich jewel colours that look stunning for night events.",
    tips: "Keep accessories metallic (gold or antique) to let the colour stand out.",
    colorTags: ["emerald", "ruby", "navy"]
  },
  {
    id: "kurta_office",
    type: "Kurta Set",
    name: "Straight Kurta with Cigarette Pants",
    shapes: ["apple", "rectangle"],
    tones: ["fair", "medium", "deep"],
    undertones: ["warm", "cool", "neutral"],
    // navy → olive → mustard
    gradient: "linear-gradient(135deg, #000080 0%, #556b2f 50%, #ffdb58 100%)",
    description: "Clean straight lines that skim the midsection and look polished for office or college.",
    tips: "Minimal studs, a watch and kolhapuri flats complete the look.",
    colorTags: ["navy", "olive", "mustard", "off-white"]
  },
  {
    id: "kurta_anarkali",
    type: "Kurta Set",
    name: "Anarkali Style Kurta Set",
    shapes: ["hourglass", "pear"],
    tones: ["fair", "medium", "deep"],
    undertones: ["warm", "neutral"],
    // maroon → teal → mustard
    gradient: "linear-gradient(135deg, #800000 0%, #008080 45%, #ffc72c 100%)",
    description: "Fitted at the top with a flare that balances hips and emphasizes the waist.",
    tips: "Great for festive family functions and pujas.",
    colorTags: ["maroon", "teal", "mustard"]
  },
  {
    id: "sherwani_royal",
    type: "Sherwani",
    name: "Embroidered Sherwani with Churidar",
    shapes: ["rectangle", "inverted_triangle"],
    tones: ["fair", "medium", "deep"],
    undertones: ["warm", "neutral"],
    // cream → gold → maroon
    gradient: "linear-gradient(135deg, #f5f5dc 0%, #ffd700 40%, #800000 100%)",
    description: "Structured shoulders and a long line for a royal, balanced silhouette.",
    tips: "Add mojaris, a brooch and an optional stole for weddings.",
    colorTags: ["cream", "gold", "maroon"]
  }
];

// --- profile + scoring helpers ---

function tfGetProfile() {
  return {
    shape: (localStorage.getItem("tanmaya_bodyShape") || "").toLowerCase(),
    tone: (localStorage.getItem("tanmaya_skinTone") || "").toLowerCase(),
    undertone: (localStorage.getItem("tanmaya_undertone") || "").toLowerCase(),
    bestColors: safeParseArray(localStorage.getItem("tanmaya_bestColors"))
  };
}

function safeParseArray(str) {
  if (!str) return [];
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function tfNormalize(str) {
  return (str || "").toLowerCase().trim();
}

function tfScoreOutfit(outfit, profile) {
  let score = 0;

  if (profile.shape && outfit.shapes.includes(profile.shape)) score += 3;
  if (profile.tone && outfit.tones.map(tfNormalize).includes(profile.tone)) score += 2;
  if (profile.undertone && outfit.undertones.map(tfNormalize).includes(profile.undertone)) score += 3;

  const best = (profile.bestColors || []).map(tfNormalize);
  const tags = (outfit.colorTags || []).map(tfNormalize);

  const colorHit = best.some(b =>
    tags.some(t => t.includes(b) || b.includes(t))
  );
  if (colorHit) score += 4;

  return score;
}

// --- rendering ---

function tfRender(profile, filterType = "all") {
  // summary
  document.getElementById("tf-shape").textContent =
    profile.shape || "not set";
  document.getElementById("tf-tone").textContent =
    profile.tone || "not set";
  document.getElementById("tf-undertone").textContent =
    profile.undertone || "not set";

  const listEl = document.getElementById("tf-outfit-list");
  const emptyMsg = document.getElementById("tf-empty-msg");
  listEl.innerHTML = "";
  emptyMsg.style.display = "none";

  let outfits = TF_OUTFITS.slice();
  if (filterType !== "all") {
    outfits = outfits.filter(o => o.type === filterType);
  }

  const scored = outfits
    .map(o => ({ outfit: o, score: tfScoreOutfit(o, profile) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) {
    emptyMsg.style.display = "block";
    return;
  }

  scored.forEach(item => {
    const o = item.outfit;
    const card = document.createElement("div");
    card.className = "tf-card";

    const imgHtml = `
      <div class="tf-card-img" style="background: ${o.gradient};"></div>
    `;

    card.innerHTML = `
      ${imgHtml}
      <div class="tf-card-type">${o.type}</div>
      <h3 class="tf-card-name">${o.name}</h3>
      <p class="tf-card-desc">${o.description}</p>
      <p class="tf-card-line"><strong>Best for shapes:</strong> ${o.shapes.join(", ")}</p>
      <p class="tf-card-line"><strong>Colour ideas:</strong> ${o.colorTags.join(", ")}</p>
      <p class="tf-card-line"><strong>Tip:</strong> ${o.tips}</p>
    `;

    listEl.appendChild(card);
  });
}

// --- init ---

document.addEventListener("DOMContentLoaded", () => {
  const profile = tfGetProfile();
  let currentFilter = "all";

  const backBtn = document.getElementById("tf-back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.history.back();
    });
  }

  const chips = document.querySelectorAll(".tf-chip");
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("tf-chip-active"));
      chip.classList.add("tf-chip-active");
      currentFilter = chip.getAttribute("data-type") || "all";
      tfRender(profile, currentFilter);
    });
  });

  tfRender(profile, currentFilter);
});

