export default async function handler(req, res) {
  try {
    const buffers = [];
    for await (const chunk of req) buffers.push(chunk);
    const data = JSON.parse(Buffer.concat(buffers).toString());
    const prompt = data.prompt || "";

    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI that generates playable HTML, CSS, and JS 2D games using Phaser.js. Output only runnable code.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    const json = await response.json();
    const gameHTML = json.choices?.[0]?.message?.content || "";
    return res.status(200).json({ gameHTML });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
