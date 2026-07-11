# LEMKEN Customer Assistant — Demo

An AI FAQ chatbot for existing LEMKEN customers. Customers ask about products,
wear parts, operating manuals, ISOBUS and service, and get an instant answer.
Built with **Next.js (App Router)** and the **Anthropic API**, ready to deploy
on **Vercel**.

The Anthropic API key lives **only on the server** (a Vercel serverless
function), so it is never exposed to the customer's browser. Responses stream in
token-by-token so it feels fast.

---

## 1. Get it running locally (optional)

```bash
npm install
cp .env.example .env.local     # then paste your real key into .env.local
npm run dev                    # open http://localhost:3000
```

You need an Anthropic API key from https://console.anthropic.com → **API Keys**.

---

## 2. Deploy to Vercel (the demo link you share)

### Easiest — via GitHub
1. Push this folder to a new GitHub repo.
2. Go to https://vercel.com → **Add New… → Project** → import the repo.
3. Before the first deploy, open **Environment Variables** and add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your key (`sk-ant-...`)
4. Click **Deploy**. In ~1 minute you get a public URL like
   `https://lemken-assistant.vercel.app` to share.

### Or — via the Vercel CLI
```bash
npm i -g vercel
vercel                       # follow prompts to link/create the project
vercel env add ANTHROPIC_API_KEY   # paste your key when asked
vercel --prod                # deploy to a public URL
```

> If you deploy without the key, the chat loads but replies with a clear
> "not configured yet" message. Add the key in **Project → Settings →
> Environment Variables**, then redeploy.

---

## 3. Make it convincing (customise for the demo)

Everything the bot "knows" lives in **`lib/knowledge.ts`**:

- **`KNOWLEDGE_BASE`** — the LEMKEN product/service facts. Add real FAQ answers,
  specific machine details, or paste in trimmed manual sections here.
- **`SYSTEM_PROMPT`** — how the bot behaves (tone, safety rules, when to hand
  off to a dealer). It's deliberately told **not to invent** torque values,
  calibration rates, etc., and to point to the real LEONIS manuals portal and
  dealer locator instead.
- **`SUGGESTED_QUESTIONS`** — the starter chips on the welcome screen.

Change the colours/branding in **`app/globals.css`** (the `--lemken-*`
variables at the top).

### Model / cost
Default model is `claude-sonnet-5`. For a cheaper, faster demo set
`LEMKEN_MODEL=claude-haiku-4-5-20251001` as an env var. History is capped to the
last 12 turns and 1024 output tokens to keep cost predictable.

---

## 4. What the real production version would add

This demo hard-codes a curated knowledge base into the prompt. The next step for
a real deployment is **retrieval (RAG)**: index LEMKEN's actual operating
manuals / LEONIS docs, and have the bot pull the relevant passages per question
so it can answer with real, model-specific figures and cite the source manual.
The chat UI and API structure here stay the same — you swap the static
`KNOWLEDGE_BASE` for a retrieval step inside `app/api/chat/route.ts`.

---

*Unofficial demo — not affiliated with or endorsed by LEMKEN GmbH & Co. KG.*
