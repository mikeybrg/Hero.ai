import OpenAI from "openai";

export default async function handler(request, response) {
  try {
    const body = await request.json();
    const prompt = body.prompt || "Make a simple platformer game with a ball";

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You generate Phaser.js game code." },
        { role: "user", content: `Create a playable Phaser.js game: ${prompt}` },
      ],
    });

    const gameCode = completion.choices[0].message.content;

    return response.status(200).json({ code: gameCode });
  } catch (error) {
    console.error("Error:", error);
    return response.status(500).json({ error: error.message });
  }
}

