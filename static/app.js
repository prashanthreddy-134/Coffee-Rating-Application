const grid = document.getElementById("coffeeGrid");
const totalVotesEl = document.getElementById("totalVotes");
const coffeeCountEl = document.getElementById("coffeeCount");
const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1900);
}

function renderCoffees(coffees) {
  const total = coffees.reduce((sum, coffee) => sum + coffee.votes, 0);
  totalVotesEl.textContent = total.toLocaleString();
  coffeeCountEl.textContent = coffees.length;
  if (!coffees.length) {
    grid.innerHTML = '<p class="empty">No coffees available yet.</p>';
    return;
  }
  grid.innerHTML = coffees.map((coffee, index) => `
    <article class="coffee-card">
      <div class="card-top">
        <div class="coffee-emoji" aria-hidden="true">${coffee.emoji}</div>
        <span class="rank">#${String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3>${escapeHtml(coffee.name)}</h3>
      <p>${escapeHtml(coffee.description)}</p>
      <div class="card-bottom">
        <span class="vote-count"><strong>${coffee.votes.toLocaleString()}</strong> ${coffee.votes === 1 ? "vote" : "votes"}</span>
        <button class="vote-btn" data-id="${coffee.id}" aria-label="Vote for ${escapeHtml(coffee.name)}"><span>＋</span> Vote</button>
      </div>
    </article>`).join("");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

async function loadCoffees() {
  try {
    const response = await fetch("/api/coffees");
    if (!response.ok) throw new Error("Could not load coffees");
    renderCoffees(await response.json());
  } catch (error) {
    grid.innerHTML = '<p class="empty">Could not connect to the server. Refresh the page to try again.</p>';
  }
}

grid.addEventListener("click", async event => {
  const button = event.target.closest(".vote-btn");
  if (!button) return;
  const coffeeId = button.dataset.id;
  button.disabled = true;
  button.textContent = "Saving…";
  try {
    const response = await fetch(`/api/coffees/${coffeeId}/vote`, { method: "POST" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Vote failed");
    await loadCoffees();
    showToast(`Your vote for ${result.name} was counted!`);
  } catch (error) {
    showToast(error.message);
    button.disabled = false;
    button.innerHTML = "<span>＋</span> Vote";
  }
});

loadCoffees();
