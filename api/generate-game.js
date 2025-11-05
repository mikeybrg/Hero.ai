import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const body = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", chunk => (data += chunk));
      req.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    });

    const prompt = body.prompt || "";

    if (!prompt.trim()) {
      return res.status(400).json({ error: "No prompt provided" });
    }

    // ✅ Call OpenAI to generate Phaser game code
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You generate PHASER 3 JAVASCRIPT GAMES. Respond ONLY with runnable JS code. No explanations."
        },
        {
          role: "user",
          content: `Make a simple playable game based on this idea: ${prompt}`
        }
      ]
    });

    const gameCode = response.choices[0].message.content;

    return res.status(200).json({ gameCode });

  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
