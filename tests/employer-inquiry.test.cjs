const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const Module = require('node:module');
const path = require('node:path');

const filename = path.resolve('src/lib/inquiry-handler.ts');
let queued = [];
let deliveryAttempts = 0;
let deliveryFailure = false;
class SubmissionError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}
const mocks = {
  './bot-protection': { verifyBotProtection: async () => {}, SubmissionError },
  './submission-service': { limitSubmission: async () => {} },
  './inquiry-queue': { queueInquiry: async (_request, kind, input) => { queued.push({ kind, input }); return 'test-reference'; } },
  './inquiry-delivery': { processInquiryQueue: async () => { deliveryAttempts++; if (deliveryFailure) throw new Error('test smtp failure'); return { claimed: 1, sent: 1, deferred: 0, sentIds: ['test-reference'], deferredIds: [], attentionIds: [] }; } },
  'next/server': { NextResponse: { json: (body, init) => Response.json(body, init) } },
};
const mod = new Module(filename, module); mod.filename = filename; mod.paths = module.paths;
const original = mod.require.bind(mod);
mod.require = name => Object.hasOwn(mocks, name) ? mocks[name] : original(name);
mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, filename);
const { handleInquiry } = mod.exports;
const base = { name: 'Test employer', email: 'employer@example.com', phone: '+94 77 123 4567', message: 'Test inquiry' };
const contactBase = { name: 'Test contact', email: 'visitor@example.com', phone: '+94 77 123 4567', message: 'Contact message' };
const request = data => new Request('https://example.com/api/employer-inquiry', { method: 'POST', headers: { origin: 'https://example.com', 'content-type': 'application/json', 'Idempotency-Key': 'a33e947f-36f7-4e89-8d4d-f64e1fc7f38c' }, body: JSON.stringify(data) });

test('employer inquiries are queued and delivery is attempted immediately', async () => {
  const keys = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASSWORD']; const previous = keys.map(key => process.env[key]);
  keys.forEach(key => process.env[key] = 'test-only');
  queued = []; deliveryAttempts = 0; deliveryFailure = false;
  try {
    assert.equal((await handleInquiry(request({ ...base, email: '' }))).status, 400);
    const response = await handleInquiry(request(base));
    assert.equal(response.status, 202);
    assert.equal(deliveryAttempts, 1);
    assert.equal(queued.length, 1);
    assert.equal(queued[0].kind, 'employer');
    assert.deepEqual(queued[0].input, { name: base.name, email: base.email, company: '', website: '', phone: base.phone, subject: '', message: base.message });
    assert.equal((await response.json()).delivery, 'accepted');
  } finally { keys.forEach((key, i) => previous[i] === undefined ? delete process.env[key] : process.env[key] = previous[i]); }
});

test('accepted form submission remains queued if immediate mail processing fails', async () => {
  const keys = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASSWORD']; const previous = keys.map(key => process.env[key]);
  keys.forEach(key => process.env[key] = 'test-only');
  queued = []; deliveryAttempts = 0; deliveryFailure = true;
  try {
    const response = await handleInquiry(request(base));
    assert.equal(response.status, 202);
    assert.equal((await response.json()).delivery, 'queued');
    assert.equal(queued.length, 1);
  } finally { deliveryFailure = false; keys.forEach((key, i) => previous[i] === undefined ? delete process.env[key] : process.env[key] = previous[i]); }
});

test('contact inquiries omit website and subject and do not require a subject', async () => {
  const keys = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASSWORD']; const previous = keys.map(key => process.env[key]);
  keys.forEach(key => process.env[key] = 'test-only');
  queued = []; deliveryAttempts = 0; deliveryFailure = false;
  try {
    const response = await handleInquiry(request({ ...contactBase, subject: 'ignored', website: 'https://ignored.example' }), true);
    assert.equal(response.status, 202);
    assert.deepEqual(queued[0].input, contactBase);
    assert.equal(queued[0].kind, 'contact');
  } finally { keys.forEach((key, i) => previous[i] === undefined ? delete process.env[key] : process.env[key] = previous[i]); }
});
