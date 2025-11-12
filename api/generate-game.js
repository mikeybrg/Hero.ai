import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  try {
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: `Generate a playable HTML + JS game inside <script> tags for this idea: ${prompt}`,
    });

    const code = response.output_text;
    res.status(200).json({ code });
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({
      error: "OpenAI Error",
      details: error.message,
    });
  }
}
