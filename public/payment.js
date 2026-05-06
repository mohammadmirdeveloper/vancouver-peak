const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/test_dRmeVddgMf414E3fmG3ZK00";

const originalFetch = window.fetch;

window.fetch = async function (...args) {
  const response = await originalFetch(...args);

  try {
    const url = String(args[0]);
    const method = args[1]?.method || "GET";

    if (url.includes("/api/orders") && method === "POST" && response.ok) {
      setTimeout(() => {
       window.location.href = "https://buy.stripe.com/test_dRmeVddgMf414E3fmG3ZK00";
      }, 1500);
    }
  } catch (e) {}

  return response;
};
