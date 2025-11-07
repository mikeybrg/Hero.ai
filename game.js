// /game.js - frontend that runs returned template code

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
      status.textContent = "❌ Error: " + (data.error || "Server error");
      console.error(data);
      return;
    }

    // make canvas area and run code
    result.innerHTML = '<h2>Your Game</h2><canvas id="gameCanvas" style="background:#000;display:block;margin:0 auto;"></canvas>';
    // run returned game JS
    try {
      eval(data.gameCode);
      status.textContent = "✅ Game generated!";
    } catch (e) {
      console.error("Error running game code", e);
      status.textContent = "❌ Error running game code (see console).";
      result.innerHTML += "<pre style='color:#f88;'>" + String(e) + "</pre>";
    }
  } catch (err) {
    console.error("Fetch error:", err);
    status.textContent = "❌ Network error. Check console.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generateBtn").addEventListener("click", generateGame);
});
