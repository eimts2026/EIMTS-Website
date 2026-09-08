const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const source = fs.readFileSync(require.resolve('../src/lib/auth-policy.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const policy = { exports: {} };
new Function('exports', compiled.outputText)(policy.exports);
const { canAccessRoute, safeNext } = policy.exports;

test('missing and unknown roles cannot access protected pages', () => {
  for (const role of [undefined, '', 'candidate', 'ADMIN']) {
    for (const route of ['/', '/jobs/new', '/applications', '/projects/new']) {
      assert.equal(canAccessRoute(route, role), false);
    }
  }
});
test('viewer cannot open editor pages or candidate records', () => {
  for (const route of ['/jobs/new', '/jobs/123', '/hero/new', '/popups/123', '/applications', '/projects/new']) {
    assert.equal(canAccessRoute(route, 'viewer'), false);
  }
  assert.equal(canAccessRoute('/', 'viewer'), true);
});
test('editors can publish but project editors require admin', () => {
  for (const route of ['/jobs/new', '/hero/123', '/popups/new', '/applications']) {
    assert.equal(canAccessRoute(route, 'editor'), true);
  }
  assert.equal(canAccessRoute('/projects/123', 'editor'), false);
  assert.equal(canAccessRoute('/projects/123', 'admin'), true);
});
test('login destinations reject external URLs and auth loops', () => {
  for (const value of [null, 'https://evil.example', '//evil.example', '/..//evil.example', '/\\evil.example', '/login', '/reset-password', '/auth/callback', '/access-denied', '/\nevil']) {
    assert.equal(safeNext(value), '/');
  }
  assert.equal(safeNext('/jobs/123?tab=details'), '/jobs/123?tab=details');
});
