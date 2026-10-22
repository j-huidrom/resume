# huidrom.com — Phase 06: Ask Hudi end-to-end MVP

This package replaces the complete website source and introduces the first live Ask Hudi path: browser chat → Cloudflare Worker → public portfolio knowledge JSON → OpenAI Responses API → answer and source links.

## What is included

- Existing editorial homepage and portrait, retained.
- A functional Ask Hudi chat interface with suggested prompts, reset/new-chat control, session-only message state, bounded recent history, and source links.
- `public/knowledge/knowledge.json`: initial public-safe knowledge base built from professional and project information shared by Jashyawanta. Facts are qualified where details or outcomes are not yet documented.
- `src/worker.js`: `/api/chat` and `/api/health`, simple keyword retrieval, input limits, same-origin checks, best-effort isolate-local request throttling, OpenAI API integration, and `store: false`.
- `scripts/test-ask-hudi.mjs`: no-dependency Node smoke test for the deployed health endpoint and a real end-to-end message.
- `wrangler.jsonc`: Worker + static assets configuration; only `/api/*` invokes Worker code first.

## Important knowledge-base boundary

The knowledge JSON is deliberately **public-safe** and is served as a public asset. It contains professional profile, career timeline, platform work at a high level, leadership principles, public project summaries, and public contact details. It excludes private medical, family, financial, and confidential employer details. Do not add anything to this file unless it is safe to publish on the open internet. It is not a private memory store.

Some topics—especially detailed ZIDM outcomes, awards, and exact project maturity—are marked as requiring further verification. Ask Hudi must not invent missing metrics or imply that a prototype is a production product.

## One-time deployment setup

1. Download `huidrom-phase-6.zip` to your Windows Downloads folder and run your existing `update-huidrom-site.bat`.
2. Cloudflare must deploy the repository as a Worker with the included `wrangler.jsonc` (Worker entry point `src/worker.js`, static assets from `public/`). If the current Cloudflare Git integration is configured for static-only Pages deployment, change it to a Workers build/deploy flow that reads this Wrangler config before testing `/api/*`.
3. Configure the OpenAI API key as a **Cloudflare Worker secret**, not in this ZIP and not in Git. From an authenticated terminal in the repository, the one-time command is:

   ```bash
   npx wrangler secret put OPENAI_API_KEY
   ```

   Paste the API key only into the interactive prompt. Never put the key in `wrangler.jsonc`, `script.js`, or any committed file. The model is configured as `gpt-5.5` in `wrangler.jsonc` and can be changed there if needed.
4. Confirm the deployed Worker has the `OPENAI_API_KEY` secret and the `ASSETS` binding, then open `https://huidrom.com/api/health`. Expected JSON includes `ok: true`, `apiKeyConfigured: true`, and `knowledgeAvailable: true`.
5. Open `huidrom.com`, go to Ask Hudi, and send a test message.

> Your existing BAT pushes code to GitHub; it does not create Cloudflare secrets. The secret setup is a separate, one-time authenticated step. If the current Cloudflare project is Pages-only, the backend route will not work until its deployment mode is configured for the Worker entry point.

## End-to-end test

Requires Node.js 18+ and a deployed, configured Worker. From the repository root:

```bash
node scripts/test-ask-hudi.mjs
```

Optional environment variables:

```bash
ASK_HUDI_BASE_URL=https://huidrom.com
ASK_HUDI_TEST_QUESTION="How would you approach AI-native engineering?"
```

Expected result: the script checks `/api/health`, sends a real message through the knowledge retrieval and OpenAI API, then prints the answer and the portfolio source links. This consumes an OpenAI API request.

## API contract

- `GET /api/health` — service status, API-secret presence, knowledge availability; never returns the secret.
- `POST /api/chat` — accepts `{ "messages": [{"role":"user|assistant","content":"..."}], "pageContext": {"path":"/", "section":"ask-hudi"} }`.
- Successful response: `{ "answer": "...", "sources": [{"title":"...","href":"/#experience"}], "requestId":"..." }`.
- Errors return `{ "error": { "code": "...", "message": "..." } }`.

## Session and security notes

- Chat history is held only in JavaScript memory; no `localStorage`, cookies, or app database are used. Refreshing the page clears the transcript.
- The Worker sends `store: false` to the OpenAI Responses API. This is a request not to store the response object, not a guarantee of zero provider-side processing or retention; applicable provider data policies still apply.
- The browser never receives the API key. Input sizes and output tokens are bounded; cross-origin browser requests are rejected.
- The current rate limiter is best-effort and isolate-local. Before promoting the chatbot broadly, configure a Cloudflare rate-limiting rule or binding and monitor actual usage/cost.
- The knowledge file is public by design. Never put secrets, personal medical/family/financial details, private conversations, or employer-confidential information in it.
- This first retrieval pass is intentionally lightweight lexical matching. Improve coverage with tests and knowledge curation before adding vector search, a database, saved memory, or agent tools.

## What to verify after deployment

1. Existing homepage sections and portrait still render.
2. Ask Hudi shows the live chat, suggested prompts, reset control, and session-only note.
3. `/api/health` returns `ok: true`, `apiKeyConfigured: true`, `knowledgeAvailable: true`.
4. A message receives a real answer and one or more source links.
5. Ask about career facts; answer should use the knowledge base and avoid invented outcomes.
6. Ask a general engineering question; answer should provide general guidance without claiming personal implementation.
7. Refresh the page; the conversation should be cleared.
8. Mobile chat fits the screen and the input/send control works.

## Next iteration

Collect representative questions and failed retrievals, then curate source facts, prompts, response tone, and tests. Do not add more infrastructure until the MVP demonstrates a need.
