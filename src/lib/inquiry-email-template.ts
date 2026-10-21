type InquiryKind = "contact" | "employer";

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]!);

const field = (input: Record<string, string>, key: string) =>
  typeof input[key] === "string" ? input[key].trim() : "";

const emailLink = (email: string) => `mailto:${encodeURIComponent(email).replace(/%40/gi, "@")}`;

function websiteLink(website: string) {
  try {
    const url = new URL(website);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}

type Detail = { label: string; value: string; href?: string };

function detailRow({ label, value, href }: Detail) {
  const content = href
    ? `<a href="${escapeHtml(href)}" style="color:#08664c;text-decoration:underline;overflow-wrap:anywhere">${escapeHtml(value)}</a>`
    : escapeHtml(value);
  return `<tr><td style="padding:14px 0;border-bottom:1px solid #e3ebe5">
    <p style="margin:0 0 5px;color:#62766b;font-size:11px;font-weight:700;letter-spacing:1.3px;text-transform:uppercase">${escapeHtml(label)}</p>
    <p style="margin:0;color:#17382d;font-size:15px;line-height:1.5;overflow-wrap:anywhere">${content}</p>
  </td></tr>`;
}

export function inquiryEmailTemplate(kind: InquiryKind, input: Record<string, string>) {
  const contact = kind === "contact";
  const name = field(input, "name");
  const email = field(input, "email");
  const phone = field(input, "phone");
  const company = contact ? "" : field(input, "company");
  const website = contact ? "" : field(input, "website");
  const requirement = contact ? "" : field(input, "subject");
  const message = field(input, "message");
  const category = contact ? "GENERAL CONTACT" : "CLIENT INQUIRY";
  const title = contact ? "New general contact message" : "New client inquiry";
  const identity = company || name;
  const details: Detail[] = [
    ...(!contact && company ? [{ label: "Company", value: company }] : []),
    { label: "Name", value: name },
    { label: "Email", value: email, href: emailLink(email) },
    { label: "Phone", value: phone },
    ...(!contact && website ? [{ label: "Website", value: website, href: websiteLink(website) }] : []),
  ].filter(detail => detail.value);
  const text = [
    title,
    category,
    "",
    ...details.map(detail => `${detail.label}: ${detail.value}`),
    ...(requirement ? ["", `Workforce requirement: ${requirement}`] : []),
    "",
    "Message:",
    message,
    "",
    `Reply to this email to contact ${name || "the sender"} directly.`,
  ].join("\n");
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
  <body style="margin:0;background:#f2f5f1;font-family:Arial,Helvetica,sans-serif;color:#17382d">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(category)} · ${escapeHtml(identity)} · ${escapeHtml(email)}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f2f5f1"><tr><td align="center" style="padding:28px 12px">
  <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #dce6df;border-radius:14px;overflow:hidden">
  <tr><td style="padding:30px 32px;background:#103c2f;border-bottom:4px solid #e8ba54">
    <p style="margin:0 0 23px;color:#f4dfac;font-size:12px;font-weight:700;letter-spacing:2px">EMERALD ISLE</p>
    <p style="margin:0 0 9px;color:#e8ba54;font-size:11px;font-weight:700;letter-spacing:1.5px">${category}</p>
    <h1 style="margin:0;color:#ffffff;font-size:27px;line-height:1.25;font-weight:700">${title}</h1>
  </td></tr>
  <tr><td style="padding:28px 32px 8px">
    <p style="margin:0 0 5px;color:#62766b;font-size:11px;font-weight:700;letter-spacing:1.3px;text-transform:uppercase">${contact ? "Sender" : "Company / sender"}</p>
    <p style="margin:0;color:#17382d;font-size:23px;font-weight:700;line-height:1.3;overflow-wrap:anywhere">${escapeHtml(identity)}</p>
    <p style="margin:7px 0 0;color:#62766b;font-size:14px;overflow-wrap:anywhere">${escapeHtml(email)}</p>
  </td></tr>
  <tr><td style="padding:12px 32px 26px">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">${details.map(detailRow).join("")}</table>
    ${requirement ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:24px;background:#f6f8f4;border-left:4px solid #e8ba54"><tr><td style="padding:17px 19px"><p style="margin:0 0 9px;color:#62766b;font-size:11px;font-weight:700;letter-spacing:1.3px">WORKFORCE REQUIREMENT</p><p style="margin:0;color:#17382d;font-size:15px;line-height:1.6;overflow-wrap:anywhere">${escapeHtml(requirement)}</p></td></tr></table>` : ""}
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:24px;background:#f6f8f4;border-left:4px solid #e8ba54"><tr><td style="padding:17px 19px"><p style="margin:0 0 9px;color:#62766b;font-size:11px;font-weight:700;letter-spacing:1.3px">MESSAGE</p><p style="margin:0;color:#17382d;font-size:15px;line-height:1.7;overflow-wrap:anywhere">${escapeHtml(message).replace(/\r\n|\r|\n/g, "<br>")}</p></td></tr></table>
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin-top:25px"><tr><td style="background:#e8ba54;border-radius:6px"><a href="${escapeHtml(emailLink(email))}" style="display:inline-block;padding:13px 20px;color:#17382d;font-size:14px;font-weight:700;text-decoration:none">Reply to sender</a></td></tr></table>
    <p style="margin:15px 0 0;color:#62766b;font-size:12px;line-height:1.5">You can also use Reply in your email app to contact the sender directly.</p>
  </td></tr>
  <tr><td style="padding:17px 32px;background:#f6f8f4;color:#62766b;font-size:11px;line-height:1.5">Emerald Isle Manpower &amp; Travel Services · Website ${contact ? "contact" : "client"} inquiry</td></tr>
  </table></td></tr></table></body></html>`;
  return { html, text };
}
