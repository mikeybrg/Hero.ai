// api/game.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a game generator. Create playable HTML + JavaScript games in one file using only HTML, CSS, and JS.",
          },
          {
            role: "user",
            content: `Create a playable browser game based on this idea: ${prompt}. Keep it fun, simple, and self-contained.`,
          },
        ],
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    const gameCode = data.choices?.[0]?.message?.content || "<p>Error generating game.</p>";

    return res.status(200).json({ html: gameCode });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
