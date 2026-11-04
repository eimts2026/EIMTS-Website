import nodemailer from "nodemailer";
import { applicationEmailTemplate, type ApplicationDetails } from "./application-email-template";

type ApplicationEmail = ApplicationDetails & {
  cvFileName: string;
  cvContentType: string;
  cvBytes: ArrayBuffer;
};

export function isEmailConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASSWORD,
  );
}

export async function sendApplicationEmail(application: ApplicationEmail) {
  if (!isEmailConfigured()) {
    return { sent: false as const, reason: "Email is not configured." };
  }

  const port = Number(process.env.SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 60000,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
  const template = applicationEmailTemplate(application);
  const result = await transporter.sendMail({
    from:
      process.env.APPLICATIONS_EMAIL_FROM ||
      `"Emerald Isle Website" <${process.env.SMTP_USER}>`,
    to: "cv@emeraldisle.lk",
    replyTo: application.email,
    subject: `[${application.category}] ${application.jobTitle} — ${application.fullName}`.replace(/[\r\n]/g, " "),
    ...template,
    attachments: [
      {
        filename: application.cvFileName,
        content: Buffer.from(application.cvBytes),
        contentType: application.cvContentType,
      },
    ],
  });

  if (!result.accepted.some(address => String(address).toLowerCase() === "cv@emeraldisle.lk")) {
    throw new Error("Recruitment mailbox did not accept the application.");
  }
  return { sent: true as const };
  } finally { transporter.close(); }
}
