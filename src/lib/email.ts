import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Seyrn <noreply@seyrn.app>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://seyrn.app";

// ── Email 1: Report ready (sent immediately after payment) ──────

export async function sendReportReadyEmail({
  to,
  firstName,
  reportUrl,
}: {
  to: string;
  firstName?: string | null;
  reportUrl: string;
}) {
  const name = firstName?.trim() || null;
  const greeting = name ? `${name},` : "Hi,";

  return resend.emails.send({
    from: FROM,
    to,
    subject: name
      ? `Your Seyrn report is ready, ${name}`
      : "Your Seyrn report is ready",
    html: `
<div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 48px 24px; background: #0f0e0c; color: #f5f0e8;">
  <p style="font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase; color: #c9a84c; margin-bottom: 32px;">SEYRN</p>
  <p style="font-size: 17px; line-height: 1.6; margin-bottom: 24px;">${greeting}</p>
  <p style="font-size: 17px; line-height: 1.6; margin-bottom: 32px;">Your pattern analysis is complete.</p>
  <a href="${reportUrl}" style="display: inline-block; background: #c9a84c; color: #0f0e0c; text-decoration: none; padding: 14px 32px; font-family: sans-serif; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 500; margin-bottom: 32px;">View Your Full Report →</a>
  <p style="font-size: 14px; line-height: 1.7; color: #7a7268; margin-bottom: 8px;">This link gives you permanent access.</p>
  <p style="font-size: 14px; line-height: 1.7; color: #7a7268; margin-bottom: 48px;">Bookmark it.</p>
  <p style="font-size: 13px; color: #7a7268; border-top: 1px solid rgba(255,255,255,0.07); padding-top: 24px;">— Seyrn</p>
</div>`,
  });
}

// ── Email 2: D+3 ────────────────────────────────────────────────

export async function sendD3Email({
  to,
  firstName,
  reportUrl,
}: {
  to: string;
  firstName?: string | null;
  reportUrl: string;
}) {
  const name = firstName?.trim() || null;
  const greeting = name ? `${name},` : "Hi,";

  return resend.emails.send({
    from: FROM,
    to,
    subject: "Did something hit differently?",
    html: `
<div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 48px 24px; background: #0f0e0c; color: #f5f0e8;">
  <p style="font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase; color: #c9a84c; margin-bottom: 32px;">SEYRN</p>
  <p style="font-size: 17px; line-height: 1.6; margin-bottom: 16px;">${greeting}</p>
  <p style="font-size: 17px; line-height: 1.6; margin-bottom: 16px;">3 days since your report.</p>
  <p style="font-size: 17px; line-height: 1.6; margin-bottom: 32px;">If a line stayed with you —<br>share it. Your pattern card is waiting.</p>
  <a href="${reportUrl}" style="display: inline-block; background: #c9a84c; color: #0f0e0c; text-decoration: none; padding: 14px 32px; font-family: sans-serif; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 500; margin-bottom: 48px;">Share Your Pattern →</a>
  <p style="font-size: 13px; color: #7a7268; border-top: 1px solid rgba(255,255,255,0.07); padding-top: 24px;">— Seyrn</p>
</div>`,
  });
}

// ── Email 3: D+7 ────────────────────────────────────────────────

export async function sendD7Email({
  to,
  firstName,
  reportUrl,
  nextTurningPointSummary,
}: {
  to: string;
  firstName?: string | null;
  reportUrl: string;
  nextTurningPointSummary?: string | null;
}) {
  const name = firstName?.trim() || null;
  const greeting = name ? `${name},` : "Hi,";
  const tpLine = nextTurningPointSummary
    ? `<p style="font-size: 16px; line-height: 1.7; color: #e8dfd0; font-style: italic; border-left: 2px solid #c9a84c; padding-left: 16px; margin: 24px 0;">"${nextTurningPointSummary}"</p>`
    : "";

  return resend.emails.send({
    from: FROM,
    to,
    subject: "The one thing in your report",
    html: `
<div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 48px 24px; background: #0f0e0c; color: #f5f0e8;">
  <p style="font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase; color: #c9a84c; margin-bottom: 32px;">SEYRN</p>
  <p style="font-size: 17px; line-height: 1.6; margin-bottom: 16px;">${greeting}</p>
  <p style="font-size: 17px; line-height: 1.6; margin-bottom: 16px;">One week ago you learned your pattern.</p>
  ${tpLine}
  <p style="font-size: 17px; line-height: 1.6; margin-bottom: 8px;">Your next turning point is forming now.</p>
  <p style="font-size: 17px; line-height: 1.6; margin-bottom: 32px;">The preparation window is open.</p>
  <a href="${reportUrl}" style="display: inline-block; background: #c9a84c; color: #0f0e0c; text-decoration: none; padding: 14px 32px; font-family: sans-serif; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 500; margin-bottom: 48px;">View Your Report →</a>
  <p style="font-size: 13px; color: #7a7268; border-top: 1px solid rgba(255,255,255,0.07); padding-top: 24px;">— Seyrn</p>
</div>`,
  });
}

// ── Email 4: D+30 ───────────────────────────────────────────────

export async function sendD30Email({
  to,
  firstName,
}: {
  to: string;
  firstName?: string | null;
}) {
  const name = firstName?.trim() || null;
  const greeting = name ? `${name},` : "Hi,";
  const waitlistUrl = `${APP_URL}/#pricing`;

  return resend.emails.send({
    from: FROM,
    to,
    subject: "Monthly is almost here",
    html: `
<div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 48px 24px; background: #0f0e0c; color: #f5f0e8;">
  <p style="font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase; color: #c9a84c; margin-bottom: 32px;">SEYRN</p>
  <p style="font-size: 17px; line-height: 1.6; margin-bottom: 16px;">${greeting}</p>
  <p style="font-size: 17px; line-height: 1.6; margin-bottom: 16px;">Seyrn monthly launches soon.</p>
  <p style="font-size: 17px; line-height: 1.6; margin-bottom: 8px;">Weekly check-ins. Quarterly updates.</p>
  <p style="font-size: 17px; line-height: 1.6; margin-bottom: 32px;">A strategy that sharpens every time you record.</p>
  <p style="font-size: 17px; line-height: 1.6; margin-bottom: 32px;">Waitlist members get first access and a permanent discount.</p>
  <a href="${waitlistUrl}" style="display: inline-block; background: #c9a84c; color: #0f0e0c; text-decoration: none; padding: 14px 32px; font-family: sans-serif; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 500; margin-bottom: 48px;">Join the Waitlist →</a>
  <p style="font-size: 13px; color: #7a7268; border-top: 1px solid rgba(255,255,255,0.07); padding-top: 24px;">— Seyrn</p>
</div>`,
  });
}
