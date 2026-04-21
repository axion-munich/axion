/**
 * Reusable HTML email template consistent with the axion website design.
 *
 * Uses inline styles for maximum email-client compatibility (Gmail, Outlook, Apple Mail).
 * Dark theme matching the website default.
 */

type EmailSection = {
  heading?: string;
  body: string;
};

type EmailTemplateOptions = {
  /** Recipient's first name (extracted from full name) */
  recipientName: string;
  /** Main greeting line, e.g. "Application Received" */
  subject: string;
  /** Intro paragraph shown right after the greeting */
  intro: string;
  /** Optional content sections with headings */
  sections?: EmailSection[];
  /** Optional call-to-action button */
  cta?: { label: string; href: string };
  /** Footer note (defaults to standard footer) */
  footerNote?: string;
};

// Design tokens matching globals.css dark theme
const COLORS = {
  bg: "#06070b",
  cardBg: "#0f1320",
  primary: "#8ba0ff",
  text: "#f2f4ff",
  muted: "#a5afcf",
  border: "rgba(255,255,255,0.12)",
  buttonText: "#05060a",
} as const;

const FONT_STACK =
  "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export function buildEmailHtml(options: EmailTemplateOptions): string {
  const { recipientName, subject, intro, sections = [], cta, footerNote } = options;

  const sectionBlocks = sections
    .map(
      (s) => `
      ${s.heading ? `<h2 style="margin:0 0 8px;font-size:16px;font-weight:600;color:${COLORS.primary};font-family:${FONT_STACK};">${s.heading}</h2>` : ""}
      <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${COLORS.text};font-family:${FONT_STACK};">${s.body}</p>
    `
    )
    .join("");

  const ctaBlock = cta
    ? `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:24px auto 8px;">
      <tr>
        <td style="border-radius:8px;background:${COLORS.primary};">
          <a href="${cta.href}" target="_blank" style="display:inline-block;padding:12px 32px;font-size:15px;font-weight:600;color:${COLORS.buttonText};text-decoration:none;font-family:${FONT_STACK};">${cta.label}</a>
        </td>
      </tr>
    </table>
  `
    : "";

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>${subject}</title>
  <!--[if mso]>
  <style>body,table,td{font-family:Arial,Helvetica,sans-serif!important;}</style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${COLORS.bg};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

  <!-- Outer wrapper -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:${COLORS.bg};">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Logo -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:520px;">
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <span style="font-size:28px;font-weight:700;letter-spacing:-0.5px;color:${COLORS.primary};font-family:${FONT_STACK};">axion</span>
              <span style="display:block;font-size:11px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:${COLORS.muted};font-family:${FONT_STACK};margin-top:2px;">Munich</span>
            </td>
          </tr>
        </table>

        <!-- Card -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:520px;background-color:${COLORS.cardBg};border-radius:12px;border:1px solid ${COLORS.border};">
          <tr>
            <td style="padding:36px 32px 32px;">

              <!-- Subject line -->
              <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;color:${COLORS.text};font-family:${FONT_STACK};">${subject}</h1>

              <!-- Accent bar -->
              <div style="width:48px;height:3px;background:${COLORS.primary};border-radius:2px;margin-bottom:24px;"></div>

              <!-- Greeting -->
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${COLORS.text};font-family:${FONT_STACK};">
                Hi ${recipientName},
              </p>

              <!-- Intro -->
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${COLORS.text};font-family:${FONT_STACK};">
                ${intro}
              </p>

              <!-- Sections -->
              ${sectionBlocks}

              <!-- CTA -->
              ${ctaBlock}

            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:520px;">
          <tr>
            <td style="padding:24px 0 0;text-align:center;">
              ${footerNote ? `<p style="margin:0 0 12px;font-size:13px;line-height:1.5;color:${COLORS.muted};font-family:${FONT_STACK};">${footerNote}</p>` : ""}
              <p style="margin:0;font-size:12px;color:${COLORS.muted};font-family:${FONT_STACK};">
                &copy; ${new Date().getFullYear()} axion Munich &middot; <a href="https://axion-munich.de" style="color:${COLORS.primary};text-decoration:none;">axion-munich.de</a>
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}

/**
 * Build the application-received confirmation email.
 */
export function buildApplicationConfirmationEmail(fullName: string): {
  subject: string;
  html: string;
} {
  const firstName = fullName.trim().split(/\s+/)[0] || fullName;

  return {
    subject: "We received your application!",
    html: buildEmailHtml({
      recipientName: firstName,
      subject: "Application Received",
      intro:
        "Thank you for applying to <strong style=\"color:#8ba0ff;\">axion Munich</strong>! We\u2019re excited to see your interest in joining our student consulting community.",
      sections: [
        {
          heading: "What happens next?",
          body: "Our team will carefully review your application. We\u2019ll get back to you as soon as possible with an update on your application status.",
        },
        {
          heading: "In the meantime",
          body: "Feel free to explore our website to learn more about our projects, team, and the start-up ecosystem we\u2019re building in Munich.",
        },
      ],
      cta: {
        label: "Visit Our Website",
        href: "https://axion-munich.de",
      },
      footerNote:
        "This is an automated confirmation. If you didn\u2019t submit an application, you can safely ignore this email.",
    }),
  };
}
