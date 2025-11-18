import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const systemPrompt = `
You are GameBuilderGPT. You ONLY output a single, complete HTML file that runs fully inside an iframe srcdoc.
Requirements:
- Full <html>, <head>, <body>.
- Clean CSS.
- Good layout + animations.
- Game must be fully playable.
- Include JS inside <script>.
- No external scripts.
- No imports.
- No markdown.
- No code fences.
- No JSON.
- No backticks.
    `;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${process.env.OPENAI_API_KEY}\`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-thinking-exp",
        input: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Create a complete HTML5 game: " + prompt }
        ]
      }),
    });

    const data = await response.json();
    const html =
      data.output_text ||
      data.choices?.[0]?.message?.content ||
      "";

    return NextResponse.json({ code: html });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
