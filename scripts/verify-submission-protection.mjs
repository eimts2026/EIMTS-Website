// Deterministic security checks. Uses mocked Siteverify responses; never sends
// real submissions, reads production secrets, or contacts an email provider.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";

function load(source, globals = {}) {
  const module = { exports: {} };
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { module, exports: module.exports, require: name => { if (name === "server-only") return {}; throw new Error(`Unexpected import ${name}`); }, Request, AbortSignal, URL, URLSearchParams, ...globals });
  return module.exports;
}

const botSource = await readFile(new URL("../src/lib/bot-protection.ts", import.meta.url), "utf8");
const params = load(await readFile(new URL("../src/lib/job-search-params.ts", import.meta.url), "utf8"));
assert.equal(params.parseJobSearch(new URLSearchParams("filter-title=nursing&size=12")).pageSize, 12);
assert.throws(() => params.parseJobSearch(new URLSearchParams("size=999")));
assert.throws(() => params.parseJobSearch(new URLSearchParams("sort=sql")));
assert.throws(() => params.parseJobSearch(new URLSearchParams({ "filter-title": "a".repeat(101) })));
assert.equal(params.jobSearchParams({ title:"chef",location:"",category:"",sort:"default",pageSize:6,cursor:"" }).toString(), "filter-title=chef");

const request = (token = "test-token", origin = "https://emeraldislemanpower.com") => new Request("https://emeraldislemanpower.com/api/applications", { method: "POST", headers: { origin, "x-turnstile-token": token } });
const env = { NODE_ENV:"production", TURNSTILE_SECRET_KEY:"unit-test-only", TURNSTILE_ALLOWED_HOSTNAMES:"emeraldislemanpower.com,www.emeraldislemanpower.com" };
let calls = 0;
const make = (result, options = {}) => load(botSource, {
  process: { env: { ...env, ...options.env } },
  fetch: async (_url, init) => { calls++; assert.equal(init.cache,"no-store"); if (options.unavailable) throw new Error("network"); return { ok:true, json:async()=>result }; },
});
await make({success:true,action:"application",hostname:"emeraldislemanpower.com"}).verifyBotProtection(request(),"application");
for (const result of [
  {success:false,action:"application",hostname:"emeraldislemanpower.com"},
  {success:true,action:"contact",hostname:"emeraldislemanpower.com"},
  {success:true,action:"application",hostname:"attacker.example"},
]) await assert.rejects(make(result).verifyBotProtection(request(),"application"),error=>error.status===403);
await assert.rejects(make({}, {unavailable:true}).verifyBotProtection(request(),"application"),error=>error.status===503);
const prior = calls;
await assert.rejects(make({}).verifyBotProtection(request(""),"application"),error=>error.status===400);
await assert.rejects(make({}).verifyBotProtection(request("x".repeat(2049)),"application"),error=>error.status===400);
await assert.rejects(make({}).verifyBotProtection(request("test","https://attacker.example"),"application"),error=>error.status===403);
await assert.rejects(make({}, {env:{TURNSTILE_SECRET_KEY:""}}).verifyBotProtection(request(),"application"),error=>error.status===503);
assert.equal(calls,prior,"Invalid requests must fail before contacting Siteverify");
console.log("Passed: search validation; valid verification; rejected/expired token; action/hostname mismatch; cross-origin request; token bounds; provider outage; missing credentials.");
