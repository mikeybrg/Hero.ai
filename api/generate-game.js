// /api/generate-game.js

export default async function handler(req, res) {
  try {
    const body = await req.json();
    const prompt = body.prompt;

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    // TEMPORARY FAKE RESPONSE so we can confirm API works
    const game = {
      title: "Hero AI Test Game",
      description: "This is a test game. If you see this, your backend works!",
      actions: ["Attack", "Defend", "Explore"]
    };

    return res.status(200).json({ game });

  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({ error: "Server Error" });
  }
}
