// ====== DOM ELEMENTS ======
const traditionalBtn = document.getElementById('traditionalBtn');
const westernBtn = document.getElementById('westernBtn');
const backBtn = document.getElementById('backBtn');
const themeSelection = document.getElementById('themeSelection');
const overlay = document.getElementById('overlay');

// ====== HELPER FUNCTION ======
function showColorAnalysis() {
  const analysisBox = document.createElement('div');
  analysisBox.classList.add('analysis-box');
  analysisBox.innerHTML = `
    <h2>🎨 AI Skin-Tone & Color Analysis</h2>
    <p>Answer a few quick questions and we’ll suggest your best outfit colors!</p>
    <button id="startAnalysis" class="luxury-btn">Start Analysis</button>
  `;
  document.body.appendChild(analysisBox);

  backBtn.style.display = 'block';
  themeSelection.style.display = 'none';
}

// ====== EVENT LISTENERS ======
if (traditionalBtn) {
  traditionalBtn.addEventListener('click', () => {
    document.body.style.background = "url('images/traditional-bg.png') no-repeat center center/cover";
    overlay.style.background = "rgba(80, 40, 10, 0.5)";
    showColorAnalysis();
  });
}

if (westernBtn) {
  westernBtn.addEventListener('click', () => {
    document.body.style.background = "url('images/western-bg.png') no-repeat center center/cover";
    overlay.style.background = "rgba(40, 10, 80, 0.5)";
    showColorAnalysis();
  });
}

if (backBtn) {
  backBtn.addEventListener('click', () => {
    document.querySelector('.analysis-box')?.remove();
    backBtn.style.display = 'none';
    themeSelection.style.display = 'block';
    document.body.style.background = '#000';
  });
}
