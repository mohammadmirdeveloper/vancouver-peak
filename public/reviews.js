const REVIEWS_SUPABASE_URL = "https://fmzyvslflsngnorpmuju.supabase.co";
const REVIEWS_SUPABASE_KEY = "sb_publishable_RTM95bE519jtHrELvHSwrQ_FuTR7Ehg";

async function loadReviews() {
  const box = document.getElementById("reviewsBox");
  const leadersBox = document.getElementById("leadersBox");

  if (!box || !leadersBox) return;

  const response = await fetch(
    `${REVIEWS_SUPABASE_URL}/rest/v1/reviews?approved=eq.true&select=customer_name,country,tour,tour_leader,rating,comment,created_at&order=created_at.desc`,
    {
      headers: {
        apikey: REVIEWS_SUPABASE_KEY,
        Authorization: `Bearer ${REVIEWS_SUPABASE_KEY}`
      }
    }
  );

  const reviews = await response.json();

  if (!reviews.length) {
    box.innerHTML = `<p class="desc">No reviews yet.</p>`;
    leadersBox.innerHTML = `<p class="desc">Tour leader ratings will appear after reviews are approved.</p>`;
    return;
  }

  const leaderStats = {};

  reviews.forEach(r => {
    if (!leaderStats[r.tour_leader]) {
      leaderStats[r.tour_leader] = {
        total: 0,
        count: 0
      };
    }

    leaderStats[r.tour_leader].total += Number(r.rating);
    leaderStats[r.tour_leader].count += 1;
  });

  const leaders = Object.keys(leaderStats)
    .map(name => {
      const avg = leaderStats[name].total / leaderStats[name].count;

      return {
        name,
        avg,
        count: leaderStats[name].count
      };
    })
    .sort((a, b) => b.avg - a.avg);

  leadersBox.innerHTML = leaders.map((leader, index) => {
    const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "⭐";

    return `
      <article class="card">
        <div class="body">
          <h3>${medal} ${leader.name}</h3>
          <p class="desc">★★★★★ ${leader.avg.toFixed(1)} based on ${leader.count} review${leader.count > 1 ? "s" : ""}</p>
        </div>
      </article>
    `;
  }).join("");

  box.innerHTML = reviews.slice(0, 6).map(r => {
    const stars = "★★★★★".slice(0, Number(r.rating));

    return `
      <article class="card">
        <div class="body">
          <h3>${stars}</h3>
          <p class="desc">"${r.comment}"</p>
          <p><b>${r.customer_name}</b> • ${r.country}</p>
          <p class="desc">${r.tour} — Tour Leader: <b>${r.tour_leader}</b></p>
        </div>
      </article>
    `;
  }).join("");
}

loadReviews();
