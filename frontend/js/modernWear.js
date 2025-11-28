// frontend/js/modernWear.js

// --- Modern outfit database ---
const MW_LOOKS = [
  {
    id: "mw_highwaist_wideleg",
    name: "High-Waist Wide-Leg Jeans + Fitted Top",
    type: "Casual / Street",
    shapes: ["pear", "hourglass", "rectangle"],
    tones: ["fair", "medium", "deep"],
    undertones: ["warm", "cool", "neutral"],
    gradient: "linear-gradient(135deg, #111827 0%, #1f2937 40%, #4b5563 100%)",
    colors: ["#1f2937", "#f97316", "#fbbf24"],
    desc: "Balances hips and legs while defining the waist. Works great with tucked-in tees or crop tops.",
    tip: "Add chunky sneakers and a minimal belt to finish the look."
  },
  {
    id: "mw_a_line_midi",
    name: "A-Line Midi Dress",
    type: "Day Out / Brunch",
    shapes: ["pear", "apple", "hourglass"],
    tones: ["fair", "medium"],
    undertones: ["cool", "neutral"],
    gradient: "linear-gradient(135deg, #e0bbff 0%, #f9a8d4 45%, #bfdbfe 100%)",
    colors: ["#f9a8d4", "#e0bbff", "#bfdbfe"],
    desc: "Soft flare from waist down creates movement and flatters the midsection without clinging.",
    tip: "Pair with block heels and a small crossbody bag."
  },
  {
    id: "mw_bodycon_blazer",
    name: "Bodycon Dress + Structured Blazer",
    type: "Party / Evening",
    shapes: ["hourglass", "rectangle"],
    tones: ["medium", "deep"],
    undertones: ["warm", "neutral"],
    gradient: "linear-gradient(135deg, #111827 0%, #4b5563 40%, #b91c1c 100%)",
    colors: ["#b91c1c", "#facc15", "#1f2937"],
    desc: "Shows off curves while the blazer adds structure and polish.",
    tip: "Choose a blazer matching your undertone – warm gold or cool silver buttons."
  },
  {
    id: "mw_oversized_shirt",
    name: "Oversized Shirt + Straight Jeans",
    type: "College / Casual",
    shapes: ["rectangle", "apple", "inverted_triangle"],
    tones: ["fair", "medium", "deep"],
    undertones: ["warm", "cool", "neutral"],
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #22c55e 100%)",
    colors: ["#22c55e", "#e5e7eb", "#1e293b"],
    desc: "Straight leg keeps proportions balanced while the shirt skims over the midsection.",
    tip: "Half-tuck the front of the shirt to avoid looking too boxy."
  },
  {
    id: "mw_cropped_jacket_dress",
    name: "Cropped Jacket + Slip Dress",
    type: "Date Night",
    shapes: ["pear", "rectangle"],
    tones: ["fair", "medium"],
    undertones: ["cool", "neutral"],
    gradient: "linear-gradient(135deg, #020617 0%, #4c1d95 45%, #ec4899 100%)",
    colors: ["#4c1d95", "#ec4899", "#e5e7eb"],
    desc: "Slip dress elongates the body while the cropped jacket highlights the waist.",
    tip: "Use delicate jewellery and strappy sandals to keep it soft."
  },
  {
    id: "mw_monochrome_set",
    name: "Monochrome Co-Ord Set",
    type: "Smart Casual",
    shapes: ["apple", "rectangle", "inverted_triangle"],
    tones: ["medium", "deep"],
    undertones: ["warm", "cool", "neutral"],
    gradient: "linear-gradient(135deg, #111827 0%, #4b5563 40%, #9ca3af 100%)",
    colors: ["#4b5563", "#9ca3af", "#e5e7eb"],
    desc: "One solid colour head-to-toe elongates the frame and looks instantly put-together.",
    tip: "Match your bag/shoes in a contrasting accent colour from your palette."
  },
  {
    id: "mw_blazer_trouser",
    name: "Tailored Blazer + Trousers",
    type: "Office / Formal",
    shapes: ["rectangle", "inverted_triangle", "hourglass"],
    tones: ["fair", "medium", "deep"],
    undertones: ["cool", "neutral"],
    gradient: "linear-gradient(135deg, #020617 0%, #0f172a 40%, #3b82f6 100%)",
    colors: ["#3b82f6", "#e5e7eb", "#0f172a"],
    desc: "Sharp lines that create structure around shoulders and waist for a powerful silhouette.",
    tip: "Pick cool navy or charcoal if your undertone leans cool."
  },
  {
    id: "mw_cargo_crop",
    name: "Cargo Pants + Cropped Tee",
    type: "Street / Chill",
    shapes: ["pear", "hourglass", "rectangle"],
    tones: ["medium", "deep"],
    undertones: ["warm", "neutral"],
    gradient: "linear-gradient(135deg, #111827 0%, #166534 40%, #f97316 100%)",
    colors: ["#166534", "#f97316", "#facc15"],
    desc: "Volume on the legs with a defined waist keeps proportions fun and balanced.",
    tip: "Use sneakers and a cap to keep it relaxed and playful."
  }
];

