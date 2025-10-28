// public/game.js
// Frontend logic for Hero.AI

document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const resultDiv = document.getElementById("result");
  const promptInput = document.getElementById("prompt");

  generateBtn.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      resultDiv.textContent = "⚠️ Please enter a prompt first.";
      return;
    }

    resultDiv.textContent = "⏳ Generating your game...";

    try {
      const response = await fetch("/api/game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch from backend.");
      }

      const data = await response.json();
      const gameText = data.result;

      if (!gameText) {
        resultDiv.textContent = "❌ No response received from AI.";
        return;
      }

      // Display the game idea
      resultDiv.innerHTML = `
        <h3>🕹️ Your AI-Generated Game:</h3>
        <pre>${gameText}</pre>
      `;
    } catch (err) {
      console.error("Error generating game:", err);
      resultDiv.textContent = "❌ Error generating game. Check console for details.";
    }
  });
});

