export default async function handler(req, res) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    // Example “game generation” (replace with real logic or AI call)
    const game = {
      title: "Hero AI Adventure",
      description: "You are an AI hero saving the digital realm.",
      actions: ["Fight", "Explore", "Upgrade", "Rest"],
    };

    return res.status(200).json({ game });
  } catch (err) {
    console.error("Error in generate-game API:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
