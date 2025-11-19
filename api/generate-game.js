export default async function handler(req, res) {
  try {
    const { prompt } = req.body;
    
    const completion = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        input: `Create a complete playable mini-game using ONLY HTML, CSS, and JS in one file. No external files. The theme is: ${prompt}`
      })
    });

    const data = await completion.json();

    res.status(200).json({
      html: data.output_text
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate game" });
  }
}
