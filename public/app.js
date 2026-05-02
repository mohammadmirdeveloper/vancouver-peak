const TOUR_NAMES = {
  sea: "Sea to Sky Gondola",
  grouse: "Grouse Mountain",
  whistler: "Whistler Village"
};

const SLOTS = ["Morning — 9:00 AM", "Noon — 1:00 PM", "Evening — 5:00 PM"];

let settings = {
  prices: { sea: 125, grouse: 100, whistler: 125, addon: 100 },
  images: {}
};

let adminPassword = "123456";
let currentTour = "sea";
let selectedSlot = "";
let bookedSlots = [];

async function api(url, opts = {}) {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": adminPassword
    },
    ...opts
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
}

function bg(url) {
  return url ? url('${url}') : "";
}

async function loadSettings() {
  try {
    settings = await api("/api/settings");
  } catch (e) {
    console.log("settings load error", e);
  }

  applySettings();
}

function applySettings() {
  const p = settings.prices || {};
  const i = settings.images || {};

  if (cardSea) cardSea.textContent = p.sea || 125;
  if (cardGrouse) cardGrouse.textContent = p.grouse || 100;
  if (cardWhistler) cardWhistler.textContent = p.whistler || 125;
  if (cardAddon) cardAddon.textContent = p.addon || 100;
  if (addonText) addonText.textContent = p.addon || 100;

  if (adminSea) adminSea.value = p.sea || 125;
  if (adminGrouse) adminGrouse.value = p.grouse || 100;
  if (adminWhistler) adminWhistler.value = p.whistler || 125;
  if (adminAddon) adminAddon.value = p.addon || 100;

  if (hero) hero.style.setProperty("--hero", bg(i.hero));
  if (imgSea) imgSea.style.backgroundImage = bg(i.sea);
  if (imgGrouse) imgGrouse.style.backgroundImage = bg(i.grouse);
  if (imgWhistler) imgWhistler.style.backgroundImage = bg(i.whistler);
}

async function openBooking(tour) {
  currentTour = tour;
  selectedSlot = "";

  modalTitle.textContent = "Book " + TOUR_NAMES[tour];
  modalSubtitle.textContent = "$" + (settings.prices?.[tour] || 0) + " / person";

  addonWrap.style.display = tour === "whistler" ? "block" : "none";
  addonCheck.checked = false;

  tourDate.min = todayISO();
  ticketBox.style.display = "none";

  bookingModal.classList.add("active");

  await loadAvailability();
  calculate();
}

async function loadAvailability() {
  const d = tourDate.value;

  if (!d) {
    bookedSlots = [];
    renderSlots();
    return;
  }

  try {
    const data = await api(`/api/availability?tour=${currentTour}&date=${d}`);
    bookedSlots = data.bookedSlots || [];
  } catch (e) {
    bookedSlots = [];
    console.log("availability error", e);
  }

  renderSlots();
}

function renderSlots() {
  slotGrid.innerHTML = "";

  SLOTS.forEach(slot => {
    const booked = bookedSlots.includes(slot);

    const div = document.createElement("div");
    div.className =
      "slot-card" +
      (booked ? " booked" : "") +
      (selectedSlot === slot && !booked ? " selected" : "");

    const parts = slot.split(" — ");

    div.innerHTML =
      parts[0] +
      "<small>" +
      parts[1] +
      "</small>" +
      (booked ? "<small>Booked</small>" : "");

    if (!booked) {
      div.onclick = () => {
        selectedSlot = slot;
        renderSlots();
        calculate();
      };
    }

    slotGrid.appendChild(div);
  });
}

function calculate() {
  const p = settings.prices || {};
  const d = tourDate.value;
  const g = Number(guestCount.value || 1);

  const add = currentTour === "whistler" && addonCheck.checked;

  const base = Number(p[currentTour] || 0);
  const addonPrice = add ? Number(p.addon || 0) : 0;
  const pp = base + addonPrice;
  const total = pp * g;

  summaryBox.innerHTML = `
    <b>${TOUR_NAMES[currentTour]}</b><br>
    Date: ${d || "Select date"}<br>
    Time: ${selectedSlot || "Select an available time"}<br>
    Guests: ${g}<br>
    ${add ? "Add-on: Sea to Sky<br>" : ""}
    Price/person: $${pp}<br>
    <b>Total: $${total}</b>
  `;

  confirmBtn.disabled = !(d && selectedSlot);
}

