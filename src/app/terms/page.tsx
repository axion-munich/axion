import Link from "next/link";

export const metadata = {
  title: "Terms | axion",
};

export default function TermsPage() {
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
        <h1 className="axion-title text-4xl text-foreground">Terms</h1>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          This page is a placeholder for axion&apos;s terms and website legal notice. Replace it
          with the final approved text before going live.
        </p>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          If the site will collect applications, add terms for use of the website and any rules
          around submissions, contact forms, and intellectual property.
        </p>
      </div>
    </main>
  );
}
