import Link from "next/link";

export const metadata = {
  title: "Imprint",
  description: "Legal notice and imprint for axion Munich.",
};

export default function ImprintPage() {
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
        <h1 className="axion-title text-4xl text-foreground">Imprint</h1>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          Information in accordance with &sect;&nbsp;5 DDG (German Digital Services Act)
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">Provider</h2>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          axion Munich
          <br />
          Student Initiative at the Technical University of Munich
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">Address</h2>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          Arcisstra&szlig;e 21
          <br />
          80333 Munich
          <br />
          Germany
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">Contact</h2>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          Email:{" "}
          <a href="mailto:contact@axion-munich.de" className="text-primary hover:underline">
            contact@axion-munich.de
          </a>
          <br />
          Phone:{" "}
          <a href="tel:+4917662973685" className="text-primary hover:underline">
            +49 17 662 973 685
          </a>
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">
          Responsible for content according to &sect;&nbsp;18 Abs.&nbsp;2 MStV
        </h2>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          Fedor Olshevskiy
          <br />
          Arcisstra&szlig;e 21
          <br />
          80333 Munich
          <br />
          Germany
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">EU Dispute Resolution</h2>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          The European Commission provides a platform for online dispute resolution (OS):{" "}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            https://ec.europa.eu/consumers/odr/
          </a>
          . We are not obligated nor willing to participate in dispute resolution proceedings
          before a consumer arbitration board.
        </p>
      </section>
    </main>
  );
}
