/**
 * Career Suite — Secure AI Proxy + Admin Kill-Switch (Cloudflare Worker)
 * -----------------------------------------------------------------------
 * Holds your real API key as a server-side secret so the Career Suite app
 * can be shared (e.g. with family) without any key ever touching a
 * browser, localStorage, or your GitHub repo. Also gives you a genuine
 * remote ON/OFF switch you can flip from inside the app's Admin Panel,
 * without redeploying anything.
 *
 * ───────────────────────────────────────────────────────────────────────
 * SETUP (about 10 minutes total, one time)
 * ───────────────────────────────────────────────────────────────────────
 *
 * STEP 1 — Create the Worker
 *   1. https://dash.cloudflare.com → Workers & Pages → Create → Worker
 *   2. Paste this whole file as the Worker's code → Deploy.
 *
 * STEP 2 — Create a KV namespace (this is what makes the ON/OFF switch
 *          actually "remember" its state between requests)
 *   1. Workers & Pages → KV (left sidebar) → Create a namespace
 *   2. Name it anything, e.g. "career_suite_toggle" → Create
 *
 * STEP 3 — Bind the KV namespace to this Worker
 *   1. Open your Worker → Settings → Variables and Secrets → KV Namespace Bindings
 *   2. Add binding: Variable name = TOGGLE_KV, KV namespace = the one you just made
 *
 * STEP 4 — Add your secrets (Settings → Variables and Secrets → add as SECRET,
 *          not plain text, so they're never visible in the dashboard UI again)
 *      PROVIDER      = "anthropic"   (or "gemini")
 *      API_KEY       = your real API key (sk-ant-... or AIza...)
 *      MODEL         = "claude-sonnet-4-6"  (or "gemini-2.5-flash")
 *      ADMIN_SECRET  = a passphrase ONLY YOU know, e.g. "correct-horse-battery-42"
 *                      (this is what lets the app's Admin Panel remotely
 *                      flip the switch — treat it like a password)
 *      ALLOWED_ORIGIN= your app's URL, e.g. "https://you.github.io"  (or "*" if unsure)
 *
 * STEP 5 — Point the app at this Worker
 *   In Career Suite → Settings → API Mode → "Secure Proxy" → paste your
 *   Worker URL, e.g. https://career-suite-proxy.you.workers.dev
 *   In the app's Admin Panel, enter the same ADMIN_SECRET passphrase from
 *   Step 4 to unlock remote controls — this lets you toggle family access
 *   on/off from inside the app itself, any time, without touching Cloudflare.
 *
 * That's it. The API key itself never leaves this Worker.
 */

const DEFAULT_ENABLED = true; // if the KV value has never been set, default to ON

export default {
  async fetch(request, env) {
    const origin = env.ALLOWED_ORIGIN || "*";
    const cors = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    // GET → lightweight status check (used by the app to show "AI paused" banners)
    if (request.method === "GET") {
      const enabled = await getEnabled(env);
      return json({ enabled }, 200, cors);
    }

    if (request.method !== "POST") {
      return json({ error: "Unsupported method" }, 405, cors);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400, cors);
    }

    // ── Admin action: check status ──
    if (body.action === "status") {
      const enabled = await getEnabled(env);
      return json({ enabled }, 200, cors);
    }

    // ── Admin action: toggle ON/OFF ──
    // Requires the ADMIN_SECRET passphrase — this is the real security
    // boundary. Anyone without it cannot flip the switch, no matter what
    // they see in the app's browser code.
    if (body.action === "toggle") {
      if (!env.ADMIN_SECRET || body.adminSecret !== env.ADMIN_SECRET) {
        return json({ error: "Invalid admin passphrase" }, 401, cors);
      }
      const current = await getEnabled(env);
      const next = typeof body.setTo === "boolean" ? body.setTo : !current;
      await env.TOGGLE_KV.put("enabled", next ? "true" : "false");
      return json({ enabled: next }, 200, cors);
    }

    // ── Normal AI call ──
    const enabled = await getEnabled(env);
    if (!enabled) {
      return json({ error: "AI access has been paused by the admin. Please try again later." }, 503, cors);
    }

    // Optional shared passphrase so strangers who guess the URL can't burn your credits
    if (env.ACCESS_CODE) {
      const url = new URL(request.url);
      if (url.searchParams.get("code") !== env.ACCESS_CODE) {
        return json({ error: "Invalid or missing access code" }, 401, cors);
      }
    }

    const system = String(body.system || "");
    const messages = Array.isArray(body.messages) && body.messages.length
      ? body.messages.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: String(m.content || "") }))
      : [{ role: "user", content: String(body.prompt || "") }];

    const totalChars = system.length + messages.reduce((n, m) => n + m.content.length, 0);
    if (totalChars > 200000) {
      return json({ error: "Payload too large" }, 413, cors);
    }

    const provider = (env.PROVIDER || "anthropic").toLowerCase();

    try {
      let text = "";

      if (provider === "anthropic") {
        const r = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": env.API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: env.MODEL || "claude-sonnet-4-6",
            max_tokens: 8000,
            system: system,
            messages: messages,
          }),
        });
        const data = await r.json();
        if (!r.ok) return json({ error: data.error?.message || "Anthropic API error" }, r.status, cors);
        text = (data.content || []).map(c => c.text || "").join("");

      } else if (provider === "gemini") {
        const model = env.MODEL || "gemini-2.5-flash";
        const contents = messages.map(m => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }],
        }));
        const r = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: system }] },
              contents,
              generationConfig: { temperature: 0.5, maxOutputTokens: 4096 },
            }),
          }
        );
        const data = await r.json();
        if (!r.ok) return json({ error: data.error?.message || "Gemini API error" }, r.status, cors);
        text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      } else {
        return json({ error: `Unknown PROVIDER: ${provider}` }, 500, cors);
      }

      return json({ text }, 200, cors);
    } catch (err) {
      return json({ error: "Upstream request failed: " + err.message }, 502, cors);
    }
  },
};

async function getEnabled(env) {
  if (!env.TOGGLE_KV) return DEFAULT_ENABLED; // KV not bound yet — fail open so setup isn't blocked
  const v = await env.TOGGLE_KV.get("enabled");
  if (v === null) return DEFAULT_ENABLED;
  return v === "true";
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}
