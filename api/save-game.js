import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://wbggwezvocfreijjfslg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiZ2d3ZXp2b2NmcmVpampmc2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwODY1NjgsImV4cCI6MjA3NjY2MjU2OH0.PrHa4y8KiCHwEektM1oCms4W9qKEeC6eRtxzPCAInlw";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const { html } = req.body;
    if (!html) {
      res.status(400).json({ error: "No HTML provided" });
      return;
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const { data, error } = await supabase
      .from("games")
      .insert([{ html }])
      .select("id")
      .single();

    if (error) throw error;

    const id = data.id;
    const shareURL = `/game/${id}.html`;

    res.status(200).json({ url: shareURL });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
