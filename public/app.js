/* =====================================================
   VANCOUVER PEAK JOURNEY — FINAL MASTER APP.JS
   FULL REBUILD
   Admin Code: 9454
   WhatsApp: +1 778 681 9140
   Includes:
   - Name / Email / Phone required
   - Stripe links 2/3/4 guests
   - Whistler add-on
   - Admin dashboard
   - Delete orders
   - CSV export
   - Promo / Rep code
   - Gift card
   - WhatsApp support
   - Orders saved after Stripe success
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     CONFIG
  ========================= */
  const ADMIN_CODE = "9454";
  const WHATSAPP_LINK = "https://wa.me/17786819140";

  const STRIPE_LINKS = {
    sea: {
      2: "https://buy.stripe.com/test_3cI28rdgM4pn2vVcau3ZK01",
      3: "https://buy.stripe.com/test_4gM3cv90w6xv1rRfmG3ZK04",
      4: "https://buy.stripe.com/test_9B67sL1y47Bz8Uj6Qa3ZK07"
    },
    grouse: {
      2: "https://buy.stripe.com/test_fZu5kDdgM5tr3zZ3DY3ZK02",
      3: "https://buy.stripe.com/test_28E7sL1y47Bz5I7dey3ZK05",
      4: "https://buy.stripe.com/test_cNicN5b8Ef410nN5M63ZK08"
    },
    whistler: {
      2: "https://buy.stripe.com/test_00w00jb8EcVT8Uj5M63ZK03",
      3: "https://buy.stripe.com/test_3cIbJ1b8EcVTb2reiC3ZK0b",
      4: "https://buy.stripe.com/test_00w00j5Ok5tr5I7cau3ZK09"
    },
    addon: {
      2: "https://buy.stripe.com/test_dRmeVddgMf414E3fmG3ZK00",
      3: "https://buy.stripe.com/test_eVqdR9ccI7Bz2vVa2m3ZK06",
      4: "https://buy.stripe.com/test_aFa4gz2C81db7QfgqK3ZK0a"
    }
  };

  const tours = [
    {
      id: "sea",
      name: "Sea to Sky Gondola",
      image: "/sea.jpg",
      basePrice: 150
    },
    {
      id: "grouse",
      name: "Grouse Mountain",
      image: "/grouse.jpg",
      basePrice: 100
    },
    {
      id: "whistler",
      name: "Whistler Adventure",
      image: "/whistler.jpg",
      basePrice: 190
    }
  ];

  /* =========================
     STORAGE
  ========================= */
  function getOrders() {
    return JSON.parse(localStorage.getItem("vpj_orders")) || [];
  }

  function saveOrders(orders) {
    localStorage.setItem("vpj_orders", JSON.stringify(orders));
  }

  /* =========================
     CSV EXPORT
  ========================= */
  function exportCSV() {
    const orders = getOrders();

    let csv =
      "Date,Name,Email,Phone,Tour,Guests,Amount,RepCode,GiftCard\n";

    orders.forEach(order => {
      csv += `"${order.date}","${order.name}","${order.email}","${order.phone}","${order.tour}","${order.guests}","${order.amount}","${order.repCode || ""}","${order.giftCard || ""}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "vancouver_peak_orders.csv";
    link.click();
  }

  /* =========================
     STRIPE SUCCESS PAGE
  ========================= */
  if (window.location.pathname.includes("success")) {
    const pending = JSON.parse(localStorage.getItem("pending_order"));

    if (pending) {
      const orders = getOrders();

      orders.push({
        ...pending,
        date: new Date().toLocaleString()
      });

      saveOrders(orders);
      localStorage.removeItem("pending_order");
    }

    document.body.innerHTML = `
      <div style="font-family:Arial;text-align:center;padding:60px;">
        <h1>Payment Successful ✅</h1>
        <p>Your Vancouver Peak Journey booking is confirmed.</p>
        <p>We will contact you shortly via email / phone.</p>
        <a href="/" style="
          display:inline-block;
          margin-top:20px;
          padding:14px 24px;
          background:black;
          color:white;
          text-decoration:none;
          border-radius:8px;
        ">Return Home</a>
      </div>
    `;
    return;
  }

  /* =========================
     CANCEL PAGE
  ========================= */
  if (window.location.pathname.includes("cancel")) {
    document.body.innerHTML = `
      <div style="font-family:Arial;text-align:center;padding:60px;">
        <h1>Payment Cancelled</h1>
        <p>Your booking was not completed.</p>
        <a href="/" style="
          display:inline-block;
          margin-top:20px;
          padding:14px 24px;
          background:black;
          color:white;
          text-decoration:none;
          border-radius:8px;
        ">Return Home</a>
      </div>
    `;
    return;
  }

  /* =========================
     WHATSAPP BUTTON
  ========================= */
  const whatsappBtn = document.createElement("a");
  whatsappBtn.href = WHATSAPP_LINK;
  whatsappBtn.target = "_blank";
  whatsappBtn.innerText = "WhatsApp";
  whatsappBtn.style.cssText = `
    position:fixed;
    right:20px;
    bottom:90px;
    background:#25D366;
    color:white;
    padding:14px 20px;
    border-radius:30px;
    text-decoration:none;
    font-weight:bold;
    z-index:9999;
  `;
  document.body.appendChild(whatsappBtn);

  /* =========================
     ADMIN BUTTON
  ========================= */
  const adminBtn = document.createElement("button");
  adminBtn.innerText = "Admin";
  adminBtn.style.cssText = `
    position:fixed;
    right:20px;
    bottom:20px;
    background:black;
    color:white;
    padding:12px 18px;
    border:none;
    border-radius:30px;
    cursor:pointer;
    z-index:9999;
  `;
  document.body.appendChild(adminBtn);

  adminBtn.onclick = () => {
    const code = prompt("Enter Admin Code:");
    if (code !== ADMIN_CODE) {
      alert("Wrong Admin Code");
      return;
    }

    const orders = getOrders();

    let html = `
      <div style="padding:20px;font-family:Arial;">
        <h1>Admin Dashboard</h1>
        <button onclick="window.exportCSVGlobal()" style="padding:10px 16px;margin-bottom:20px;">Export CSV</button>

        <table border="1" cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;">
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Tour</th>
            <th>Guests</th>
            <th>Amount</th>
            <th>Rep Code</th>
            <th>Gift Card</th>
            <th>Delete</th>
          </tr>
    `;

    orders.forEach((order, index) => {
      html += `
        <tr>
          <td>${order.date}</td>
          <td>${order.name}</td>
          <td>${order.email}</td>
          <td>${order.phone}</td>
          <td>${order.tour}</td>
          <td>${order.guests}</td>
          <td>$${order.amount}</td>
          <td>${order.repCode || ""}</td>
          <td>${order.giftCard || ""}</td>
          <td><button onclick="window.deleteOrder(${index})">X</button></td>
        </tr>
      `;
    });

    html += `
        </table>
      </div>
    `;

    document.body.innerHTML = html;

    window.deleteOrder = function(index) {
      const updated = getOrders();
      updated.splice(index, 1);
      saveOrders(updated);
      location.reload();
    };

    window.exportCSVGlobal = exportCSV;
  };

  /* =========================
     TOUR CONTAINER
  ========================= */
  const container = document.getElementById("tours");
  if (!container) return;

  container.innerHTML = "";

  /* =========================
     TOUR CARDS
  ========================= */
  tours.forEach(tour => {

    const card = document.createElement("div");
    card.style.cssText = `
      border:1px solid #ddd;
      border-radius:14px;
      padding:20px;
      margin:20px;
      width:320px;
      display:inline-block;
      vertical-align:top;
      background:white;
    `;

    card.innerHTML = `
      <img src="${tour.image}" style="
        width:100%;
        height:220px;
        object-fit:cover;
        border-radius:10px;
      ">

      <h2>${tour.name}</h2>

      <h3 style="color:#d4a017;">
        From $${tour.basePrice}/person
      </h3>

      <div style="margin-top:10px;">
        <input type="text" placeholder="Full Name" class="customer-name" style="width:100%;padding:10px;">
      </div>

      <div style="margin-top:10px;">
        <input type="email" placeholder="Email Address" class="customer-email" style="width:100%;padding:10px;">
      </div>

      <div style="margin-top:10px;">
        <input type="tel" placeholder="Phone / WhatsApp Number" class="customer-phone" style="width:100%;padding:10px;">
      </div>

      <div style="margin-top:10px;">
        <label>Guests:</label>
        <select class="guest-select" style="width:100%;padding:10px;">
          <option value="2">2 Guests</option>
          <option value="3">3 Guests</option>
          <option value="4">4 Guests</option>
        </select>
      </div>

      ${
        tour.id === "whistler"
          ? `
        <div style="margin-top:10px;">
          <label>
            <input type="checkbox" class="addon-check">
            Add Sea to Sky (+$60/person)
          </label>
        </div>
      `
          : ""
      }

      <div style="margin-top:10px;">
        <input type="text" placeholder="Rep / Promo Code" class="rep-code" style="width:100%;padding:10px;">
      </div>

      <div style="margin-top:10px;">
        <input type="text" placeholder="Gift Card Code" class="gift-card" style="width:100%;padding:10px;">
      </div>

      <p class="total-price" style="
        font-weight:bold;
        margin-top:15px;
        font-size:20px;
      "></p>

      <button class="checkout-btn" style="
        width:100%;
        padding:16px;
        background:#d4a017;
        border:none;
        border-radius:10px;
        font-weight:bold;
        cursor:pointer;
      ">
        Continue to Secure Checkout
      </button>
    `;

    const guestSelect = card.querySelector(".guest-select");
    const addonCheck = card.querySelector(".addon-check");
    const totalPrice = card.querySelector(".total-price");
    const checkoutBtn = card.querySelector(".checkout-btn");

    function updatePrice() {
      const guests = parseInt(guestSelect.value);
      let total = tour.basePrice * guests;

      if (
        tour.id === "whistler" &&
        addonCheck &&
        addonCheck.checked
      ) {
        total += 60 * guests;
      }

      totalPrice.innerText = `Final Total: $${total}`;
    }

    guestSelect.addEventListener("change", updatePrice);

    if (addonCheck) {
      addonCheck.addEventListener("change", updatePrice);
    }

    updatePrice();

    checkoutBtn.onclick = () => {

      const customerName = card.querySelector(".customer-name").value.trim();
      const customerEmail = card.querySelector(".customer-email").value.trim();
      const customerPhone = card.querySelector(".customer-phone").value.trim();
      const repCode = card.querySelector(".rep-code").value.trim();
      const giftCard = card.querySelector(".gift-card").value.trim();

      if (!customerName || !customerEmail || !customerPhone) {
        alert("Please enter Full Name, Email, and Phone Number.");
        return;
      }

      const guests = parseInt(guestSelect.value);

      let stripeLink = STRIPE_LINKS[tour.id][guests];

      if (
        tour.id === "whistler" &&
        addonCheck &&
        addonCheck.checked
      ) {
        stripeLink = STRIPE_LINKS.addon[guests];
      }

      const amount = totalPrice.innerText.replace("Final Total: $", "");

      localStorage.setItem(
        "pending_order",
        JSON.stringify({
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          tour: tour.name,
          guests: guests,
          amount: amount,
          repCode: repCode,
          giftCard: giftCard
        })
      );

      window.location.href = stripeLink;
    };

    container.appendChild(card);
  });

});
