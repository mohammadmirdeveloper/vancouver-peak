document.addEventListener("DOMContentLoaded", () => {
  const ADMIN_CODE = "9454";
  const WHATSAPP_NUMBER = "17786819140";
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Vancouver%20Peak%20Journey%2C%20I%20need%20help%20with%20my%20booking.`;

  const today = new Date().toISOString().split("T")[0];

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
      price: 150,
      desc: "Panoramic mountain, ocean, and sky views."
    },
    {
      id: "grouse",
      name: "Grouse Mountain",
      image: "/grouse.jpg",
      price: 100,
      desc: "City, ocean, forest, and mountain views."
    },
    {
      id: "whistler",
      name: "Whistler Adventure",
      image: "/whistler.jpg",
      price: 190,
      addonPrice: 250,
      desc: "Luxury day trip through the Sea to Sky Highway."
    }
  ];

  function calc(price, guests) {
    const original = price * guests;
    const rate = guests === 3 ? 0.08 : guests === 4 ? 0.15 : 0;
    const discount = original * rate;
    return {
      original,
      discount,
      final: original - discount
    };
  }

  function getOrders() {
    return JSON.parse(localStorage.getItem("vpj_orders") || "[]");
  }

  function saveOrders(orders) {
    localStorage.setItem("vpj_orders", JSON.stringify(orders));
  }

  if (location.pathname.includes("success")) {
    const pending = JSON.parse(localStorage.getItem("pending_order") || "null");

    if (pending) {
      const orders = getOrders();
      orders.push({
        ...pending,
        status: "Paid",
        created: new Date().toLocaleString()
      });
      saveOrders(orders);
      localStorage.removeItem("pending_order");
    }

    document.body.innerHTML = `
      <div style="font-family:Arial;text-align:center;padding:60px;">
        <h1>Payment Successful ✅</h1>
        <p>Your booking is confirmed.</p>
        <p>We will contact you shortly.</p>
        <a href="/" style="display:inline-block;margin-top:20px;padding:14px 24px;background:#071d35;color:white;text-decoration:none;border-radius:10px;">Return Home</a>
      </div>
    `;
    return;
  }

  document.body.innerHTML = `
    <header style="padding:22px 8%;background:#071d35;color:white;font-weight:800;">
      VANCOUVER <span style="color:#d4a017;">PEAK JOURNEY</span>
    </header>

    <section style="background:linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.6)),url('/hero.jpg') center/cover;min-height:420px;color:white;display:flex;align-items:center;padding:60px 8%;">
      <div>
        <p style="color:#d4a017;font-weight:800;">EXPLORE. EXPERIENCE. REMEMBER.</p>
        <h1 style="font-size:58px;margin:0;">Vancouver Peak Journey</h1>
        <p style="font-size:20px;">Premium Vancouver attraction booking.</p>
      </div>
    </section>

    <section id="tours" style="padding:60px 8%;background:#f4f4f4;">
      <h2 style="text-align:center;font-size:42px;">Choose Your Peak Experience</h2>
      <div id="tourGrid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:28px;"></div>
    </section>

    <section id="summary" style="display:none;padding:40px 8%;background:white;"></section>

    <a href="${WHATSAPP_LINK}" target="_blank" style="position:fixed;right:18px;bottom:82px;background:#25D366;color:white;padding:13px 18px;border-radius:30px;text-decoration:none;font-weight:800;z-index:9999;">
      WhatsApp
    </a>

    <button id="adminBtn" style="position:fixed;right:18px;bottom:22px;background:#071d35;color:white;border:none;border-radius:30px;padding:13px 18px;font-weight:800;z-index:9999;">
      Admin
    </button>

    <section id="adminPanel" style="display:none;padding:35px 8%;background:#071d35;color:white;"></section>
  `;

  const grid = document.getElementById("tourGrid");

  tours.forEach(t => {
    const card = document.createElement("div");
    card.style.cssText = "background:white;border-radius:20px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,.08);";

    card.innerHTML = `
      <img src="${t.image}" style="width:100%;height:230px;object-fit:cover;">
      <div style="padding:24px;">
        <h3 style="font-size:28px;">${t.name}</h3>
        <p>${t.desc}</p>
        <h3 style="color:#b88700;">From $${t.price}/person ${t.id === "whistler" ? "<br><small>+ Sea to Sky Add-On = $250/person</small>" : ""}</h3>

        <input class="name" placeholder="Full Name *" style="width:100%;padding:12px;margin:7px 0;">
        <input class="email" type="email" placeholder="Email Address *" style="width:100%;padding:12px;margin:7px 0;">
        <input class="phone" type="tel" placeholder="Phone / WhatsApp Number *" style="width:100%;padding:12px;margin:7px 0;">

        <label>Guests</label>
        <select class="guests" style="width:100%;padding:12px;margin:7px 0;">
          <option value="2">2 Guests</option>
          <option value="3">3 Guests - 8% Off</option>
          <option value="4">4 Guests - 15% Off</option>
        </select>

        ${t.id === "whistler" ? `
          <label style="display:block;margin:10px 0;">
            <input type="checkbox" class="addon"> Add Sea to Sky Upgrade
          </label>
        ` : ""}

        <label>Date</label>
        <input class="date" type="date" min="${today}" style="width:100%;padding:12px;margin:7px 0;">

        <label>Time</label>
        <select class="time" style="width:100%;padding:12px;margin:7px 0;">
          <option value="">Select time</option>
          <option>9:00 AM</option>
          <option>12:00 PM</option>
          <option>3:00 PM</option>
        </select>

        <input class="agent" placeholder="Agent / Promo Code" style="width:100%;padding:12px;margin:7px 0;">
        <input class="gift" placeholder="Gift Card Code" style="width:100%;padding:12px;margin:7px 0;">

        <div class="price" style="font-weight:800;margin:14px 0;line-height:1.7;"></div>

        <button class="review" style="width:100%;padding:16px;background:#d4a017;border:none;border-radius:12px;font-weight:800;font-size:16px;">
          Review Booking
        </button>
      </div>
    `;

    grid.appendChild(card);

    const guestsEl = card.querySelector(".guests");
    const addonEl = card.querySelector(".addon");
    const priceEl = card.querySelector(".price");

    function updatePrice() {
      let base = t.price;
      if (t.id === "whistler" && addonEl && addonEl.checked) base = t.addonPrice;

      const p = calc(base, Number(guestsEl.value));
      priceEl.innerHTML = `
        Original: $${p.original.toFixed(2)}<br>
        Discount: -$${p.discount.toFixed(2)}<br>
        Final Total: <span style="color:#b88700;">$${p.final.toFixed(2)}</span>
      `;
    }

    guestsEl.addEventListener("change", updatePrice);
    if (addonEl) addonEl.addEventListener("change", updatePrice);
    updatePrice();

    card.querySelector(".review").onclick = () => {
      const name = card.querySelector(".name").value.trim();
      const email = card.querySelector(".email").value.trim();
      const phone = card.querySelector(".phone").value.trim();
      const guests = Number(guestsEl.value);
      const date = card.querySelector(".date").value;
      const time = card.querySelector(".time").value;
      const agent = card.querySelector(".agent").value.trim().toUpperCase();
      const gift = card.querySelector(".gift").value.trim();

      if (!name || !email || !phone) {
        alert("Please enter Full Name, Email, and Phone Number.");
        return;
      }

      if (!date || !time) {
        alert("Please select Date and Time.");
        return;
      }

      let base = t.price;
      let tourName = t.name;
      let link = STRIPE_LINKS[t.id][guests];

      if (t.id === "whistler" && addonEl && addonEl.checked) {
        base = t.addonPrice;
        tourName = "Whistler + Sea to Sky Add-On";
        link = STRIPE_LINKS.addon[guests];
      }

      const p = calc(base, guests);

      const summary = document.getElementById("summary");
      summary.style.display = "block";
      summary.innerHTML = `
        <h2>Booking Summary</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Tour:</b> ${tourName}</p>
        <p><b>Guests:</b> ${guests}</p>
        <p><b>Date:</b> ${date}</p>
        <p><b>Time:</b> ${time}</p>
        <p><b>Agent Code:</b> ${agent || "None"}</p>
        <p><b>Gift Card:</b> ${gift || "None"}</p>
        <p><b>Final Total:</b> $${p.final.toFixed(2)}</p>

        <button id="payNow" style="padding:16px 28px;background:#d4a017;border:none;border-radius:12px;font-weight:800;font-size:17px;">
          Confirm & Go to Secure Payment
        </button>
      `;

      document.getElementById("payNow").onclick = () => {
        localStorage.setItem("pending_order", JSON.stringify({
          name,
          email,
          phone,
          tour: tourName,
          guests,
          date,
          time,
          total: p.final.toFixed(2),
          agentCode: agent,
          giftCard: gift,
          commission: agent ? (p.final * 0.25).toFixed(2) : "0.00"
        }));

        window.location.href = link;
      };

      summary.scrollIntoView({ behavior: "smooth" });
    };
  });

  function renderAdmin() {
    const orders = getOrders();
    const panel = document.getElementById("adminPanel");

    panel.innerHTML = `
      <h2>Admin Dashboard</h2>
      <button id="exportCSV" style="padding:10px 16px;margin-bottom:15px;">Export CSV / Excel</button>
      ${orders.length === 0 ? "<p>No orders yet.</p>" : orders.map((o, i) => `
        <div style="background:white;color:black;padding:15px;border-radius:12px;margin:10px 0;">
          <b>${o.tour}</b><br>
          Name: ${o.name}<br>
          Email: ${o.email}<br>
          Phone: ${o.phone}<br>
          Guests: ${o.guests}<br>
          Date: ${o.date}<br>
          Time: ${o.time}<br>
          Total: $${o.total}<br>
          Agent Code: ${o.agentCode || "None"}<br>
          Commission: $${o.commission || "0.00"}<br>
          Gift Card: ${o.giftCard || "None"}<br>
          Status: ${o.status || "Paid"}<br>
          Created: ${o.created || ""}<br>
          <button data-delete="${i}" style="margin-top:10px;background:#b00020;color:white;border:none;padding:8px 12px;border-radius:8px;">Delete</button>
        </div>
      `).join("")}
    `;

    document.getElementById("exportCSV").onclick = () => {
      const rows = [["Name","Email","Phone","Tour","Guests","Date","Time","Total","Agent Code","Commission","Gift Card","Status","Created"]];
      getOrders().forEach(o => rows.push([
        o.name,o.email,o.phone,o.tour,o.guests,o.date,o.time,o.total,o.agentCode || "",o.commission || "0.00",o.giftCard || "",o.status || "Paid",o.created || ""
      ]));

      const csv = rows.map(r => r.map(x => `"${x}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "vancouver-peak-orders.csv";
      a.click();
    };

    panel.querySelectorAll("[data-delete]").forEach(btn => {
      btn.onclick = () => {
        const orders = getOrders();
        orders.splice(Number(btn.dataset.delete), 1);
        saveOrders(orders);
        renderAdmin();
      };
    });
  }

  document.getElementById("adminBtn").onclick = () => {
    const pass = prompt("Admin password:");
    if (pass !== ADMIN_CODE) return alert("Wrong password");

    const panel = document.getElementById("adminPanel");
    panel.style.display = panel.style.display === "none" ? "block" : "none";
    renderAdmin();
    panel.scrollIntoView({ behavior: "smooth" });
  };
});
