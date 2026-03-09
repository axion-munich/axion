import Link from "next/link";

export const metadata = {
  title: "Privacy | axion",
};

export default function PrivacyPage() {
  return (
    <main className="axion-container axion-section max-w-3xl space-y-6">
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
          This page is a placeholder for axion&apos;s privacy policy. Replace it with the final
          legal text before publishing publicly.
        </p>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          At minimum, include what applicant data you collect, where CVs and answers are stored,
          who can access them, how long you keep them, and how candidates can request deletion.
        </p>
      </div>
    </main>
  );
}
