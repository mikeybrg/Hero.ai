export default async function handler(req, res) {
  try {
    // Make sure it's a POST request
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    // Parse JSON body
    const body = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", chunk => (data += chunk));
      req.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      });
    });

    const prompt = body.prompt || "";

    if (!prompt.trim()) {
      return res.status(400).json({ error: "No prompt provided" });
    }

    // ✅ Temporary fake game code for testing
    const gameCode = `
      const canvas = document.getElementById("gameCanvas");
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "white";
      ctx.font = "24px sans-serif";
      ctx.fillText("✅ Your backend is working!", 40, 40);
      ctx.fillText("Prompt: ${prompt}", 40, 80);
    `;

    return res.status(200).json({ gameCode });

  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
