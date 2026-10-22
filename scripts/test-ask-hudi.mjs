const base = (process.env.ASK_HUDI_BASE_URL || 'https://huidrom.com').replace(/\/$/, '');
const question = process.env.ASK_HUDI_TEST_QUESTION || 'What engineering leadership experience is documented in the portfolio?';

const healthResponse = await fetch(`${base}/api/health`, { headers: { Accept: 'application/json' } });
let health;
try { health = await healthResponse.json(); } catch { throw new Error(`Health endpoint did not return JSON (HTTP ${healthResponse.status}). Check that the Worker is deployed.`); }
console.log('Health:', JSON.stringify(health));
if (!healthResponse.ok || !health.ok) throw new Error('Ask Hudi health check failed.');
if (!health.apiKeyConfigured) throw new Error('OPENAI_API_KEY is not configured as a Cloudflare Worker secret.');
if (!health.knowledgeAvailable) throw new Error('The Worker cannot load public/knowledge/knowledge.json.');

const response = await fetch(`${base}/api/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Origin': base },
  body: JSON.stringify({ messages: [{ role: 'user', content: question }], pageContext: { path: '/', section: 'ask-hudi' } })
});
const data = await response.json().catch(() => ({}));
if (!response.ok) throw new Error(`Chat failed (HTTP ${response.status}): ${JSON.stringify(data.error || data)}`);
if (typeof data.answer !== 'string' || !data.answer.trim()) throw new Error('Chat returned no answer.');
console.log('\nEND-TO-END TEST PASSED');
console.log('\nQuestion:', question);
console.log('\nAnswer:\n', data.answer);
console.log('\nSources:', JSON.stringify(data.sources || [], null, 2));
