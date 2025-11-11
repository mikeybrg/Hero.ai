import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const { title, code } = JSON.parse(req.body);

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { data, error } = await supabase
    .from("games")
    .insert([{ title, code }])
    .select("id")
    .single();

  if (error) {
    return res.status(500).json({ error: "Database error" });
  }

  res.json({
    success: true,
    id: data.id,
    url: `https://hero-ai.vercel.app/game/${data.id}`
  });
}