async function confirmBooking() {
  const body = {
    tour: currentTour,
    name: customerName.value.trim(),
    email: customerEmail.value.trim(),
    phone: customerPhone.value.trim(),
    date: tourDate.value,
    slot: selectedSlot,
    pickup: pickupLocation.value.trim(),
    guests: Number(guestCount.value || 1),
    addon: currentTour === "whistler" && addonCheck.checked
  };

  if (!body.name⠵⠵⠟⠟⠵⠺⠵⠺⠺⠺⠟⠺⠟⠟⠞!body.phone⠺⠟⠺⠞⠺⠞⠵⠺⠵⠞⠞⠟⠟⠟!body.slot) {
    alert("Fill all required fields and choose a slot.");
    return;
  }

  try {
    const data = await api("/api/orders", {
      method: "POST",
      body: JSON.stringify(body)
    });

    const order = data.order⠺⠞⠞⠵⠟⠺⠟⠟{};

    const ticketId =
      order.ticket_id ||
      data.ticket_id ||
      "VPJ-" + Math.floor(100000 + Math.random() * 900000);

    ticketBox.style.display = "block";

    ticketBox.innerHTML = `
      <div class="ticket-id">${ticketId}</div>
      <b>Tour:</b> ${order.tour_name || TOUR_NAMES[currentTour]}<br>
      <b>Name:</b> ${order.customer_name || body.name}<br>
      <b>Email:</b> ${order.email || body.email}<br>
      <b>Phone:</b> ${order.phone || body.phone}<br>
      <b>Date:</b> ${order.tour_date || body.date}<br>
      <b>Time:</b> ${order.time_slot || body.slot}<br>
      <b>Guests:</b> ${order.guests || body.guests}<br>
      <b>Pickup:</b> ${order.pickup⠞⠟⠞⠟⠵⠞⠞⠟⠺⠺⠵⠵⠺⠵⠟"To be confirmed"}<br>
      <b>Total:</b> $${order.total || "Pending"}
    `;

    await loadAvailability();

  } catch (e) {
    alert(e.message || "Booking failed.");
    await loadAvailability();
  }
}

async function adminLogin() {
  adminPassword = "123456";
  adminPanel.classList.add("active");
  adminPanel.scrollIntoView({ behavior: "smooth" });

  try {
    await renderOrders();
  } catch (e) {
    console.log(e);
  }
}

async function savePrices() {
  const prices = {
    sea: Number(adminSea.value),
    grouse: Number(adminGrouse.value),
    whistler: Number(adminWhistler.value),
    addon: Number(adminAddon.value)
  };

  await api("/api/settings", {
    method: "POST",
    body: JSON.stringify({ prices })
  });

  await loadSettings();
  alert("Prices saved.");
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1]);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

async function uploadOne(input, key, images) {
  const file = input.files[0];
  if (!file) return;

  const base64 = await fileToBase64(file);

  const data = await api("/api/upload-image", {
    method: "POST",
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      base64
    })
  });

  images[key] = data.url;
}

async function uploadImages() {
  const images = { ...(settings.images || {}) };

  await uploadOne(heroFile, "hero", images);
  await uploadOne(seaFile, "sea", images);
  await uploadOne(grouseFile, "grouse", images);
  await uploadOne(whistlerFile, "whistler", images);

  await api("/api/settings", {
    method: "POST",
    body: JSON.stringify({ images })
  });

  await loadSettings();
  alert("Images uploaded.");
}

async function renderOrders() {
  const d = filterDate.value;
  const data = await api("/api/orders" + (d ? ?date=${d} : ""));

  ordersBody.innerHTML =
    (data.orders || [])
      .map(o => `
        <tr>
          <td>${o.ticket_id || ""}</td>
          <td>${o.tour_name || ""}</td>
          <td>${o.tour_date || ""}</td>
          <td>${o.time_slot || ""}</td>
          <td>${o.customer_name || ""}</td>
          <td>${o.phone || ""}</td>
          <td>$${o.total || ""}</td>
        </tr>
      `)
      .join("") || "<tr><td colspan='7'>No orders</td></tr>";
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadSettings();

  document.querySelectorAll("[data-tour]").forEach(b => {
    b.onclick = () => openBooking(b.dataset.tour);
  });

  closeBtn.onclick = () => bookingModal.classList.
    remove("active");

  tourDate.onchange = async () => {
    selectedSlot = "";
    await loadAvailability();
    calculate();
  };

  guestCount.onchange = calculate;
  addonCheck.onchange = calculate;
  confirmBtn.onclick = confirmBooking;
  adminBtn.onclick = adminLogin;
  savePricesBtn.onclick = savePrices;
  uploadImagesBtn.onclick = uploadImages;
  refreshOrdersBtn.onclick = renderOrders;
  filterDate.onchange = renderOrders;
});
