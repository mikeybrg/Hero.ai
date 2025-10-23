import OpenAI from "openai";

export const config = {
  api: {
    bodyParser: false, // disable automatic parsing so we can handle raw stream
  },
};

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    // Safely read the request body
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const data = JSON.parse(body || "{}");
      const prompt = data.prompt || "make a simple pong game";

      const completion = await client.responses.create({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "user",
            content: `Generate a playable HTML, CSS, and JS game that fits this idea: "${prompt}". Include <style> and <script> tags in a single HTML file.`,
          },
        ],
      });

      const html = completion.output[0]?.content[0]?.text || "";
      res.status(200).json({ html });
    });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
