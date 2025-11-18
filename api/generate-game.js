async function generateGame(prompt) {
  try {
    const response = await fetch("/api/generate-game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Backend Error:", data);
      throw new Error(data.error || "Failed to generate game");
    }

    return data.code;

  } catch (err) {
    console.error("Error generating game:", err);
    throw err;
  }
}
