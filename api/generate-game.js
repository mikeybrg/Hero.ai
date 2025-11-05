import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    // ✅ Safe body parsing (never crashes)
    let body = "";
    for await (const chunk of req) {
      body += chunk;
    }

    const data = JSON.parse(body || "{}");
    const prompt = data.prompt || "";

    if (!prompt) {
      return res.status(400).json({ error: "Prompt missing" });
    }

    // ✅ Call OpenAI for Phaser game code
    const ai = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You generate PHASER 3 JAVASCRIPT GAMES. Respond ONLY with runnable JS code for Phaser 3. No explanations."
        },
        {
          role: "user",
          content: `Make a simple Phaser 3 game based on: ${prompt}`
        }
      ]
    });

    const gameCode = ai.choices[0].message.content;

    return res.status(200).json({ gameCode });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ error: "Server error inside function" });
  }
}
