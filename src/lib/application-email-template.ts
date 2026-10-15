export type ApplicationDetails = {
  jobTitle: string;
  category: string;
  fullName: string;
  age: number;
  email: string;
  phone: string;
};

const escapeHtml = (value: string | number) => String(value).replace(/[&<>"']/g, character => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]!);

export function applicationEmailTemplate(details: ApplicationDetails) {
  const rows = [["Full name", details.fullName], ["Age", details.age], ["Email", details.email], ["Phone", details.phone]];
  const text = [`Category: ${details.category}`, `Position: ${details.jobTitle}`, ...rows.map(([label, value]) => `${label}: ${value}`), "", "The candidate's CV is attached. Reply to this email to contact the candidate."].join("\n");
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>New job application</title></head>
  <body style="margin:0;background:#f2f5f1;font-family:Arial,sans-serif;color:#173c31">
  <div style="display:none;max-height:0;overflow:hidden">${escapeHtml(details.category)} · ${escapeHtml(details.jobTitle)} · ${escapeHtml(details.fullName)}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:32px 16px">
  <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;background:white;border:1px solid #dbe5de;border-radius:16px;overflow:hidden">
  <tr><td style="padding:30px;background:#073e30;color:white;border-bottom:4px solid #e9b94e">
  <p style="margin:0 0 24px;font-size:12px;letter-spacing:2px;color:#edc970">EMERALD ISLE · RECRUITMENT</p>
  <p style="margin:0 0 10px;font-size:13px;color:#b9d6c9">NEW APPLICATION / ${escapeHtml(details.category)}</p>
  <h1 style="margin:0;font-size:28px;line-height:1.2">${escapeHtml(details.jobTitle)}</h1></td></tr>
  <tr><td style="padding:30px"><p style="margin:0 0 20px;font-size:16px">A candidate has applied for this vacancy.</p>
  <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">${rows.map(([label, value]) => `<tr><th align="left" scope="row" style="width:100px;padding:14px 12px 14px 0;border-bottom:1px solid #e8eee9;font-size:12px;color:#63756b">${label}</th><td style="padding:14px 0;border-bottom:1px solid #e8eee9;font-size:15px;overflow-wrap:anywhere">${escapeHtml(value)}</td></tr>`).join("")}</table>
  <p style="padding:16px;background:#f1f6f0;border-left:3px solid #e9b94e;font-size:14px;line-height:1.6"><strong>CV attached</strong><br>Open the attachment to review the candidate's experience.</p>
  <p style="margin:22px 0 0;font-size:13px;color:#63756b">Reply to this email to contact the candidate directly.</p></td></tr>
  <tr><td style="padding:18px 30px;background:#f7f9f6;font-size:11px;color:#63756b">Emerald Isle · Website applications · cv@emeraldisle.lk</td></tr>
  </table></td></tr></table></body></html>`;
  return {html, text};
}
