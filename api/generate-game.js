// /api/generate-game.js

export default async function handler(req, res) {
  try {
    const body = await req.json();
    const prompt = body.prompt;

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    // TEMPORARY TEST RESPONSE
    const game = {
      title: "Hero AI Test Game",
      description: "If you see this, your backend route works.",
      actions: ["Run", "Jump", "Explore"]
    };

    return res.status(200).json({ game });

  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({ error: "Server Error" });
  }
}