// --- Helpers to read saved profile ---
function mwSafeParseArray(str) {
  if (!str) return [];
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mwGetProfile() {
  return {
    shape: (localStorage.getItem("tanmaya_bodyShape") || "").toLowerCase(),
    tone: (localStorage.getItem("tanmaya_skinTone") || "").toLowerCase(),
    undertone: (localStorage.getItem("tanmaya_undertone") || "").toLowerCase(),
    bestColors: mwSafeParseArray(localStorage.getItem("tanmaya_bestColors"))
  };
}

function mwNormalize(str) {
  return (str || "").toLowerCase().trim();
}

// --- Scoring: shape + tone + undertone + palette ---
function mwScoreLook(look, profile) {
  let score = 0;

  if (profile.shape && look.shapes.includes(profile.shape)) score += 3;
  if (profile.tone && look.tones.map(mwNormalize).includes(profile.tone)) score += 2;
  if (profile.undertone && look.undertones.map(mwNormalize).includes(profile.undertone)) score += 3;

  const best = (profile.bestColors || []).map(mwNormalize);
  const tags = (look.colors || []).map(mwNormalize);

  const colorHit = best.some(b =>
    tags.some(t => t.includes(b) || b.includes(t))
  );
  if (colorHit) score += 3;

  return score;
}

// --- Rendering big cards ---
function mwRenderLooks(profile, startIndex = 0, count = 3) {
  const container = document.getElementById("mw-card-container");
  if (!container) return;

  // score and sort looks
  const scored = MW_LOOKS
    .map(l => ({ look: l, score: mwScoreLook(l, profile) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const finalLooks = scored.length ? scored.map(x => x.look) : MW_LOOKS.slice();

  // cycle through array
  const slice = [];
  for (let i = 0; i < count; i++) {
    const idx = (startIndex + i) % finalLooks.length;
    slice.push(finalLooks[idx]);
  }

  container.innerHTML = "";

  slice.forEach(look => {
    const card = document.createElement("div");
    card.className = "mw-card";

    const colorDots = (look.colors || []).slice(0, 4).map(c => {
      return `<span class="mw-color-dot" style="background:${c};"></span>`;
    }).join("");

    card.innerHTML = `
      <div class="mw-visual" style="background:${look.gradient};"></div>
      <div style="font-size:0.75rem;opacity:0.8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:2px;">
        ${look.type}
      </div>
      <div class="mw-name">${look.name}</div>
      <div class="mw-desc">${look.desc}</div>
      <div class="mw-colors">${colorDots}</div>
      <div style="font-size:0.85rem;opacity:0.9;"><strong>Style tip:</strong> ${look.tip}</div>
    `;

    container.appendChild(card);
  });
}

// --- Init ---
document.addEventListener("DOMContentLoaded", () => {
  const profile = mwGetProfile();
  let offset = 0;

  // Back button
  const backBtn = document.getElementById("mw-back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.history.back();
    });
  }

  // First render
  mwRenderLooks(profile, offset);

  // Next look(s)
  const nextBtn = document.getElementById("mw-next-btn");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      offset = (offset + 3) % MW_LOOKS.length; // jump by 3 looks
      mwRenderLooks(profile, offset);
    });
  }
});
