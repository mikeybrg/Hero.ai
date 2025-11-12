import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    // If running on Next.js, use req.body — if on Vercel Edge Functions, use await req.json()
    const body = req.body || (await req.json());
    const { prompt } = body;

    if (!prompt) {
      return res.status(400).json({ error: "Missing 'prompt' in request body." });
    }

    console.log("🎮 Generating game for prompt:", prompt);

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `Generate a playable HTML + JavaScript game (no external libraries) for this prompt: "${prompt}". 
Return ONLY the HTML + JS code.`,
    });

    const text = response.output[0].content[0].text;

    console.log("✅ Game generated successfully!");
    res.status(200).json({ game: text });
  } catch (error) {
    console.error("❌ Error generating game:", error);
    res.status(500).json({ error: error.message || "Unknown server error." });
  }
}
