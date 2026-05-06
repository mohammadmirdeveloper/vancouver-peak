function enforcePricingRules() {
  const guestCount = document.getElementById("guestCount");
  const confirmBtn = document.getElementById("confirmBtn");
  const summaryBox = document.getElementById("summaryBox");
  const modalTitle = document.getElementById("modalTitle");

  if (!guestCount || !confirmBtn || !summaryBox || !modalTitle) return;

  const g = Number(guestCount.value || 1);
  const tourText = modalTitle.textContent.toLowerCase();

  let basePrice = 150;

  if (tourText.includes("grouse")) basePrice = 140;
  if (tourText.includes("whistler")) basePrice = 190;
  if (tourText.includes("sea")) basePrice = 150;

  if (g < 2) {
    summaryBox.innerHTML = "<b>Minimum booking is 2 guests.</b>";
    confirmBtn.disabled = true;
    confirmBtn.style.opacity = "0.5";
    return;
  }

  let total = 0;

  if (g >= 1) total += basePrice;
  if (g >= 2) total += basePrice;
  if (g >= 3) total += basePrice * 0.92;
  if (g >= 4) total += basePrice * 0.85;
  if (g > 4) total += (g - 4) * basePrice;

  summaryBox.innerHTML =
    "<b>Group Pricing Applied</b><br>" +
    "Base price/person: $" + basePrice + "<br>" +
    "Guest 1: $" + basePrice.toFixed(2) + "<br>" +
    "Guest 2: $" + basePrice.toFixed(2) + "<br>" +
    (g >= 3 ? "Guest 3: $" + (basePrice * 0.92).toFixed(2) + " <small>(8% off)</small><br>" : "") +
    (g >= 4 ? "Guest 4: $" + (basePrice * 0.85).toFixed(2) + " <small>(15% off)</small><br>" : "") +
    (g > 4 ? "Extra guests: $" + ((g - 4) * basePrice).toFixed(2) + "<br>" : "") +
    "<b>Total: $" + total.toFixed(2) + "</b>";

  confirmBtn.disabled = false;
  confirmBtn.style.opacity = "1";
}

setInterval(enforcePricingRules, 300);
