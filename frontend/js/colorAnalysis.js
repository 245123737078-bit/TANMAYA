// frontend/js/colorAnalysis.js

// ---- Helpers to read colour from camera frame ----
function caAverageColorFromVideo(video) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const w = (canvas.width = video.videoWidth || 320);
  const h = (canvas.height = video.videoHeight || 240);

  ctx.drawImage(video, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;

  let r = 0, g = 0, b = 0;
  let count = 0;

  // sample every 10th pixel for speed
  for (let i = 0; i < data.length; i += 4 * 10) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }

  if (!count) return { r: 128, g: 128, b: 128 };

  return {
    r: Math.round(r / count),
    g: Math.round(g / count),
    b: Math.round(b / count)
  };
}

function caGuessTone({ r, g, b }) {
  const brightness = (r + g + b) / 3;
  if (brightness > 190) return "fair";
  if (brightness > 120) return "medium";
  return "deep";
}

function caGuessUndertone({ r, g, b }) {
  if (r > g + 10 && r > b + 10) return "warm";
  if (b > r + 10 && b > g + 10) return "cool";
  return "neutral";
}

function caPaletteFor(undertone, tone) {
  const t = tone || "medium";

  if (undertone === "warm") {
    return ["#d4af37", "#c27b48", "#8b4513", "#556b2f"]; // gold, copper, brown, olive
  }
  if (undertone === "cool") {
    return ["#4169e1", "#6a0dad", "#c71585", "#708090"]; // royal blue, plum, berry, grey
  }

  // neutral
  if (t === "fair") {
    return ["#f5deb3", "#d8bfd8", "#b0c4de", "#cd853f"];
  }
  if (t === "deep") {
    return ["#800020", "#2f4f4f", "#556b2f", "#daa520"];
  }

  return ["#cd7f32", "#4682b4", "#8fbc8f", "#ffdead"]; // bronze, steel blue, sage, light nude
}

// ---- Render + storage ----
function caRenderResult(tone, undertone, palette) {
  const toneSpan = document.getElementById("cs-skinTone");
  const undertoneSpan = document.getElementById("cs-undertone");
  const paletteDiv = document.getElementById("cs-palette");

  if (toneSpan) toneSpan.textContent = tone || "–";
  if (undertoneSpan) undertoneSpan.textContent = undertone || "–";

  if (!paletteDiv) return;

  paletteDiv.innerHTML = "";

  if (!palette || !palette.length) {
    paletteDiv.innerHTML =
      "<span style='opacity:0.7;font-size:0.85rem;'>No colours detected yet.</span>";
    return;
  }

  palette.forEach(color => {
    const swatch = document.createElement("div");
    swatch.className = "ca-swatch";
    swatch.style.background = color;
    swatch.title = color;
    paletteDiv.appendChild(swatch);
  });
}

function caSaveToStorage(tone, undertone, palette) {
  try {
    localStorage.setItem("tanmaya_skinTone", tone || "");
    localStorage.setItem("tanmaya_undertone", undertone || "");
    localStorage.setItem("tanmaya_bestColors", JSON.stringify(palette || []));
  } catch (e) {
    console.warn("Colour analysis: could not save to localStorage", e);
  }
}

// ---- Main camera + scan logic ----
document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("ca-video");
  const startBtn = document.getElementById("ca-start-btn");
  const scanBtn = document.getElementById("ca-scan-btn");
  const backBtn = document.getElementById("ca-back-btn");

  let stream = null;

  // Back button
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.history.back();
    });
  }

  // Restore previous saved result (if any)
  const savedTone = localStorage.getItem("tanmaya_skinTone") || "";
  const savedUnder = localStorage.getItem("tanmaya_undertone") || "";
  let savedPalette = [];
  try {
    savedPalette = JSON.parse(localStorage.getItem("tanmaya_bestColors") || "[]");
  } catch (e) {
    savedPalette = [];
  }
  if (savedTone || savedUnder || (savedPalette && savedPalette.length)) {
    caRenderResult(savedTone, savedUnder, savedPalette);
  }

  // Start camera
  if (startBtn) {
    startBtn.addEventListener("click", async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        await video.play();

        startBtn.disabled = true;
        scanBtn.disabled = false;
      } catch (err) {
        console.error("Could not access camera:", err);
        alert("Unable to access camera. Please check permissions and use localhost or HTTPS.");
      }
    });
  }

  // Scan tone
  if (scanBtn) {
    scanBtn.addEventListener("click", () => {
      if (!video || !video.videoWidth) {
        alert("Camera is not ready yet. Please wait a moment and try again.");
        return;
      }

      const avg = caAverageColorFromVideo(video);
      const tone = caGuessTone(avg);
      const undertone = caGuessUndertone(avg);
      const palette = caPaletteFor(undertone, tone);

      caRenderResult(tone, undertone, palette);
      caSaveToStorage(tone, undertone, palette);
    });
  }
});
