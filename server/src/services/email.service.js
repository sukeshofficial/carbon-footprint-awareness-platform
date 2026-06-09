import nodemailer from "nodemailer";

/**
 * Returns a fresh transporter using env vars resolved at call-time.
 * Creating it lazily ensures dotenv has already populated process.env.
 */
const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // STARTTLS on port 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

/**
 * Send a feedback email.
 * @param {{ name: string, email: string, message: string, anonymous: boolean }} data
 */
export const sendFeedbackEmail = async ({ name, email, message, anonymous = false }) => {
  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "short",
  });

  const displayName = anonymous ? "Anonymous" : name;
  const displayEmail = anonymous ? "Hidden" : email;

  // Badge shown in the email header
  const anonymousBadge = anonymous
    ? `<span style="display:inline-block;margin-left:10px;padding:2px 10px;background:#7c3aed1a;color:#7c3aed;border-radius:999px;font-size:11px;font-weight:600;vertical-align:middle;border:1px solid #7c3aed33;">Anonymous</span>`
    : "";

  // Email row for the sender's address — hidden link when not anonymous
  const emailCell = anonymous
    ? `<td style="padding:8px 0;color:#111827;font-size:14px;">Hidden</td>`
    : `<td style="padding:8px 0;color:#111827;font-size:14px;"><a href="mailto:${email}" style="color:#6d28d9;text-decoration:none;">${email}</a></td>`;

  const html = `
    <div style="font-family:'Google Sans',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;border-radius:8px;overflow:hidden;">
      <div style="background:#6d28d9;padding:24px 32px;">
        <h1 style="color:#fff;margin:0;font-size:20px;font-weight:600;">
          New Feedback - ACo₂ ${anonymousBadge}
        </h1>
      </div>
      <div style="padding:32px;background:#fff;">
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr>
            <td style="padding:8px 0;color:#6b7280;font-size:13px;width:120px;">From</td>
            <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:500;">${displayName}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6b7280;font-size:13px;">Email</td>
            ${emailCell}
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6b7280;font-size:13px;vertical-align:top;">Sent at</td>
            <td style="padding:8px 0;color:#111827;font-size:14px;">${timestamp}</td>
          </tr>
        </table>
        <div style="background:#f3f4f6;border-left:4px solid #6d28d9;border-radius:4px;padding:16px 20px;">
          <p style="margin:0;color:#374151;font-size:14px;line-height:1.6;white-space:pre-wrap;">${message}</p>
        </div>
      </div>
      <div style="padding:16px 32px;background:#f9f9f9;text-align:center;">
        <p style="margin:0;color:#9ca3af;font-size:12px;">This email was sent from the ACo₂ feedback form.</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"ACo₂ Feedback" <${process.env.EMAIL_USER}>`,
    to: process.env.MAIL_TO,
    subject: anonymous ? "Anonymous Feedback" : `Feedback from ${name}`,
    html,
  };

  // Only set replyTo when we have a real email address
  if (!anonymous && email) {
    mailOptions.replyTo = email;
  }

  await createTransporter().sendMail(mailOptions);
}; 
