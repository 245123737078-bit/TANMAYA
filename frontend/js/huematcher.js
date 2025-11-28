// frontend/js/huematcher.js

document.addEventListener("DOMContentLoaded", function () {

  // Every palette card
  var cards = document.getElementsByClassName("palette-card");

  // Add click effect + message
  for (var i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", function () {
      var combo = this.getAttribute("data-combo");
      alert("Great Pick! " + combo + " is a stylish and balanced outfit combo.");
    });
  }

  // Back button
  var backBtn = document.getElementById("back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", function () {
      window.history.back();
    });
  }

});
