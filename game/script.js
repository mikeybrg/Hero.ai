document.getElementById("generate").onclick = async () => {
  const prompt = document.getElementById("prompt").value;
  const status = document.getElementById("status");

  status.innerHTML = "⏳ Generating game...";

  const genRes = await fetch("/api/generate-game", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  const genData = await genRes.json();
  const html = genData.html;

  const id = Math.random().toString(36).slice(2, 10);

  status.innerHTML = "💾 Saving game...";

  await fetch("/api/save-game", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, html })
  });

  status.innerHTML = "✅ Done!";
  
  window.location.href = `/game/${id}`;
};
