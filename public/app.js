const tours = [
  {
    id: "sea",
    title: "Sea to Sky Gondola",
    desc: "Panoramic views, suspension bridge, and unforgettable photo moments.",
    price: 150,
    image: "sea.jpg",
    badge: "MOST POPULAR"
  },
  {
    id: "grouse",
    title: "Grouse Mountain",
    desc: "Mountain experience with city, ocean, forest, and sunset views.",
    price: 140,
    image: "grouse.jpg"
  },
  {
    id: "whistler",
    title: "Whistler Village",
    desc: "Whistler Village, scenic stops, free time, and optional Sea to Sky add-on.",
    price: 190,
    image: "whistler.jpg"
  }
];

function calcDiscount(basePrice, guests) {
  if (guests < 2) guests = 2;

  let total = basePrice * guests;

  if (guests === 3) total *= 0.92; // 8% off
  if (guests >= 4) total *= 0.85; // 15% off

  return Math.round(total);
}

function buildTours() {
  const hero = document.getElementById("hero");
  if (hero) {
    hero.style.backgroundImage = `url("hero.jpg")`;
    hero.style.backgroundSize = "cover";
    hero.style.backgroundPosition = "center";
  }

  const box = document.getElementById("ticketBox");
  if (!box) return;

  box.innerHTML = tours.map(tour => {
    const base2 = calcDiscount(tour.price, 2);

    return `
      <article class="card">
        ${tour.badge ? `<div class="badge">${tour.badge}</div>` : ""}
        <div class="photo" id="img${tour.id.charAt(0).toUpperCase() + tour.id.slice(1)}"
             style="background-image:url('${tour.image}'); background-size:cover; background-position:center;">
        </div>

        <h3>${tour.title}</h3>
        <p>${tour.desc}</p>

        <label>Guests (Minimum 2):</label>
        <select class="guest-select" data-price="${tour.price}" data-tour="${tour.id}">
          <option value="2">2 Guests</option>
          <option value="3">3 Guests (8% OFF)</option>
          <option value="4">4 Guests (15% OFF)</option>
        </select>

        <div class="price" id="price-${tour.id}">
          CAD $${base2}
        </div>

        <button class="book-btn" data-tour="${tour.id}">
          Book Now
        </button>
      </article>
    `;
  }).join("");

  attachEvents();
}

function attachEvents() {
  document.querySelectorAll(".guest-select").forEach(select => {
    select.addEventListener("change", function () {
      const guests = parseInt(this.value);
      const basePrice = parseInt(this.dataset.price);
      const tour = this.dataset.tour;

      const finalPrice = calcDiscount(basePrice, guests);

      const priceBox = document.getElementById(`price-${tour}`);
      if (priceBox) {
        priceBox.innerHTML = `CAD $${finalPrice}`;
      }
    });
  });

  document.querySelectorAll(".book-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      const tour = this.dataset.tour;

      if (tour === "sea") {
        window.location.href = "https://buy.stripe.com/test_3cI28rdgM4pn2vVcau3ZK01";
      }

      if (tour === "grouse") {
        window.location.href = "https://buy.stripe.com/test_fZu5kDdgM5tr3zZ3DY3ZK02";
      }

      if (tour === "whistler") {
        window.location.href = "https://buy.stripe.com/test_00w00jb8EcVT8Uj5M63ZK03";
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", buildTours);
