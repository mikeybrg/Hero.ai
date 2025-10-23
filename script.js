document.getElementById("generateBtn").addEventListener("click", generateGame);

async function generateGame() {
  const prompt = document.getElementById("prompt").value.trim();
  const container = document.getElementById("gameContainer");

  if (!prompt) {
    container.innerHTML = "<p>Please enter a game idea!</p>";
    return;
  }

  container.innerHTML = "<p>⚙️ Generating your game...</p>";

  try {
    const response = await fetch("/api/game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    container.innerHTML =
      data.html ||
      "<p>❌ Error generating game. Make sure the backend is set up.</p>";
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>❌ Server error. Try again later.</p>";
  }
}
