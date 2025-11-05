// /game.js - FRONTEND

async function generateGame() {
  const status = document.getElementById("status");
  const result = document.getElementById("result");
  const prompt = document.getElementById("prompt").value.trim();

  if (!prompt) {
    status.textContent = "⚠️ Please type a game idea first.";
    return;
  }

  status.textContent = "⏳ Generating game...";
  result.textContent = "";

  try {
    const response = await fetch("/api/generate-game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unknown error");
    }

    status.textContent = "✅ Game generated!";
    result.innerHTML = `
      <h2>${data.game.title}</h2>
      <p>${data.game.description}</p>
      <ul>${data.game.actions.map(a => `<li>${a}</li>`).join("")}</ul>
    `;

  } catch (err) {
    console.error("Frontend Error:", err);
    status.textContent = "❌ Error generating game. Check console.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generateBtn").addEventListener("click", generateGame);
});

