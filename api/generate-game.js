export default async function handler(req: Request): Promise<Response> {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Missing prompt." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get OpenAI API key from Secrets
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing OPENAI_API_KEY" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Call OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You generate playable HTML/JS/CSS games. Respond ONLY with code, no explanations."
          },
          {
            role: "user",
            content: `Create a simple browser game: ${prompt}. Return ONLY the HTML + CSS + JS combined into one HTML string.`
          }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const t = await response.text();
      return new Response(
        JSON.stringify({ error: "OpenAI Error", details: t }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();

    const code = data.choices?.[0]?.message?.content || "";

    return new Response(
      JSON.stringify({ code }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: "Server crashed", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
