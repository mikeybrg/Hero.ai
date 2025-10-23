import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Parse request body safely
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks).toString();
    const data = JSON.parse(body || "{}");

    const prompt = data.prompt || "make a simple pong game";

    const completion = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: `Generate a playable browser game with HTML, CSS, and JS that fits this idea: "${prompt}". Include <script> and <style> tags in one HTML string.`,
        },
      ],
    });

    const html = completion.output[0]?.content[0]?.text || "";

    res.status(200).json({ html });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
