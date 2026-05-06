document.addEventListener("input", function () {
  const guestCount = document.getElementById("guestCount");
  const confirmBtn = document.getElementById("confirmBtn");
  const summaryBox = document.getElementById("summaryBox");

  if (!guestCount || !confirmBtn || !summaryBox) return;

  const g = Number(guestCount.value || 1);

  if (g < 2) {
    summaryBox.innerHTML = "Minimum booking is 2 guests.";
    confirmBtn.disabled = true;
  }
});
