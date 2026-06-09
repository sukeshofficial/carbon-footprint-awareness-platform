import { sendFeedbackEmail } from "../services/email.service.js";

export const submitFeedback = async (req, res) => {
  const { name, email, message, anonymous = false } = req.body;

  // Message is always required
  if (!message?.trim()) {
    return res.status(400).json({ error: "Feedback message is required." });
  }

  // Identity fields only required when not anonymous
  if (!anonymous) {
    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({ error: "Name and email are required." });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address." });
    }
  }

  // Respond immediately — do not block on SMTP
  res.status(202).json({ message: "Feedback received." });

  // Fire-and-forget: send email in the background
  sendFeedbackEmail({
    name: anonymous ? "" : name.trim(),
    email: anonymous ? "" : email.trim(),
    message: message.trim(),
    anonymous,
  }).catch((error) => {
    console.error("Background email send failed:", error);
  });
};

