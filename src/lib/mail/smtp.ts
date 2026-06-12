import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

export type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  notificationEmail: string;
};

function readSmtpConfig(): SmtpConfig {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const secure = process.env.SMTP_SECURE;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const notificationEmail = process.env.QUOTE_NOTIFICATION_EMAIL;

  const missing = [
    !host && "SMTP_HOST",
    !port && "SMTP_PORT",
    secure === undefined && "SMTP_SECURE",
    !user && "SMTP_USER",
    !pass && "SMTP_PASS",
    !notificationEmail && "QUOTE_NOTIFICATION_EMAIL",
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(
      `Email is not configured. Missing: ${missing.join(", ")}.`
    );
  }

  return {
    host: host!,
    port: Number(port),
    secure: secure === "true",
    user: user!,
    pass: pass!,
    notificationEmail: notificationEmail!,
  };
}

export function createMailTransporter(config: SmtpConfig): Transporter {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

export function getSmtpConfig(): SmtpConfig {
  return readSmtpConfig();
}
