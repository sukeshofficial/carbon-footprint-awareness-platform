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

/**
 * Sends a password reset email.
 * @param {string} email 
 * @param {string} resetToken 
 */
export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const html = `
    <div style="font-family:'Google Sans',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;border-radius:8px;overflow:hidden;">
      <div style="background:#6d28d9;padding:24px 32px;">
        <h1 style="color:#fff;margin:0;font-size:20px;font-weight:600;">Reset your password</h1>
      </div>
      <div style="padding:32px;background:#fff;">
        <p style="margin:0 0 24px;color:#374151;font-size:16px;line-height:1.6;">
          You requested a password reset for your ACo₂ account. Click the button below to set a new password:
        </p>
        <div style="text-align:center;margin-bottom:32px;">
          <a href="${resetUrl}" style="display:inline-block;padding:12px 32px;background-color:#6d28d9;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">
            Reset Password
          </a>
        </div>
        <p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.5;">
          This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
        </p>
        <hr style="border:0;border-top:1px solid #e5e7eb;margin:24px 0;">
        <p style="margin:0;color:#9ca3af;font-size:12px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${resetUrl}" style="color:#6d28d9;">${resetUrl}</a>
        </p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"ACo₂ Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset your password - ACo₂',
    html,
  };

  await createTransporter().sendMail(mailOptions);
};

/**
 * Sends a welcome email after signup.
 * @param {string} email 
 * @param {string} name 
 */
export const sendWelcomeEmail = async (email, name) => {
  const html = `
    <div style="font-family:'Google Sans',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;border-radius:8px;overflow:hidden;">
      <div style="background:#6d28d9;padding:24px 32px;">
        <h1 style="color:#fff;margin:0;font-size:20px;font-weight:600;">Welcome to ACo₂!</h1>
      </div>
      <div style="padding:32px;background:#fff;">
        <h2 style="color:#111827;font-size:18px;margin-bottom:16px;">Hello ${name},</h2>
        <p style="margin:0 0 16px;color:#374151;font-size:16px;line-height:1.6;">
          We're excited to have you join our community dedicated to carbon footprint awareness. 
          Start exploring your impact today!
        </p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${process.env.FRONTEND_URL}" style="display:inline-block;padding:12px 32px;background-color:#6d28d9;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"ACo₂" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to ACo₂!',
    html,
  };

  await createTransporter().sendMail(mailOptions);
}; 
