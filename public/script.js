document.getElementById("generateBtn").addEventListener("click", async () => {
  const prompt = document.getElementById("prompt").value;
  const output = document.getElementById("output");
  output.innerHTML = "⏳ Generating game...";

  try {
    const res = await fetch("/api/game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      output.innerHTML = "❌ Error generating game. (Check OpenAI key)";
      return;
    }

    const data = await res.json();
    if (data.gameHTML) {
      output.innerHTML = data.gameHTML;
    } else {
      output.innerHTML = "❌ No game returned.";
    }
  } catch (err) {
    output.innerHTML = "⚠️ Server error: " + err.message;
  }
});
