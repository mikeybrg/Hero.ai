async function send() {
  const input = document.getElementById("input").value;
  const output = document.getElementById("output");

  output.innerHTML = "Thinking...";

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: input }),
  });

  const data = await res.json();
  output.innerHTML = data.reply;
}
