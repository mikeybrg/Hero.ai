// ---------- DEBUGGING + ROBUST PREVIEW HANDLER ----------
async function handleGenerate() {
  const promptInput = document.getElementById("prompt") || { value: "" };
  const iframe = document.getElementById("preview-iframe"); // change if your iframe id is different
  const status = document.getElementById("status") || (document.body.appendChild(document.createElement('p')) && document.getElementById('status'));

  status.textContent = "🎮 Generating... (waiting for response)";

  try {
    const resp = await fetch("/api/generate-game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: promptInput.value || "make a simple ping pong game" }),
    });

    // Save raw text for logging/debugging
    const raw = await resp.text();
    console.log("RAW response text:", raw);

    // Try parse JSON, if possible
    let data = null;
    try {
      data = JSON.parse(raw);
      console.log("Parsed JSON response:", data);
    } catch (e) {
      console.warn("Response is not JSON (will treat as raw HTML/text).");
    }

    // Try to find HTML candidate in possible fields
    const candidateHtml =
      // common fields we might get back from different implementations
      (data && (data.code || data.html || data.game || data.output_text || data.message)) ||
      // if data is a string after parse attempt, use raw
      raw ||
      "";

    // Quick sanity checks
    if (!candidateHtml || candidateHtml.length < 10) {
      console.error("No valid HTML returned. Showing raw response.");
      status.textContent = "❌ No game HTML returned. See console for raw response.";
      // Show raw response in a debug box on the page
      showDebugOutput(raw);
      return;
    }

    // If candidate looks like JSON error message, show it
    if (candidateHtml.trim().startsWith("{") && candidateHtml.includes("error")) {
      console.error("Error object returned:", candidateHtml);
      status.textContent = "❌ Backend returned an error. Check console.";
      showDebugOutput(candidateHtml);
      return;
    }

    // If candidate contains HTML-like content, render it in iframe
    const looksLikeHtml = /<\s*html|<\s*body|<\s*script|<!DOCTYPE/i.test(candidateHtml);
    if (looksLikeHtml) {
      console.log("Rendering candidateHtml in iframe.srcdoc");
      iframe.style.display = "block";
      iframe.srcdoc = candidateHtml;
      status.textContent = "✅ Game generated — preview below.";
      // also show raw in debug
      showDebugOutput(candidateHtml);
      return;
    }

    // If we get plain JS only (no html wrapper), wrap it into a small HTML template
    if (/function|document\.|canvas|window\./i.test(candidateHtml)) {
      console.log("Wrapping JS into HTML template and rendering.");
      const wrapped = `<!doctype html><html><head><meta charset="utf-8"></head><body>
        <div id="app"></div>
        <script>${candidateHtml}</script>
      </body></html>`;
      iframe.srcdoc = wrapped;
      iframe.style.display = "block";
      status.textContent = "✅ Game generated (JS wrapped) — preview below.";
      showDebugOutput(wrapped);
      return;
    }

    // Fallback: show raw text
    console.warn("Fallback - rendering raw text in debug output.");
    status.textContent = "⚠️ Response not recognized as game HTML/JS. See debug.";
    showDebugOutput(candidateHtml);

  } catch (err) {
    console.error("Fetch failed:", err);
    status.textContent = "❌ Network or server error — check console and Lovable logs.";
    showDebugOutput(String(err));
  }
}

// helper to put debug text on the page
function showDebugOutput(text) {
  let box = document.getElementById("debug-output");
  if (!box) {
    box = document.createElement("pre");
    box.id = "debug-output";
    box.style = "white-space:pre-wrap;background:#111;color:#fff;padding:12px;border-radius:8px;margin:12px 0;max-height:260px;overflow:auto;";
    document.body.appendChild(box);
  }
  box.textContent = text;
}
