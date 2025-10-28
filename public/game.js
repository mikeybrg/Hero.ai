async function generateGame() {
  const status = document.getElementById("status");
  const result = document.getElementById("result");
  result.textContent = "";
  status.textContent = "⏳ Generating game...";

  try {
    const prompt = "Generate a simple hero game idea.";
    const response = await fetch("/api/generate-game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Generated game:", data);

    if (data.game) {
      result.innerHTML = `
        <h2>${data.game.title}</h2>
        <p>${data.game.description}</p>
        <ul>${data.game.actions.map(a => `<li>${a}</li>`).join("")}</ul>
      `;
      status.textContent = "✅ Game generated!";
    } else {
      status.textContent = "❌ No game returned.";
    }
  } catch (err) {
    console.error("Error generating game:", err);
    status.textContent = "❌ Error generating game. Check console for details.";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generateBtn").addEventListener("click", generateGame);
});

