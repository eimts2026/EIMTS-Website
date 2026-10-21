const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

function load(file, mocks) {
  const filename = path.resolve(file);
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = module.paths;
  const original = mod.require.bind(mod);
  mod.require = name => Object.hasOwn(mocks, name) ? mocks[name] : original(name);
  mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText, filename);
  return mod.exports;
}

test('email routing includes CC recipients in headers and inquiry acceptance checks', async () => {
  const keys = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASSWORD', 'CRON_SECRET'];
  const previous = keys.map(key => process.env[key]);
  let mails = [];
  let updates = [];
  let jobs = [];
  let rejectCc = false;
  let throwSmtp = false;
  const nodemailer = { createTransport: () => ({
    sendMail: async payload => {
      if (throwSmtp) { const error = new Error('simulated smtp outage'); error.code = 'ECONNECTION'; throw error; }
      mails.push(payload);
      const recipients = [payload.to, payload.cc].flat();
      return { accepted: rejectCc ? [recipients[0]] : recipients, rejected: rejectCc ? recipients.slice(1) : [] };
    }, close() {},
  }) };
  const db = {
    from: () => {
      const chain = { update: value => { updates.push(value); return chain; }, delete: () => chain,
        eq: () => chain, gte: () => chain, lt: () => chain, in: () => chain };
      return chain;
    },
    rpc: async () => ({ data: jobs, error: null }),
  };
  try {
    keys.forEach(key => process.env[key] = 'test-only');
    const { processInquiryQueue } = load('src/lib/inquiry-delivery.ts', {
      'server-only': {}, nodemailer, './submission-service': { submissionDatabase: () => db },
    });
    for (const kind of ['employer', 'contact']) {
      mails = []; updates = [];
      jobs = [{ id: 'test-inquiry', kind, attempts: 1, payload: { name: 'Test', email: 'person@example.com', message: 'Test inquiry' } }];
      assert.deepEqual(await processInquiryQueue(), { claimed: 1, sent: 1, deferred: 0, sentIds: ['test-inquiry'], deferredIds: [], attentionIds: [] });
      assert.deepEqual(mails[0].to, ['info@emeraldislemanpower.com']);
      assert.deepEqual(mails[0].cc, kind === 'employer' ? ['admin@emeraldisle.lk', 'it@emeraldisle.lk'] : ['admin@emeraldisle.lk']);
      assert.equal(mails[0].replyTo, 'person@example.com');
      if (kind === 'contact') {
        assert.equal(mails[0].subject, '[GENERAL CONTACT] Test | person@example.com');
        assert.match(mails[0].text, /^email: person@example\.com/m);
        assert.doesNotMatch(mails[0].text, /^(website|subject):/m);
      } else {
        assert.equal(mails[0].subject, '[CLIENT INQUIRY] Test | person@example.com');
      }
      assert.ok(updates.some(value => value.status === 'sent'));
    }
    throwSmtp = true; updates = [];
    assert.deepEqual(await processInquiryQueue(), { claimed: 1, sent: 0, deferred: 1, sentIds: [], deferredIds: ['test-inquiry'], attentionIds: [] });
    assert.ok(updates.some(value => value.status === 'pending' && value.last_error === 'smtp_delivery_failed:ECONNECTION'));
    throwSmtp = false;
    rejectCc = true; updates = [];
    assert.deepEqual(await processInquiryQueue(), { claimed: 1, sent: 0, deferred: 1, sentIds: [], deferredIds: [], attentionIds: ['test-inquiry'] });
    assert.ok(updates.some(value => value.status === 'dead' && value.last_error === 'partial_acceptance'));
    rejectCc = false; mails = [];
    const { sendApplicationEmail } = load('src/lib/email.ts', {
      nodemailer, './application-email-template': { applicationEmailTemplate: () => ({ text: 'Test application' }) },
    });
    assert.deepEqual(await sendApplicationEmail({
      jobTitle: 'Test vacancy', category: 'Test', fullName: 'Test Candidate', age: 25,
      email: 'candidate@example.com', phone: '+94771234567', cvFileName: 'test.pdf',
      cvContentType: 'application/pdf', cvBytes: new TextEncoder().encode('%PDF-test').buffer,
    }), { sent: true });
    assert.equal(mails[0].to, 'cv@emeraldisle.lk');
    assert.equal(mails[0].cc, 'admin@emeraldisle.lk');
    assert.equal(mails[0].replyTo, 'candidate@example.com');
    assert.equal(mails[0].attachments.length, 1);
    assert.equal(mails[0].attachments[0].content.toString(), '%PDF-test');
  } finally {
    keys.forEach((key, index) => previous[index] === undefined ? delete process.env[key] : process.env[key] = previous[index]);
  }
});
