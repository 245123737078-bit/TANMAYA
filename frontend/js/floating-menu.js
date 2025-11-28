// frontend/js/floating-menu.js

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("floating-toggle");
  const menu = document.getElementById("floating-menu");

  // open / close floating menu
  if (toggleBtn && menu) {
    toggleBtn.addEventListener("click", () => {
      menu.classList.toggle("open");
    });
  }

  // ---- MENU ITEMS ----
  const modernWearLink  = document.getElementById("fm-modernwear");
  const colorSenseLink  = document.getElementById("fm-colorsense");
  const shapeGuideLink  = document.getElementById("fm-shapeguide");
  const eventStylesLink = document.getElementById("fm-eventstyles");
  const hueMatcherLink  = document.getElementById("fm-huematcher");

  // IMPORTANT:
  // We only use file names like "eventstyles.html".
  // Your http-server is already serving the frontend folder.

  if (modernWearLink) {
    modernWearLink.addEventListener("click", () => {
      window.location.href = "modernwear.html";
    });
  }

  if (colorSenseLink) {
    colorSenseLink.addEventListener("click", () => {
      window.location.href = "coloranalysis.html";
    });
  }

  if (shapeGuideLink) {
    shapeGuideLink.addEventListener("click", () => {
      window.location.href = "bodyshape.html";
    });
  }

  if (eventStylesLink) {
    eventStylesLink.addEventListener("click", () => {
      // 👇 THIS is the important one
      window.location.href = "eventstyles.html";
    });
  }

  if (hueMatcherLink) {
    hueMatcherLink.addEventListener("click", () => {
      window.location.href = "suggestion.html"; // or your HueMatcher page
    });
  }
});
