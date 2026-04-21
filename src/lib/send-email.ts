import { Resend } from "resend";

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

/**
 * Send a transactional email via Resend.
 *
 * Requires RESEND_API_KEY and RESEND_FROM_EMAIL environment variables.
 * RESEND_FROM_EMAIL should be a verified sender, e.g. "axion Munich <noreply@axion-munich.de>"
 */
export async function sendEmail(params: SendEmailParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn(
      "[email] RESEND_API_KEY or RESEND_FROM_EMAIL not set — skipping email send."
    );
    return;
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });

  if (error) {
    console.error("[email] Resend error:", error);
    throw new Error(error.message);
  }
}
