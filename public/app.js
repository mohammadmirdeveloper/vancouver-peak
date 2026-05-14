document.addEventListener("DOMContentLoaded", () => {
  const tours = [
    {
      id: "sea",
      name: "Sea to Sky Gondola",
      image: "/sea.jpg",
      price: 150,
      stripe: "https://buy.stripe.com/test_3cI28rdgM4pn2vVcau3ZK01",
      desc: "Experience breathtaking mountain, ocean, and sky views."
    },
    {
      id: "grouse",
      name: "Grouse Mountain",
      image: "/grouse.jpg",
      price: 100,
      stripe: "https://buy.stripe.com/test_fZu5kDdgM5tr3zZ3DY3ZK02",
      desc: "Discover Vancouver from above with wildlife and city views."
    },
    {
      id: "whistler",
      name: "Whistler Adventure",
      image: "/whistler.jpg",
      price: 190,
      seaAddOn: 60,
      stripe: "https://buy.stripe.com/test_00w00jb8EcVT8Uj5M63ZK03",
      desc: "Luxury day trip through the Sea to Sky Highway to Whistler."
    }
  ];

  function priceCalc(basePrice, guests) {
    const original = basePrice * guests;
    let discountRate = 0;

    if (guests === 3) discountRate = 0.08;
    if (guests >= 4) discountRate = 0.15;

    const discount = original * discountRate;
    return {
      original,
      discount,
      final: original - discount
    };
  }

  document.body.innerHTML = `
    <header style="padding:22px 8%;background:#071d35;color:white;font-weight:800;">
      VANCOUVER <span style="color:#d4a017;">PEAK JOURNEY</span>
    </header>

    <section style="
      background:linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.55)),url('/hero.jpg') center/cover;
      min-height:420px;color:white;display:flex;align-items:center;padding:60px 8%;
    ">
      <div>
        <p style="color:#d4a017;font-weight:800;">EXPLORE. EXPERIENCE. REMEMBER.</p>
        <h1 style="font-size:64px;margin:0;">Vancouver Peak Journey</h1>
        <p style="font-size:20px;">Premium Vancouver attraction booking.</p>
      </div>
    </section>

    <section style="padding:60px 8%;background:#f4f4f4;">
      <h2 style="text-align:center;font-size:42px;">Choose Your Peak Experience</h2>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:28px;">
        ${tours.map(t => `
          <div style="
            background:white;
            border-radius:20px;
            overflow:hidden;
            box-shadow:0 8px 24px rgba(0,0,0,.08);
          ">
            <img src="${t.image}" style="width:100%;height:230px;object-fit:cover;">

            <div style="padding:24px;">
              <h3 style="font-size:30px;">${t.name}</h3>
              <p>${t.desc}</p>

              <h3 style="color:#b88700;">
                From $${t.price}/person
                ${t.id === "whistler" ? `<br><span style="font-size:16px;color:#555;">+ Sea to Sky Add-On = $250/person</span>` : ""}
              </h3>

              <label>Guests</label>
              <select id="${t.id}-guests" style="width:100%;padding:12px;margin:8px 0;">
                <option value="2">2 Guests</option>
                <option value="3">3 Guests - 8% Off</option>
                <option value="4">4 Guests - 15% Off</option>
              </select>

              ${
                t.id === "whistler"
                  ? `
                <label style="display:flex;align-items:center;gap:8px;margin:10px 0;">
                  <input type="checkbox" id="whistler-addon">
                  Add Sea to Sky Gondola (+$60/person)
                </label>
              `
                  : ""
              }

              <label>Date</label>
              <input id="${t.id}-date" type="date" style="width:100%;padding:12px;margin:8px 0;">

              <label>Time</label>
              <select id="${t.id}-time" style="width:100%;padding:12px;margin:8px 0;">
                <option value="">Select time</option>
                <option>9:00 AM</option>
                <option>12:00 PM</option>
                <option>3:00 PM</option>
              </select>

              <div id="${t.id}-price" style="font-weight:800;margin:14px 0;"></div>

              <button data-id="${t.id}" style="
                width:100%;
                padding:16px;
                background:#d4a017;
                border:none;
                border-radius:12px;
                font-weight:800;
                font-size:16px;
                cursor:pointer;
              ">
                Review Booking
              </button>
            </div>
          </div>
        `).join("")}
      </div>
    </section>

    <section id="summary" style="display:none;padding:40px 8%;background:white;"></section>
  `;

  tours.forEach(t => {
    const guests = document.getElementById(`${t.id}-guests`);
    const priceBox = document.getElementById(`${t.id}-price`);

    function updatePrice() {
      let base = t.price;

      if (t.id === "whistler") {
        const addon = document.getElementById("whistler-addon");
        if (addon && addon.checked) {
          base += t.seaAddOn;
        }
      }

      const p = priceCalc(base, Number(guests.value));

      priceBox.innerHTML = `
        Original: $${p.original.toFixed(2)}<br>
        Discount: -$${p.discount.toFixed(2)}<br>
        Final Total: <span style="color:#b88700;">$${p.final.toFixed(2)}</span>
      `;
    }

    guests.addEventListener("change", updatePrice);

    if (t.id === "whistler") {
      const addon = document.getElementById("whistler-addon");
      if (addon) addon.addEventListener("change", updatePrice);
    }

    updatePrice();
  });

  document.querySelectorAll("button[data-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      const t = tours.find(x => x.id === btn.dataset.id);

      const guests = Number(document.getElementById(`${t.id}-guests`).value);
      const date = document.getElementById(`${t.id}-date`).value;
      const time = document.getElementById(`${t.id}-time`).value;

      if (!date || !time) {
        alert("Please select date and time first.");
        return;
      }

      let base = t.price;
      let addonText = "";

      if (t.id === "whistler") {
        const addon = document.getElementById("whistler-addon");
        if (addon && addon.checked) {
          base += t.seaAddOn;
          addonText = " + Sea to Sky Add-On";
        }
      }

      const p = priceCalc(base, guests);

      const summary = document.getElementById("summary");
      summary.style.display = "block";

      summary.innerHTML = `
        <h2>Booking Summary</h2>
        <p><b>Tour:</b> ${t.name}${addonText}</p>
        <p><b>Guests:</b> ${guests}</p>
        <p><b>Date:</b> ${date}</p>
        <p><b>Time:</b> ${time}</p>
        <p><b>Final Total:</b> $${p.final.toFixed(2)}</p>

        <button onclick="window.location.href='${t.stripe}'" style="
          padding:16px 28px;
          background:#d4a017;
          border:none;
          border-radius:12px;
          font-weight:800;
          font-size:17px;
          cursor:pointer;
        ">
          Confirm & Go to Secure Payment
        </button>
      `;

      summary.scrollIntoView({ behavior: "smooth" });
    });
  });
});
