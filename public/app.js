document.addEventListener("DOMContentLoaded", () => {
  const ADMIN_CODE = "9454";
  const WHATSAPP_LINK =
    "https://wa.me/17786819140?text=Hi%20Vancouver%20Peaks%20Journey%2C%20I%20need%20help%20with%20my%20booking.";
const SUPABASE_URL = "https://fmzyvslflsngnorpmuju.supabase.co";
const SUPABASE_KEY = "sb_publishable_RTM95bE519jtHrELvHSwrQ_FuTR7Ehg";
  
  const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  .toLocaleDateString("en-CA");

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

  function getOrders() {
    return JSON.parse(localStorage.getItem("vpj_orders") || "[]");
  }

  function saveOrders(orders) {
    localStorage.setItem("vpj_orders", JSON.stringify(orders));
  }
  async function saveBookingToSupabase(order) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal"
    },
    body: JSON.stringify({
      name: order.name,
      email: order.email,
      phone: order.phone,
      tour: order.tour,
      guests: order.guests,
      tour_date: order.date,
      tour_time: order.time,
      total: order.total,
      agent_code: order.agentCode,
      agent_name: order.agentName,
      commission: order.commission,
      gift_card: order.giftCard,
      status: "paid"
    })
  });

  if (!response.ok) {
    console.error("Supabase save failed", await response.text());
  }
}

  function getAgents() {
    return JSON.parse(localStorage.getItem("vpj_agents") || "[]");
  }

  function saveAgents(agents) {
    localStorage.setItem("vpj_agents", JSON.stringify(agents));
  }

  function getGiftCards() {
    return JSON.parse(localStorage.getItem("vpj_giftcards") || "[]");
  }

  function saveGiftCards(cards) {
    localStorage.setItem("vpj_giftcards", JSON.stringify(cards));
  }

  function calc(price, guests) {
    const original = price * guests;
    const rate = guests === 3 ? 0.08 : guests === 4 ? 0.15 : 0;
    const discount = original * rate;
    const final = original - discount;
    return { original, discount, final };
  }
