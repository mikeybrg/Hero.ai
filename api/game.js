import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Parse the body manually
    let body = "";
    for await (const chunk of req) {
      body += chunk;
    }
    const data = JSON.parse(body);

    const prompt = data.prompt || "make a simple game";

    const completion = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `Create an HTML, CSS, and JS game based on this idea: ${prompt}`,
    });

    const html = completion.output[0]?.content[0]?.text || "";

    res.status(200).json({ html });
  } catch (error) {
    console.error("Error generating game:", error);
    res.status(500).json({ error: error.message });

