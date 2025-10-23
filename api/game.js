import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  try {
    // ✅ Parse incoming JSON body safely
    let body = "";
    await new Promise((resolve) => {
      req.on("data", (chunk) => (body += chunk));
      req.on("end", resolve);
    });
    const data = JSON.parse(body);
    const prompt = data.prompt || "Make a simple game using Phaser.js";

    // ✅ Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // ✅ Ask OpenAI for Phaser.js game code
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You generate short playable Phaser.js game code." },
        { role: "user", content: `Generate a playable Phaser.js game: ${prompt}` },
      ],
    });

    const gameCode = completion.choices[0].message.content;

    return res.status(200).json({ code: gameCode });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: err.message });
  }
}
