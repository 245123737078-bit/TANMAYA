// ✅ Shape Data
const SHAPE_DATA = {
  apple: {
    title: "Round / Apple Shape",
    summary: "Fuller midsection with slimmer legs and arms.",
    wear: [
      "Empire waist tops and dresses",
      "V-necklines",
      "Straight or slightly flared bottoms",
      "Light layers like open jackets"
    ],
    avoid: [
      "Tight fabrics around the stomach",
      "Low-rise bottoms",
      "Bulky tops around the waist"
    ]
  },

  pear: {
    title: "Pear / Triangle Shape",
    summary: "Wider hips and thighs than shoulders.",
    wear: [
      "A-line skirts and dresses",
      "Bright tops with darker bottoms",
      "Structured shoulders",
      "Straight pants"
    ],
    avoid: [
      "Super tight skinny bottoms",
      "Short tops ending at hips",
      "Heavy embellishment on bottoms"
    ]
  },

  inverted_triangle: {
    title: "Inverted Triangle Shape",
    summary: "Broader shoulders than hips.",
    wear: [
      "V-neck and wrap tops",
      "A-line skirts and flared pants",
      "Bottoms with prints or volume",
      "Clean shoulder lines"
    ],
    avoid: [
      "Big shoulder pads",
      "High necklines",
      "Tight slim bottoms"
    ]
  },

  rectangle: {
    title: "Rectangle / Athletic Shape",
    summary: "Shoulders, waist, and hips are similar width.",
    wear: [
      "Belts to create waist",
      "Peplum tops and ruffles",
      "Layered outfits",
      "High-waisted bottoms"
    ],
    avoid: [
      "Boxy outfits",
      "Oversized clothing",
      "Shapeless dresses"
    ]
  },

  hourglass: {
    title: "Hourglass Shape",
    summary: "Balanced shoulders and hips with defined waist.",
    wear: [
      "Wrap tops and dresses",
      "Fitted clothing (not tight)",
      "High-waisted skirts",
      "Tailored pieces"
    ],
    avoid: [
      "Boxy pieces that hide waist",
      "Bulky volume both top & bottom",
      "Overly tight clothing"
    ]
  }
};

// ✅ When a shape is clicked
function setActiveShape(shapeKey) {
  localStorage.setItem("tanmaya_bodyShape", shapeKey);

  document.querySelectorAll(".sg-shape-option").forEach(card => {
    card.classList.toggle("sg-active", card.dataset.shape === shapeKey);
  });

  const data = SHAPE_DATA[shapeKey];

  document.getElementById("sg-detail-title").textContent = data.title;
  document.getElementById("sg-detail-summary").textContent = data.summary;

  document.getElementById("sg-detail-wear").innerHTML =
    data.wear.map(item => `<li>${item}</li>`).join("");

  document.getElementById("sg-detail-avoid").innerHTML =
    data.avoid.map(item => `<li>${item}</li>`).join("");
}

// ✅ Page Loaded
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".sg-shape-option").forEach(card => {
    card.addEventListener("click", () => {
      setActiveShape(card.dataset.shape);
    });
  });

  // ✅ Load previous selection if saved
  const saved = localStorage.getItem("tanmaya_bodyShape");
  if (saved && SHAPE_DATA[saved]) {
    setActiveShape(saved);
  }

  // ✅ Back Button
  document.getElementById("sg-back-btn").addEventListener("click", () => {
    window.history.back();
  });
});
