document.addEventListener("DOMContentLoaded", () => {
  const tours = [
    {
      name: "Sea to Sky Gondola",
      desc: "Panoramic views, suspension bridge, and unforgettable photo moments.",
      price: 125,
      image: "./sea.jpg",
      stripe: "https://buy.stripe.com/test_3cI28rdgM4pn2vVcau3ZK01",
      badge: "MOST POPULAR"
    },
    {
      name: "Grouse Mountain",
      desc: "Mountain experience with city, ocean, forest, and sunset views.",
      price: 100,
      image: "./grouse.jpg",
      stripe: "https://buy.stripe.com/test_fZu5kDdgM5tr3zZ3DY3ZK02",
      badge: ""
    },
    {
      name: "Whistler Village",
      desc: "Whistler Village, scenic stops, free time, and optional Sea to Sky add-on.",
      price: 125,
      image: "./whistler.jpg",
      stripe: "https://buy.stripe.com/test_00w00jb8EcVT8Uj5M63ZK03",
      badge: ""
    }
  ];

  function finalPrice(base, guests) {
    let total = base * guests;
    if (guests === 3) total *= 0.92;
    if (guests >= 4) total *= 0.85;
    return total.toFixed(2);
  }

  const container = document.getElementById("tour-container");
  if (!container) return;

  container.innerHTML = tours.map((tour, index) => `
    <div style="
      background:white;
      border-radius:22px;
      overflow:hidden;
      box-shadow:0 8px 24px rgba(0,0,0,0.08);
      padding-bottom:20px;
    ">
      <div style="
        height:220px;
        background:url('${tour.image}') center/cover no-repeat;
      "></div>

      <div style="padding:22px;">
        ${tour.badge ? `
          <div style="
            display:inline-block;
            background:#d4a017;
            color:black;
            font-weight:800;
            padding:8px 14px;
            border-radius:10px;
            margin-bottom:14px;
          ">
            ${tour.badge}
          </div>
        ` : ""}

        <h3 style="font-size:36px; margin:10px 0;">${tour.name}</h3>

        <p style="
          color:#555;
          line-height:1.6;
          min-height:60px;
        ">
          ${tour.desc}
        </p>

        <p style="
          font-size:28px;
          font-weight:800;
          color:#d4a017;
        ">
          From $${tour.price}/person
        </p>

        <select id="guests-${index}" style="
          width:100%;
          padding:14px;
          margin:14px 0;
          border-radius:10px;
          font-size:16px;
        ">
          <option value="2">2 Guests</option>
          <option value="3">3 Guests (8% Off)</option>
          <option value="4">4 Guests (15% Off)</option>
        </select>

        <div id="price-${index}" style="
          font-size:20px;
          font-weight:700;
          margin-bottom:18px;
        ">
          Total: $${finalPrice(tour.price, 2)}
        </div>

        <button onclick="window.location.href='${tour.stripe}'" style="
          width:100%;
          padding:16px;
          background:#d4a017;
          border:none;
          border-radius:12px;
          font-weight:800;
          font-size:18px;
          cursor:pointer;
        ">
          Book Now
        </button>
      </div>
    </div>
  `).join("");

  tours.forEach((tour, index) => {
    const guests = document.getElementById(`guests-${index}`);
    const priceBox = document.getElementById(`price-${index}`);

    guests.addEventListener("change", () => {
      priceBox.innerHTML = `Total: $${finalPrice(tour.price, parseInt(guests.value))}`;
    });
  });
});
