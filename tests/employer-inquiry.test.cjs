const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const Module = require('node:module');
const path = require('node:path');
const filename = path.resolve('src/lib/inquiry-handler.ts');
let mails = []; let rejectMail = false;
const mod = new Module(filename, module); mod.filename = filename; mod.paths = module.paths;
const original = mod.require.bind(mod);
mod.require = name => name === 'nodemailer' ? { createTransport: () => ({ sendMail: async payload => { mails.push(payload); return { accepted: rejectMail ? [] : payload.to, rejected: rejectMail ? payload.to : [] }; }, close() {} }) } : original(name);
mod._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,filename);
const {handleInquiry} = mod.exports;
const base = { name:'Test employer',email:'employer@example.com',message:'Test inquiry' };
const request = data => new Request('https://example.com/api/inquiry',{method:'POST',headers:{origin:'https://example.com','content-type':'application/json'},body:JSON.stringify(data)});
test('inquiries work without bot credentials and retain required fields and delivery feedback',async()=>{
 const keys=['SMTP_HOST','SMTP_USER','SMTP_PASSWORD']; const previous=keys.map(key=>process.env[key]);
 try {
  keys.forEach(key=>process.env[key]='test-only');
  assert.equal((await handleInquiry(request({...base,email:''}))).status,400);
  assert.equal((await handleInquiry(request(base))).status,200);
  assert.deepEqual(mails[0].to,['bd@emeraldisle.lk','admin@emerldisle.lk']);
  assert.equal(mails[0].replyTo,base.email);
  assert.equal((await handleInquiry(request(base),true)).status,400);
  assert.equal((await handleInquiry(request({...base,subject:'General question',phone:'+94 77 123 4567'}),true)).status,200);
  assert.deepEqual(mails[1].to,['info@emeraldisle.lk']);
  rejectMail=true;
  assert.equal((await handleInquiry(request(base))).status,502);
  delete process.env.SMTP_PASSWORD;
  assert.equal((await handleInquiry(request(base))).status,503);
 } finally { keys.forEach((key,i)=>previous[i]===undefined?delete process.env[key]:process.env[key]=previous[i]); }
});
