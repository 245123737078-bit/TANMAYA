// frontend/js/colorsense-ui.js

// Main helper: call this from your existing colorAnalysis.js
// Example from your code: handleColorSenseResult(tone, undertone, bestColors);
function handleColorSenseResult(tone, undertone, bestColors) {
  // 1) Save for other TANMAYA features
  try {
    localStorage.setItem("tanmaya_skinTone", tone || "");
    localStorage.setItem("tanmaya_undertone", undertone || "");
    localStorage.setItem(
      "tanmaya_bestColors",
      JSON.stringify(bestColors || [])
    );
  } catch (e) {
    console.warn("ColorSense: could not save to localStorage", e);
  }

  // 2) Update the ColorSense UI panel on coloranalysis.html
  const toneSpan = document.getElementById("cs-skinTone");
  const undertoneSpan = document.getElementById("cs-undertone");
  const paletteDiv = document.getElementById("cs-palette");

  if (toneSpan) toneSpan.textContent = tone || "–";
  if (undertoneSpan) undertoneSpan.textContent = undertone || "–";

  if (!paletteDiv) return;

  paletteDiv.innerHTML = "";

  if (!bestColors || !bestColors.length) {
    paletteDiv.innerHTML =
      "<span style='opacity:0.7;font-size:0.85rem;'>No colours detected yet.</span>";
    return;
  }

  bestColors.forEach(color => {
    const swatch = document.createElement("div");
    swatch.style.width = "38px";
    swatch.style.height = "38px";
    swatch.style.borderRadius = "10px";
    swatch.style.border = "1px solid rgba(255,255,255,0.25)";
    swatch.style.boxShadow = "0 0 10px rgba(0,0,0,0.6)";
    swatch.style.background = color;   // e.g. "#d4af37" or "teal"
    swatch.title = color;
    paletteDiv.appendChild(swatch);
  });
}

// When the page loads, if there is already saved data, show it again
document.addEventListener("DOMContentLoaded", () => {
  const savedTone = localStorage.getItem("tanmaya_skinTone") || "";
  const savedUnder = localStorage.getItem("tanmaya_undertone") || "";
  let savedPalette = [];

  try {
    savedPalette = JSON.parse(localStorage.getItem("tanmaya_bestColors") || "[]");
  } catch (e) {
    savedPalette = [];
  }

  if (savedTone || savedUnder || (savedPalette && savedPalette.length)) {
    handleColorSenseResult(savedTone, savedUnder, savedPalette);
  }
});
