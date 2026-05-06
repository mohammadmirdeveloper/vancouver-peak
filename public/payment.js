const LINKS = {
  sea: "https://buy.stripe.com/test_3cI28rdgM4pn2vVcau3ZK01",
  grouse: "https://buy.stripe.com/test_fZu5kDdgM5tr3zZ3DY3ZK02",
  whistler: "https://buy.stripe.com/test_00w00jb8EcVT8Uj5M63ZK03",
  combo: "https://buy.stripe.com/test_dRmeVddgMf414E3fmG3ZK00"
};

const originalFetch = window.fetch;

window.fetch = async function (...args) {
  const response = await originalFetch(...args);

  try {
    const url = String(args[0]);
    const method = args[1]?.method || "GET";

    if (url.includes("/api/orders") && method === "POST" && response.ok) {
      const body = args[1]?.body ? JSON.parse(args[1].body) : {};

      let paymentLink = LINKS.sea;

      const tour = String(body.tour || "").toLowerCase();

      if (tour.includes("grouse")) {
        paymentLink = LINKS.grouse;
      } else if (tour.includes("whistler") && tour.includes("sea")) {
        paymentLink = LINKS.combo;
      } else if (tour.includes("whistler")) {
        paymentLink = LINKS.whistler;
      } else if (tour.includes("sea")) {
        paymentLink = LINKS.sea;
      }

      setTimeout(() => {
        window.location.href = paymentLink;
      }, 1500);
    }
  } catch (e) {}

  return response;
};
