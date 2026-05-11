// VANCOUVER PEAK JOURNEY - FINAL REBUILT APP.JS
// Clean rebuild: image fix + pricing + stripe + guest discounts + minimum 2 guests

document.addEventListener("DOMContentLoaded", () => {
  // =====================
  // IMAGE PATHS
  // =====================
  const heroImage = "./hero.jpg";
  const seaImage = "./sea.jpg";
  const grouseImage = "./grouse.jpg";
  const whistlerImage = "./whistler.jpg";

  // =====================
  // TOUR DATA
  // =====================
  const tours = [
    {
      id: "sea",
      name: "Sea to Sky Gondola",
      image: seaImage,
      description:
        "Experience breathtaking mountain, ocean, and sky views with Vancouver’s most iconic scenic journey.",
      price: 125,
      stripe: "https://buy.stripe.com/test_3cI28rdgM4pn2vVcau3ZK01",
    },
    {
      id: "grouse",
      name: "Grouse Mountain",
      image: grouseImage,
      description:
        "Discover Vancouver from above with wildlife, mountaintop adventure, and unforgettable city views.",
      price: 100,
      stripe: "https://buy.stripe.com/test_fZu5kDdgM5tr3zZ3DY3ZK02",
    },
    {
      id: "whistler",
      name: "Whistler Adventure",
      image: whistlerImage,
      description:
        "Luxury day trip through the Sea to Sky Highway to one of Canada’s most famous destinations.",
      price: 125,
      stripe: "https://buy.stripe.com/test_00w00jb8EcVT8Uj5M63ZK03",
    },
  ];

  // =====================
  // ROOT APP
  // =====================
  const app = document.getElementById("app");

  // =====================
  // HELPER FUNCTIONS
  // =====================
  function calculateTotal(basePrice, guests) {
    let total = basePrice * guests;
    let discount = 0;

    if (guests === 3) {
      discount = total * 0.08;
    } else if (guests >= 4) {
      discount = total * 0.15;
    }

    return {
      total,
      discount,
      final: total - discount,
    };
  }

  function guestOptions() {
    let options = "";
    for (let i = 2; i <= 4; i++) {
      options += `<option value="${i}">${i} Guests</option>`;
    }
    return options;
  }

  // =====================
  // HERO SECTION
  // =====================
  function renderHero() {
    return `
      <section id="hero" style="
        background:
          linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.60)),
          url('${heroImage}') center/cover no-repeat;
        min-height: 90vh;
        display: flex;
        align-items: center;
        padding: 60px 8%;
        color: white;
      ">
        <div style="max-width:700px;">
          <p style="
            color:#d4a017;
            font-weight:700;
            letter-spacing:2px;
            font-size:18px;
            margin-bottom:20px;
          ">
            EXPLORE. EXPERIENCE. REMEMBER.
          </p>

          <h1 style="
            font-size: clamp(42px, 7vw, 82px);
            margin:0 0 20px 0;
            font-weight:800;
            line-height:1.1;
          ">
            Vancouver Peak Journey
          </h1>

          <p style="
            font-size:20px;
            line-height:1.7;
            color:rgba(255,255,255,0.92);
            margin-bottom:35px;
          ">
            Premium Vancouver attraction bookings with luxury comfort,
            unforgettable views, and curated peak experiences.
          </p>

          <div style="display:flex; gap:15px; flex-wrap:wrap;">
            <a href="#tours" style="
              background:#d4a017;
              color:black;
              padding:16px 28px;
              border-radius:12px;
              text-decoration:none;
              font-weight:700;
            ">
              Choose Your Adventure
            </a>

            <a href="#tours" style="
              background:white;
              color:black;
              padding:16px 28px;
              border-radius:12px;
              text-decoration:none;
              font-weight:700;
            ">
              Book Now
            </a>
          </div>
        </div>
      </section>
    `;
  }

  // =====================
  // TOUR SECTION
  // =====================
  function renderTours() {
    return `
      <section id="tours" style="padding:80px 8%; background:#f7f7f7;">
        <h2 style="
          text-align:center;
          font-size:42px;
          margin-bottom:50px;
        ">
          Choose Your Peak Experience
        </h2>

        <div style="
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(320px,1fr));
          gap:30px;
        ">
          ${tours
            .map(
              (tour) => `
            <div style="
              background:white;
              border-radius:18px;
              overflow:hidden;
              box-shadow:0 8px 24px rgba(0,0,0,0.08);
            ">
              <img src="${tour.image}" alt="${tour.name}" style="
                width:100%;
                height:240px;
                object-fit:cover;
              ">

              <div style="padding:24px;">
                <h3 style="font-size:28px; margin-bottom:12px;">
                  ${tour.name}
                </h3>

                <p style="
                  color:#555;
                  line-height:1.6;
                  min-height:70px;
                ">
                  ${tour.description}
                </p>

                <p style="
                  font-size:24px;
                  font-weight:800;
                  color:#d4a017;
                ">
                  From $${tour.price}/person
                </p>

                <label style="font-weight:600;">Guests:</label>
                <select id="${tour.id}-guests" style="
                  width:100%;
                  padding:12px;
                  margin:10px 0 15px 0;
                  border-radius:10px;
                ">
                  ${guestOptions()}
                </select>

                <div id="${tour.id}-pricing" style="
                  margin-bottom:18px;
                  font-weight:600;
                ">
                  Total: $${tour.price * 2}
                </div>

                <button data-tour="${tour.id}" style="
                  width:100%;
                  padding:16px;
                  background:#d4a017;
                  border:none;
                  border-radius:12px;
                  font-weight:800;
                  cursor:pointer;
                  font-size:16px;
                ">
                  Continue to Secure Checkout
                </button>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  // =====================
  // RENDER APP
  // =====================
  app.innerHTML = `
    ${renderHero()}
    ${renderTours()}
  `;

  // =====================
  // INTERACTIONS
  // =====================
  tours.forEach((tour) => {
    const guestSelect = document.getElementById(`${tour.id}-guests`);
    const pricingBox = document.getElementById(`${tour.id}-pricing`);
    const button = document.querySelector(`button[data-tour="${tour.id}"]`);

    function updatePricing() {
      const guests = parseInt(guestSelect.value);
      const pricing = calculateTotal(tour.price, guests);

      let discountText = "";
      if (pricing.discount > 0) {
        discountText = `<br>Discount: -$${pricing.discount.toFixed(2)}`;
      }

      pricingBox.innerHTML = `
        Guests: ${guests}<br>
        Original: $${pricing.total.toFixed(2)}
        ${discountText}<br>
        Final Total: <span style="color:#d4a017;">$${pricing.final.toFixed(
          2
        )}</span>
      `;
    }

    guestSelect.addEventListener("change", updatePricing);

    button.addEventListener("click", () => {
      window.location.href = tour.stripe;
    });

    updatePricing();
  });
});
