// /game.js

async function generateGame() {
  const status = document.getElementById("status");
  const result = document.getElementById("result");
  const prompt = document.getElementById("prompt").value.trim();

  if (!prompt) {
    status.textContent = "⚠️ Please type a game idea first.";
    return;
  }

  status.textContent = "⏳ Generating game...";
  result.innerHTML = "";

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

    // ✅ Create canvas
    result.innerHTML = `
      <h2>Your Game</h2>
      <canvas id="gameCanvas" width="800" height="600" style="background:black;"></canvas>
    `;

    // ✅ Run the generated game code
    eval(data.gameCode);

  } catch (err) {
    console.error("Frontend Error:", err);
    status.textContent = "❌ Error generating game.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generateBtn").addEventListener("click", generateGame);
});

