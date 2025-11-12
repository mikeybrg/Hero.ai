const status = document.getElementById("status");
const gameCode = document.getElementById("gameCode");
const button = document.getElementById("generateBtn");

button.addEventListener("click", generateGame);

async function generateGame() {
  const prompt = document.getElementById("prompt").value.trim();
  if (!prompt) {
    alert("Please describe your game first!");
    return;
  }

  status.textContent = "🎮 Generating game...";
  gameCode.textContent = "";

  try {
    const res = await fetch("/api/generate-game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    // Handle raw text or JSON errors
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Server returned non-JSON: " + text);
    }

    if (data.error) throw new Error(data.error);

    status.textContent = "✅ Game generated!";
    gameCode.textContent = data.code || "No code returned.";
  } catch (err) {
    console.error("Frontend Error:", err);
    status.textContent = "❌ Error generating game.";
    gameCode.textContent = err.message;
  }
}
