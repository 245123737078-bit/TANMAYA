// Read saved profile
function getProfile() {
  return {
    shape: (localStorage.getItem("tanmaya_bodyShape") || "hourglass").toLowerCase(),
    undertone: (localStorage.getItem("tanmaya_undertone") || "neutral").toLowerCase()
  };
}

// Color palette based on undertone
function getPalette(undertone) {
  if (undertone === "warm") return ["#b91c1c", "#d97706", "#166534"];
  if (undertone === "cool") return ["#2563eb", "#4f46e5", "#db2777"];
  return ["#9ca3af", "#fbbf24", "#0ea5e9"]; // neutral
}

// Event data
const EVENTS = {
  wedding: {
    traditional: "Lehenga or silk saree with waist definition.",
    modern: "Elegant dress or jumpsuit with soft shine."
  },
  party: {
    traditional: "Sharara or pre-draped saree.",
    modern: "Bodycon or co-ord set."
  },
  office: {
    traditional: "Straight kurta with subtle prints.",
    modern: "Blazer + trousers."
  },
  college: {
    traditional: "Cotton kurti with jeans.",
    modern: "Jeans + t-shirt + overshirt."
  },
  casual: {
    traditional: "Short kurti + palazzos.",
    modern: "Hoodie and denim."
  },
  festival: {
    traditional: "Light saree or kurta set.",
    modern: "Ethnic jacket + basics."
  }
};

// Render cards
function render(eventKey) {
  const profile = getProfile();
  const palette = getPalette(profile.undertone);
  const data = EVENTS[eventKey];
  const cards = document.getElementById("es-cards");

  cards.innerHTML = `
    <div class="card">
      <h3>Traditional</h3>
      <p>${data.traditional}</p>
      <div class="palette">${palette.map(c => `<span class="dot" style="background:${c}"></span>`).join("")}</div>
    </div>
    <div class="card">
      <h3>Modern</h3>
      <p>${data.modern}</p>
      <div class="palette">${palette.map(c => `<span class="dot" style="background:${c}"></span>`).join("")}</div>
    </div>
  `;
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  render("wedding");

  document.querySelectorAll(".event-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".event-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      render(btn.dataset.event);
    });
  });
});
