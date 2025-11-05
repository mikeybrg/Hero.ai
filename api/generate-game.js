const axios = require("axios");

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    // ✅ Parse body safely
    let body = "";
    for await (const chunk of req) {
      body += chunk;
    }
    const data = JSON.parse(body || "{}");
    const prompt = data.prompt || "";

    if (!prompt.trim()) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    // ✅ Call OpenAI using REST API
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You generate PHASER 3 JAVASCRIPT GAMES. Respond ONLY with runnable JS code. No explanations."
          },
          {
            role: "user",
            content: `Make a simple Phaser 3 game based on: ${prompt}`
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    const gameCode = response.data.choices[0].message.content;
    return res.status(200).json({ gameCode });

  } catch (err) {
    console.error("OPENAI ERROR:", err?.response?.data || err);
    return res.status(500).json({
      error: "OpenAI Error",
      details: err?.response?.data || String(err)
    });
  }
};

