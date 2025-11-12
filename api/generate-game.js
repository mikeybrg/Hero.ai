import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    // ✅ Make sure this is pulling from your Vercel environment variable
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("❌ Missing OpenAI API key in environment variables");
      return res.status(500).json({ error: "Server missing API key" });
    }

    const openai = new OpenAI({ apiKey });

    // ✅ Generate code with GPT
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an AI that writes playable HTML5 JavaScript games." },
        { role: "user", content: `Make this game playable in the browser: ${prompt}` }
      ]
    });

    const code = response.choices[0]?.message?.content || "// No output";
    res.status(200).json({ code });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "OpenAI Error", details: err });
  }
}
