import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy policy and data protection information for axion Munich.",
};

export default function PrivacyPage() {
  return (
    <main className="axion-container axion-section max-w-3xl space-y-8">
      <Link
        href="/"
        className="inline-flex rounded-full border border-border bg-card/70 px-4 py-2 text-sm text-foreground transition hover:bg-accent"
      >
        Back to home
      </Link>

      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Legal
        </p>
        <h1 className="axion-title text-4xl text-foreground">Privacy Policy</h1>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          We take the protection of your personal data very seriously. This privacy policy
          informs you about how we process personal data when you use our website
          axion-munich.de (hereinafter &ldquo;website&rdquo;).
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">
          1. Controller &amp; Contact
        </h2>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          The controller within the meaning of the General Data Protection Regulation (GDPR)
          is:
        </p>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          axion Munich
          <br />
          Arcisstra&szlig;e 21, 80333 Munich, Germany
          <br />
          Email:{" "}
          <a href="mailto:contact@axion-munich.de" className="text-primary hover:underline">
            contact@axion-munich.de
          </a>
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">
          2. Hosting &amp; Server Log Files
        </h2>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          This website is hosted by Vercel Inc. (340 S Lemon Ave #4133, Walnut, CA 91789,
          USA). When you visit our website, Vercel automatically collects and stores
          information in server log files that your browser transmits, including your IP
          address, browser type and version, operating system, referrer URL, and time of
          access.
        </p>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          This data is processed on the basis of Art.&nbsp;6(1)(f) GDPR (legitimate interest
          in the secure and efficient operation of the website). Log data is not combined with
          other data sources.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">
          3. Application Form
        </h2>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          If you apply to join axion through our application form, we collect the following
          data: full name, email address, university, study program, answers to application
          questions, and your uploaded CV (PDF/DOC/DOCX, max 5&nbsp;MB).
        </p>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          This data is transmitted to and stored in Google Sheets and Google Drive (Google
          Ireland Ltd, Gordon House, Barrow Street, Dublin 4, Ireland) for the purpose of
          evaluating your application. The legal basis is Art.&nbsp;6(1)(b) GDPR (performance
          of pre-contractual measures at your request) and Art.&nbsp;6(1)(a) GDPR (your
          consent by submitting the form).
        </p>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          Your application data will be deleted no later than 6&nbsp;months after the end of
          the respective application cycle, unless you have been accepted as a member.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">
          4. Google Fonts
        </h2>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          This website uses Google Fonts served via Next.js font optimization. Fonts are
          self-hosted and loaded from our own domain at build time. No direct connection to
          Google servers is established when you visit this website, and no data is transmitted
          to Google through font loading.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">
          5. External Links &amp; Social Media
        </h2>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          Our website contains links to external services such as Instagram and LinkedIn. When
          you click on these links, you leave our website and the privacy policies of the
          respective providers apply. We do not embed social media plugins or tracking pixels
          on our website.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">
          6. Cookies
        </h2>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          This website uses only technically necessary cookies (e.g. for theme preferences). We
          do not use tracking cookies, analytics tools, or advertising cookies.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">
          7. Your Rights
        </h2>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          Under the GDPR, you have the following rights regarding your personal data:
        </p>
        <ul className="list-inside list-disc space-y-1 text-sm leading-7 text-muted-foreground md:text-base">
          <li>Right of access (Art.&nbsp;15 GDPR)</li>
          <li>Right to rectification (Art.&nbsp;16 GDPR)</li>
          <li>Right to erasure (Art.&nbsp;17 GDPR)</li>
          <li>Right to restriction of processing (Art.&nbsp;18 GDPR)</li>
          <li>Right to data portability (Art.&nbsp;20 GDPR)</li>
          <li>Right to object (Art.&nbsp;21 GDPR)</li>
          <li>Right to withdraw consent at any time (Art.&nbsp;7(3) GDPR)</li>
        </ul>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          To exercise any of these rights, please contact us at{" "}
          <a href="mailto:contact@axion-munich.de" className="text-primary hover:underline">
            contact@axion-munich.de
          </a>
          .
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">
          8. Right to Complain to a Supervisory Authority
        </h2>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          You have the right to lodge a complaint with a data protection supervisory authority.
          The competent authority for Bavaria is:
        </p>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          Bayerisches Landesamt f&uuml;r Datenschutzaufsicht (BayLDA)
          <br />
          Promenade 18, 91522 Ansbach, Germany
          <br />
          Website:{" "}
          <a
            href="https://www.lda.bayern.de"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            www.lda.bayern.de
          </a>
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">
          9. Changes to This Privacy Policy
        </h2>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          We may update this privacy policy from time to time. The current version is always
          available on this page.
        </p>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          Last updated: March 2026
        </p>
      </section>
    </main>
  );
}
