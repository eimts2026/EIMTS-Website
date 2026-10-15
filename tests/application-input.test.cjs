const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
function load(path) {
  const module = {exports:{}};
  const compiled = ts.transpileModule(fs.readFileSync(path,'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}});
  new Function('exports','module',compiled.outputText)(module.exports,module);
  return module.exports;
}
const {validateApplication,readApplicationForm,MAX_APPLICATION_BYTES} = load('src/lib/application-input.ts');
const {safeNavigationUrl} = load('src/lib/safe-url.ts');
function validForm() {
  const form=new FormData();
  for(const [key,value] of Object.entries({job_id:'12345678-1234-4234-8234-123456789abc',name:"José O’Connor",age:'25',email:'candidate+jobs@example.com',phone:'+94 77 123 4567'})) form.set(key,value);
  form.set('cv',new File(['%PDF-1.7'], 'cv.pdf', {type:'application/pdf'}));return form;
}
test('accepts international names without stripping punctuation',()=>assert.equal(validateApplication(validForm()).fullName,"José O’Connor"));
test('rejects CRLF email/header payload',()=>{const form=validForm();form.set('email','a@example.com\r\nBcc: victim@example.com');assert.throws(()=>validateApplication(form));});
test('rejects duplicate identity fields',()=>{const form=validForm();form.append('email','other@example.com');assert.throws(()=>validateApplication(form));});
test('rejects files masquerading as text fields',()=>{const form=validForm();form.set('name',new File(['name'],'name'));assert.throws(()=>validateApplication(form));});
test('rejects malformed email and overlong names',()=>{const form=validForm();form.set('email','not-an-address');assert.throws(()=>validateApplication(form));form.set('email','a@example.com');form.set('name','a'.repeat(151));assert.throws(()=>validateApplication(form));});
test('rejects coercion of ages outside the intended format',()=>{for(const age of ['17','100','2e1','']){const form=validForm();form.set('age',age);assert.throws(()=>validateApplication(form));}});
test('parses a real multipart form',async()=>{const form=await readApplicationForm(new Request('http://localhost/api/applications',{method:'POST',body:validForm()}));assert.equal(validateApplication(form).email,'candidate+jobs@example.com');});
test('rejects oversized stream even with dishonest Content-Length',async()=>{const stream=new ReadableStream({start(controller){controller.enqueue(new Uint8Array(MAX_APPLICATION_BYTES+1));controller.close();}});const request=new Request('http://localhost/api/applications',{method:'POST',duplex:'half',headers:{'content-type':'multipart/form-data; boundary=test','content-length':'1'},body:stream});await assert.rejects(readApplicationForm(request),error=>error.status===413);});
test('returns controlled errors for broken multipart and wrong content type',async()=>{await assert.rejects(readApplicationForm(new Request('http://localhost',{method:'POST',headers:{'content-type':'multipart/form-data; boundary=test'},body:'broken'})));await assert.rejects(readApplicationForm(new Request('http://localhost',{method:'POST',body:'text'})),error=>error.status===415);});
test('blocks executable, protocol-relative and ambiguous CMS links',()=>{for(const url of ['javascript:alert(1)','data:text/html,test','//evil.test','/\\evil.test','https://user:pass@example.com','https://example.com\n'])assert.equal(safeNavigationUrl(url),null);assert.equal(safeNavigationUrl('/contact/'),'/contact/');assert.equal(safeNavigationUrl('https://example.com/jobs'),'https://example.com/jobs');});
