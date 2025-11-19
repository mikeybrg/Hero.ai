import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const { id, html } = req.body;

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { error } = await supabase.from("games").insert([
    { id, html }
  ]);

  if (error) {
    return res.status(500).json({ error });
  }

  res.status(200).json({ success: true });
}
