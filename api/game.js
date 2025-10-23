export default async function handler(req, res) {
  try {
    const { prompt } = req.body || {};
    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful game creator that generates playable HTML, CSS, and JavaScript 2D games using Phaser.js. Output only HTML code that can run in browser.',
          },
          { role: 'user', content: prompt },
        ],
      }),
    });

    const data = await response.json();

    const gameHTML = data.choices?.[0]?.message?.content || '';

    return res.status(200).json({ gameHTML });
  } catch (err) {
    console.error('Error in /api/game:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