if (location.pathname.includes("success")) {
  const pending = JSON.parse(localStorage.getItem("pending_order") || "null");

  let ticket = pending || {};

  if (pending) {
    const orders = getOrders();

    const confirmedOrder = {
      ...pending,
      status: "Paid",
      created: new Date().toLocaleString()
    };

    orders.push(confirmedOrder);
    saveBookingToSupabase(confirmedOrder);
    saveOrders(orders);

    ticket = confirmedOrder;

    localStorage.removeItem("pending_order");
  }

  document.body.innerHTML = `
    <div style="font-family:Arial;max-width:700px;margin:40px auto;padding:35px;border:2px solid #d4a017;border-radius:18px;text-align:center;">
      <h2 style="color:#d4a017;">Vancouver Peaks Journey Ticket</h2>
      <h1>Booking Confirmed ✅</h1>

      <hr>

      <p><b>Name:</b> ${ticket.name || ""}</p>
      <p><b>Email:</b> ${ticket.email || ""}</p>
      <p><b>Phone:</b> ${ticket.phone || ""}</p>
      <p><b>Tour:</b> ${ticket.tour || ""}</p>
      <p><b>Guests:</b> ${ticket.guests || ""}</p>
      <p><b>Date:</b> ${ticket.date || ""}</p>
      <p><b>Time:</b> ${ticket.time || ""}</p>
      <p><b>Total Paid:</b> $${ticket.total || ""}</p>
      <p><b>Status:</b> Paid</p>

      <hr>

      <p>We will contact you shortly via email or WhatsApp.</p>

      <button onclick="window.print()" style="padding:14px 24px;background:#d4a017;color:black;border:none;border-radius:10px;font-weight:bold;">
        Download / Save Ticket as PDF
      </button>

      <br><br>

      <a href="/" style="display:inline-block;padding:14px 24px;background:#071d35;color:white;text-decoration:none;border-radius:10px;">
        Return Home
      </a>
    </div>
  `;

  return;
}
  

  document.body.innerHTML = `
    <header style="padding:22px 8%;background:#071d35;color:white;font-weight:800;">
      VANCOUVER <span style="color:#d4a017;">PEAKS JOURNEY</span>
    </header>

    <section style="background:linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.6)),url('/hero.jpg') center/cover;min-height:420px;color:white;display:flex;align-items:center;padding:60px 8%;">
      <div>
        <p style="color:#d4a017;font-weight:800;">EXPLORE. EXPERIENCE. REMEMBER.</p>
        <h1 style="font-size:58px;margin:0;">Vancouver Peaks Journey</h1>
        <p style="font-size:20px;">Experience Vancouver with my personal recommendation and create one of your most unforgettable journeys.</p>
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

   

    <section id="adminPanel" style="display:none;padding:35px 8%;background:#071d35;color:white;"></section>
  `;

  const grid = document.getElementById("tourGrid");

 tours.forEach(t => {
  const card = document.createElement("div");

  card.style.cssText =
    "background:white;border-radius:20px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,.08);";

  card.innerHTML = `
    <img src="${t.image}" style="width:100%;height:240px;object-fit:cover;">

    <div style="padding:24px;">
      <h3 style="font-size:30px;margin-bottom:10px;">
        ${t.name}
      </h3>

      <p style="color:#555;line-height:1.6;">
        ${t.desc}
      </p>

      <h3 style="color:#b88700;margin-top:18px;">
        From $${t.price}/person
      </h3>

      ${
        t.id === "whistler"
          ? `<p style="color:#555;">+ Sea to Sky Add-On Available</p>`
          : ""
      }

      <a href="${t.id === 'sea' ? '/sea-to-sky.html' : '/' + t.id + '.html'}"
        style="
          display:inline-block;
          margin-top:20px;
          padding:14px 22px;
          background:#071d35;
          color:white;
          text-decoration:none;
          border-radius:12px;
          font-weight:700;
        ">
        View Details & Book
      </a>
    </div>
  `;

  grid.appendChild(card);
});

  function renderAdmin() {
    const orders = getOrders();
    const agents = getAgents();
    const giftCards = getGiftCards();
    const panel = document.getElementById("adminPanel");

    panel.innerHTML = `
      <h2>Admin Dashboard</h2>

      <h3>Agent / Promo Codes</h3>
      <input id="newAgentCode" placeholder="Code e.g. HOTELA" style="padding:10px;margin:5px;width:200px;">
      <input id="newAgentName" placeholder="Agent name" style="padding:10px;margin:5px;width:200px;">
      <button id="addAgent" style="padding:10px 16px;">Add Agent</button>

      <div style="margin:15px 0;">
        ${agents.length === 0 ? "<p>No agent codes yet.</p>" : agents.map((a, i) => `
          <div style="background:white;color:black;padding:12px;border-radius:10px;margin:8px 0;">
            <b>${a.code}</b> — ${a.name}
            <button data-agent-delete="${i}" style="float:right;background:#b00020;color:white;border:none;border-radius:8px;padding:6px 10px;">Delete</button>
          </div>
        `).join("")}
      </div>

      <h3>Gift Card Codes</h3>
      <input id="newGiftCode" placeholder="Gift code e.g. GIFT100" style="padding:10px;margin:5px;width:200px;">
      <input id="newGiftAmount" placeholder="Amount e.g. 100" type="number" style="padding:10px;margin:5px;width:160px;">
      <button id="addGift" style="padding:10px 16px;">Add Gift Card</button>

      <div style="margin:15px 0;">
        ${giftCards.length === 0 ? "<p>No gift cards yet.</p>" : giftCards.map((g, i) => `
          <div style="background:white;color:black;padding:12px;border-radius:10px;margin:8px 0;">
            <b>${g.code}</b> — $${g.amount}
            <button data-gift-delete="${i}" style="float:right;background:#b00020;color:white;border:none;border-radius:8px;padding:6px 10px;">Delete</button>
          </div>
        `).join("")}
      </div>

      <h3>Orders</h3>
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
          Agent Name: ${o.agentName || "None"}<br>
          Commission: $${o.commission || "0.00"}<br>
          Gift Card: ${o.giftCard || "None"}<br>
          Gift Amount: ${o.giftAmount ? "$" + o.giftAmount : "None"}<br>
          Status: ${o.status || "Paid"}<br>
          Created: ${o.created || ""}<br>
          <button data-delete="${i}" style="margin-top:10px;background:#b00020;color:white;border:none;padding:8px 12px;border-radius:8px;">Delete</button>
        </div>
      `).join("")}
    `;

    document.getElementById("addAgent").onclick = () => {
      const code = document.getElementById("newAgentCode").value.trim().toUpperCase();
      const name = document.getElementById("newAgentName").value.trim();
      if (!code) return alert("Enter agent code.");

      const list = getAgents();
      list.push({ code, name });
      saveAgents(list);
      renderAdmin();
    };

    document.getElementById("addGift").onclick = () => {
      const code = document.getElementById("newGiftCode").value.trim().toUpperCase();
      const amount = document.getElementById("newGiftAmount").value.trim();
      if (!code || !amount) return alert("Enter gift code and amount.");

      const list = getGiftCards();
      list.push({ code, amount });
      saveGiftCards(list);
      renderAdmin();
    };

    panel.querySelectorAll("[data-agent-delete]").forEach(btn => {
      btn.onclick = () => {
        const list = getAgents();
        list.splice(Number(btn.dataset.agentDelete), 1);
        saveAgents(list);
        renderAdmin();
      };
    });

    panel.querySelectorAll("[data-gift-delete]").forEach(btn => {
      btn.onclick = () => {
        const list = getGiftCards();
        list.splice(Number(btn.dataset.giftDelete), 1);
        saveGiftCards(list);
        renderAdmin();
      };
    });

    panel.querySelectorAll("[data-delete]").forEach(btn => {
      btn.onclick = () => {
        const orders = getOrders();
        orders.splice(Number(btn.dataset.delete), 1);
        saveOrders(orders);
        renderAdmin();
      };
    });

    document.getElementById("exportCSV").onclick = () => {
      const rows = [["Name","Email","Phone","Tour","Guests","Date","Time","Total","Agent Code","Agent Name","Commission","Gift Card","Gift Amount","Status","Created"]];
      getOrders().forEach(o => rows.push([
        o.name,o.email,o.phone,o.tour,o.guests,o.date,o.time,o.total,o.agentCode || "",o.agentName || "",o.commission || "0.00",o.giftCard || "",o.giftAmount || "",o.status || "Paid",o.created || ""
      ]));

      const csv = rows.map(r => r.map(x => `"${x}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "vancouver-peaks-orders.csv";
      a.click();
    };
  }

 if (location.hash === "#admin") {
  setTimeout(() => {
    const pass = prompt("Admin password:");
    if (pass !== ADMIN_CODE) {
      alert("Wrong password");
      return;
    }

    const panel = document.getElementById("adminPanel");
    panel.style.display = "block";
    renderAdmin();
    panel.scrollIntoView({ behavior: "smooth" });
  }, 300);
}
});
