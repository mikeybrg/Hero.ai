document.getElementById("generate-btn").addEventListener("click", generateGame);

async function generateGame() {
  const prompt = document.getElementById("prompt").value.trim();
  const status = document.getElementById("status");
  const frame = document.getElementById("game-frame");

  if (!prompt) {
    status.textContent = "❌ Please enter a game idea first.";
    return;
  }

  status.textContent = "🎮 Generating game...";
  frame.style.display = "none";

  try {
    const res = await fetch("/api/generate-game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) throw new Error("Server error: " + res.status);

    const data = await res.json();
    if (!data.code) throw new Error("No game code returned.");

    frame.srcdoc = data.code;
    frame.style.display = "block";
    status.textContent = "✅ Game generated!";
  } catch (err) {
    status.textContent = "❌ Error generating game: " + err.message;
  }
}
