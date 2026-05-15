document.addEventListener("DOMContentLoaded", () => {
  const ADMIN_PASSWORD = "9454";
  const COMMISSION_RATE = 0.25;

  const tours = [
    {
      id: "sea",
      name: "Sea to Sky Gondola",
      image: "/sea.jpg",
      price: 150,
      desc: "Experience breathtaking mountain, ocean, and sky views.",
      links: {
        2: "https://buy.stripe.com/test_3cI28rdgM4pn2vVcau3ZK01",
        3: "https://buy.stripe.com/test_4gM3cv90w6xv1rRfmG3ZK04",
        4: "https://buy.stripe.com/test_9B67sL1y47Bz8Uj6Qa3ZK07"
      }
    },
    {
      id: "grouse",
      name: "Grouse Mountain",
      image: "/grouse.jpg",
      price: 100,
      desc: "Discover Vancouver from above with wildlife and city views.",
      links: {
        2: "https://buy.stripe.com/test_fZu5kDdgM5tr3zZ3DY3ZK02",
        3: "https://buy.stripe.com/test_28E7sL1y47Bz5I7dey3ZK05",
        4: "https://buy.stripe.com/test_cNicN5b8Ef410nN5M63ZK08"
      }
    },
    {
      id: "whistler",
      name: "Whistler Adventure",
      image: "/whistler.jpg",
      price: 190,
      addonPrice: 250,
      desc: "Luxury day trip through the Sea to Sky Highway to Whistler.",
      links: {
        2: "https://buy.stripe.com/test_00w00jb8EcVT8Uj5M63ZK03",
        3: "https://buy.stripe.com/test_3cIbJ1b8EcVTb2reiC3ZK0b",
        4: "https://buy.stripe.com/test_00w00j5Ok5tr5I7cau3ZK09"
      },
      addonLinks: {
        2: "https://buy.stripe.com/test_dRmeVddgMf414E3fmG3ZK00",
        3: "https://buy.stripe.com/test_eVqdR9ccI7Bz2vVa2m3ZK06",
        4: "https://buy.stripe.com/test_aFa4gz2C81db7QfgqK3ZK0a"
      }
    }
  ];

  const giftCards = [
    { amount: 100, label: "$100 Gift Card" },
    { amount: 200, label: "$200 Gift Card" },
    { amount: 300, label: "$300 Gift Card" }
  ];

  const giftCardLink = "#"; // بعداً لینک Stripe گیفت کارت را اینجا می‌گذاریم

  function calc(base, guests) {
    const original = base * guests;
    const rate = guests === 3 ? 0.08 : guests >= 4 ? 0.15 : 0;
    const discount = original * rate;
    return { original, discount, final: original - discount };
  }

  function getOrders() {
    return JSON.parse(localStorage.getItem("vpj_orders") || "[]");
  }

  function setOrders(orders) {
    localStorage.setItem("vpj_orders", JSON.stringify(orders));
  }

  function getAgents() {
    return JSON.parse(localStorage.getItem("vpj_agents") || "[]");
  }

  function setAgents(agents) {
    localStorage.setItem("vpj_agents", JSON.stringify(agents));
  }

  function saveOrder(order) {
    const orders = getOrders();
    orders.push(order);
    setOrders(orders);
  }

  document.body.innerHTML = `
    <header style="padding:22px 8%;background:#071d35;color:white;font-weight:800;">
      VANCOUVER <span style="color:#d4a017;">PEAK JOURNEY</span>
    </header>

    <section style="background:linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.55)),url('/hero.jpg') center/cover;min-height:420px;color:white;display:flex;align-items:center;padding:60px 8%;">
      <div>
        <p style="color:#d4a017;font-weight:800;">EXPLORE. EXPERIENCE. REMEMBER.</p>
        <h1 style="font-size:60px;margin:0;">Vancouver Peak Journey</h1>
        <p style="font-size:20px;">Premium Vancouver attraction booking.</p>
      </div>
    </section>

    <section style="padding:60px 8%;background:#f4f4f4;">
      <h2 style="text-align:center;font-size:42px;">Choose Your Peak Experience</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:28px;">
        ${tours.map(t => `
          <div style="background:white;border-radius:20px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,.08);">
            <img src="${t.image}" style="width:100%;height:230px;object-fit:cover;">
            <div style="padding:24px;">
              <h3>${t.name}</h3>
              <p>${t.desc}</p>
              <h3 style="color:#b88700;">From $${t.price}/person ${t.id==="whistler" ? "<br><small>+ Sea to Sky Add-On = $250/person</small>" : ""}</h3>

              <label>Guests</label>
              <select id="${t.id}-guests" style="width:100%;padding:12px;margin:8px 0;">
                <option value="2">2 Guests</option>
                <option value="3">3 Guests - 8% Off</option>
                <option value="4">4 Guests - 15% Off</option>
              </select>

              ${t.id==="whistler" ? `<label><input type="checkbox" id="whistler-addon"> Add Sea to Sky Upgrade</label><br>` : ""}

              <label>Date</label>
              <input type="date" id="${t.id}-date" style="width:100%;padding:12px;margin:8px 0;">

              <label>Time</label>
              <select id="${t.id}-time" style="width:100%;padding:12px;margin:8px 0;">
                <option value="">Select time</option>
                <option>9:00 AM</option>
                <option>12:00 PM</option>
                <option>3:00 PM</option>
              </select>

              <label>Agent / Promo Code</label>
              <input id="${t.id}-agent" placeholder="Optional" style="width:100%;padding:12px;margin:8px 0;">

              <div id="${t.id}-price" style="font-weight:800;margin:14px 0;"></div>

              <button data-id="${t.id}" style="width:100%;padding:16px;background:#d4a017;border:none;border-radius:12px;font-weight:800;">
                Review Booking
              </button>
            </div>
          </div>
        `).join("")}
      </div>
    </section>

    <section style="padding:50px 8%;background:white;">
      <h2>Gift Cards</h2>
      <p>Give someone a Vancouver Peak Journey experience.</p>
      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        ${giftCards.map(g => `
          <button onclick="window.buyGiftCard(${g.amount})" style="padding:14px 22px;background:#071d35;color:white;border:none;border-radius:12px;font-weight:800;">
            ${g.label}
          </button>
        `).join("")}
      </div>
    </section>

    <section id="summary" style="display:none;padding:40px 8%;background:white;"></section>

    <button id="adminBtn" style="position:fixed;right:18px;bottom:18px;background:#071d35;color:white;border:none;border-radius:50px;padding:12px 18px;font-weight:800;z-index:999;">
      Admin
    </button>

    <section id="adminPanel" style="display:none;padding:30px 8%;background:#071d35;color:white;"></section>
  `;

  tours.forEach(t => {
    const guests = document.getElementById(`${t.id}-guests`);
    const priceBox = document.getElementById(`${t.id}-price`);

    function updatePrice() {
      let base = t.price;
      if (t.id === "whistler" && document.getElementById("whistler-addon")?.checked) base = t.addonPrice;
      const p = calc(base, Number(guests.value));
      priceBox.innerHTML = `Original: $${p.original.toFixed(2)}<br>Discount: -$${p.discount.toFixed(2)}<br>Final Total: <span style="color:#b88700;">$${p.final.toFixed(2)}</span>`;
    }

    guests.addEventListener("change", updatePrice);
    if (t.id === "whistler") document.getElementById("whistler-addon").addEventListener("change", updatePrice);
    updatePrice();
  });

  document.querySelectorAll("button[data-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      const t = tours.find(x => x.id === btn.dataset.id);
      const guests = Number(document.getElementById(`${t.id}-guests`).value);
      const date = document.getElementById(`${t.id}-date`).value;
      const time = document.getElementById(`${t.id}-time`).value;
      const agentCode = document.getElementById(`${t.id}-agent`).value.trim().toUpperCase();

      if (!date || !time) return alert("Please select date and time first.");

      let base = t.price;
      let link = t.links[guests];
      let label = t.name;

      if (t.id === "whistler" && document.getElementById("whistler-addon")?.checked) {
        base = t.addonPrice;
        link = t.addonLinks[guests];
        label = "Whistler + Sea to Sky Add-On";
      }

      const p = calc(base, guests);
      const commission = agentCode ? p.final * COMMISSION_RATE : 0;

      document.getElementById("summary").style.display = "block";
      document.getElementById("summary").innerHTML = `
        <h2>Booking Summary</h2>
        <p><b>Tour:</b> ${label}</p>
        <p><b>Guests:</b> ${guests}</p>
        <p><b>Date:</b> ${date}</p>
        <p><b>Time:</b> ${time}</p>
        <p><b>Agent Code:</b> ${agentCode || "None"}</p>
        <p><b>Final Total:</b> $${p.final.toFixed(2)}</p>

        <button id="payBtn" style="padding:16px 28px;background:#d4a017;border:none;border-radius:12px;font-weight:800;">
          Confirm & Go to Secure Payment
        </button>
      `;

      document.getElementById("payBtn").onclick = () => {
        saveOrder({
          tour: label,
          guests,
          date,
          time,
          total: p.final.toFixed(2),
          agentCode: agentCode || "",
          commission: commission.toFixed(2),
          created: new Date().toLocaleString()
        });
        window.location.href = link;
      };

      document.getElementById("summary").scrollIntoView({ behavior: "smooth" });
    });
  });

  function renderAdmin() {
    const panel = document.getElementById("adminPanel");
    const orders = getOrders();
    const agents = getAgents();

    panel.innerHTML = `
      <h2>Admin Dashboard</h2>

      <h3>Agent / Promo Codes</h3>
      <input id="newAgentCode" placeholder="Example: HOTEL01" style="padding:10px;border-radius:8px;border:none;">
      <input id="newAgentName" placeholder="Agent name" style="padding:10px;border-radius:8px;border:none;">
      <button onclick="window.addAgent()" style="padding:10px 14px;">Add Code</button>

      <div style="margin:15px 0;">
        ${agents.length === 0 ? "<p>No agent codes yet.</p>" : agents.map((a, i) => `
          <div style="background:white;color:black;padding:10px;border-radius:10px;margin:8px 0;">
            <b>${a.code}</b> - ${a.name}
            <button onclick="window.deleteAgent(${i})" style="float:right;background:#b00020;color:white;border:none;border-radius:8px;padding:6px 10px;">Delete</button>
          </div>
        `).join("")}
      </div>

      <h3>Orders</h3>
      <button onclick="window.exportCSV()" style="padding:10px 16px;margin-bottom:15px;">Export Excel / CSV</button>

      ${orders.length === 0 ? "<p>No orders yet.</p>" : orders.map((o, i) => `
        <div style="background:white;color:black;padding:15px;border-radius:12px;margin:10px 0;">
          <b>${o.tour}</b><br>
          Guests: ${o.guests}<br>
          Date: ${o.date}<br>
          Time: ${o.time}<br>
          Total: $${o.total}<br>
          Agent Code: ${o.agentCode || "None"}<br>
          Commission: $${o.commission || "0.00"}<br>
          Created: ${o.created}<br>
          <button onclick="window.deleteOrder(${i})" style="margin-top:10px;background:#b00020;color:white;border:none;padding:8px 12px;border-radius:8px;">Delete</button>
        </div>
      `).join("")}
    `;
  }

  window.addAgent = function() {
    const code = document.getElementById("newAgentCode").value.trim().toUpperCase();
    const name = document.getElementById("newAgentName").value.trim();

    if (!code) return alert("Enter agent code.");

    const agents = getAgents();
    agents.push({ code, name });
    setAgents(agents);
    renderAdmin();
  };

  window.deleteAgent = function(index) {
    const agents = getAgents();
    agents.splice(index, 1);
    setAgents(agents);
    renderAdmin();
  };

  window.deleteOrder = function(index) {
    const orders = getOrders();
    orders.splice(index, 1);
    setOrders(orders);
    renderAdmin();
  };

  window.exportCSV = function() {
    const orders = getOrders();
    const rows = [["Tour", "Guests", "Date", "Time", "Total", "Agent Code", "Commission", "Created"]];
    orders.forEach(o => rows.push([o.tour, o.guests, o.date, o.time, o.total, o.agentCode || "", o.commission || "0.00", o.created]));
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "vancouver-peak-orders.csv";
    a.click();
  };

  window.buyGiftCard = function(amount) {
    alert(`Gift Card $${amount} selected. Add Stripe gift card link later.`);
    if (giftCardLink !== "#") window.location.href = giftCardLink;
  };

  document.getElementById("adminBtn").onclick = () => {
    const pass = prompt("Admin password:");
    if (pass !== ADMIN_PASSWORD) return alert("Wrong password");
    const panel = document.getElementById("adminPanel");
    panel.style.display = panel.style.display === "none" ? "block" : "none";
    renderAdmin();
    panel.scrollIntoView({ behavior: "smooth" });
  };
});
