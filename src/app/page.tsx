import {
  ArrowRight,
  CheckCircle2,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { MobileNav } from "@/components/mobile-nav";
import { TeamGrid } from "@/components/team-grid";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  applicationStatus,
  contact,
  hero,
  joinRequirements,
  joinRequirementsIntro,
  missionText,
  navLinks,
  startupFaqs,
  startupSupportText,
  stats,
  studentFaqs,
  studentHighlights,
  studentsIntro,
  tracks,
  whyUsLabel,
} from "@/data/site-content";
import { getSiteCms } from "@/lib/site-cms";

export const dynamic = "force-dynamic";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="space-y-3">
      <Badge className="border-primary/35 bg-primary/10 text-primary" variant="outline">
        {eyebrow}
      </Badge>
      <h2 className="axion-title text-3xl leading-tight text-foreground md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-4xl text-sm leading-7 text-muted-foreground md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default async function Home() {
  const cms = await getSiteCms();
  const applicationsOpen = cms.applicationsOpen;
  const applyStatusTitle = applicationsOpen
    ? "Applications are open"
    : applicationStatus.title;
  const applyStatusCtaLabel = applicationsOpen
    ? "Apply now"
    : applicationStatus.ctaLabel;

  return (
    <div id="top" className="relative min-h-screen overflow-x-clip">
      <header className="relative z-40 px-4 pt-5">
        <div className="axion-container">
          <div className="flex min-h-[4.5rem] items-center justify-between rounded-[1.75rem] border border-white/30 bg-white/58 px-4 shadow-[0_22px_70px_-38px_rgba(15,23,42,0.55)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#0b1020]/62 sm:px-6">
            <a href="#top" className="axion-title text-lg text-primary">
              axion
            </a>

            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className="rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:bg-white/55 hover:text-foreground dark:hover:bg-white/8"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              {applicationsOpen ? (
                <Button
                  asChild
                  className="hidden rounded-full bg-primary px-4 text-primary-foreground hover:bg-primary/90 md:inline-flex"
                  size="sm"
                >
                  <a href="/apply">Apply Now</a>
                </Button>
              ) : (
                <Button
                  disabled
                  className="hidden rounded-full bg-muted px-4 text-muted-foreground md:inline-flex"
                  size="sm"
                >
                  Applications Closed
                </Button>
              )}
              <MobileNav applicationsOpen={applicationsOpen} links={navLinks} />
            </div>
          </div>
        </div>
      </header>

      <main className="relative pb-20">
        <div className="pointer-events-none absolute -top-36 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#8ba0ff]/30 blur-[120px]" />
        <div className="pointer-events-none absolute top-[38rem] -left-28 h-72 w-72 rounded-full bg-[#4c63d0]/20 blur-[110px]" />

        <section className="axion-container axion-section grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-6">
            <Badge className="border-primary/35 bg-primary/10 text-primary" variant="outline">
              <Sparkles className="mr-1 size-3.5" />
              {hero.kicker}
            </Badge>

            <h1 className="axion-title max-w-4xl text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
              {hero.title}
            </h1>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
              >
                <a href={hero.ctaPrimary.href}>
                  {hero.ctaPrimary.label}
                  <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-border bg-card/70 px-6 text-foreground hover:bg-accent"
              >
                <a href={hero.ctaSecondary.href}>{hero.ctaSecondary.label}</a>
              </Button>
            </div>
          </div>

          <Card className="border-[#8ba0ff]/25 bg-card/85 shadow-[0_18px_80px_-35px_rgba(139,160,255,0.75)] dark:bg-[#0d1020]/70">
            <CardHeader>
              <CardTitle className="axion-title text-2xl text-foreground">
                {applyStatusTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-border bg-card/70 p-4 text-center"
                  >
                    <p className="axion-title text-2xl text-[#9fb1ff]">{stat.value}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {applicationsOpen ? (
                <Button
                  asChild
                  className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <a href="/apply">{applyStatusCtaLabel}</a>
                </Button>
              ) : (
                <Button
                  asChild
                  className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <a href="#contacts">{applyStatusCtaLabel}</a>
                </Button>
              )}
            </CardContent>
          </Card>
        </section>

        <section id="about" className="axion-section axion-container">
          <SectionHeading eyebrow="Mission" title="Mission" description={missionText} />
        </section>

        <section id="students" className="axion-section axion-container space-y-8">
          <SectionHeading eyebrow={studentsIntro} title="For Students" />

          <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
            <div className="grid gap-4">
              {studentHighlights.map((item) => (
                <Card key={item.title} className="border-border bg-card/70">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-7 text-muted-foreground">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-4">
              {tracks.map((track) => (
                <Card
                  key={track.name}
                  className="border-[#8ba0ff]/20 bg-card/80 dark:bg-[#0e1120]/55"
                >
                  <CardHeader className="space-y-3">
                    <CardTitle className="axion-title text-xl text-foreground">
                      {track.name}
                    </CardTitle>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {track.description}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <p className="font-semibold text-foreground">{track.experienceLabel}</p>
                    <ul className="space-y-2 text-muted-foreground">
                      {track.experienceItems.map((item) => (
                        <li key={`${track.name}-${item}`} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#9fb1ff]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="font-semibold text-foreground">{track.focusLabel}</p>
                    <ul className="space-y-2 text-muted-foreground">
                      {track.focusAreas.map((item) => (
                        <li
                          key={`${track.name}-focus-${item}`}
                          className="flex items-start gap-2"
                        >
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#9fb1ff]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm leading-7 text-muted-foreground">{joinRequirementsIntro}</p>
            <div className="grid gap-4 md:grid-cols-3">
              {joinRequirements.map((item) => (
                <Card key={item.title} className="border-border bg-card/70">
                  <CardHeader>
                    <CardTitle className="text-base text-foreground">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-7 text-muted-foreground">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            {applicationsOpen ? (
              <Button
                asChild
                className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
              >
                <a href="/apply">Apply now</a>
              </Button>
            ) : (
              <Button
                disabled
                className="rounded-full bg-muted px-6 text-muted-foreground"
              >
                Applications closed
              </Button>
            )}
          </div>
        </section>

        <section id="start-ups" className="axion-section axion-container space-y-8">
          <SectionHeading
            eyebrow={whyUsLabel}
            title="For Start-Ups"
            description={startupSupportText}
          />

          <Card
            id="application"
            className="border-[#8ba0ff]/35 bg-card/90 dark:bg-[#10142a]"
          >
            <CardHeader>
              <CardTitle className="axion-title text-2xl text-foreground">
                {applicationStatus.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <a href={applicationStatus.ctaHref}>{applicationStatus.ctaLabel}</a>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section id="faq" className="axion-section axion-container space-y-8">
          <SectionHeading eyebrow={whyUsLabel} title="FAQ" />

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-border bg-card/70">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">For Students</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {studentFaqs.map((faq) => (
                    <AccordionItem
                      key={faq.question}
                      value={`student-${faq.question}`}
                      className="border-border"
                    >
                      <AccordionTrigger className="text-sm text-foreground hover:no-underline">
                        {`— ${faq.question}`}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm leading-7 text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/70">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">For Start-Ups</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {startupFaqs.map((faq) => (
                    <AccordionItem
                      key={faq.question}
                      value={`startup-${faq.question}`}
                      className="border-border"
                    >
                      <AccordionTrigger className="text-sm text-foreground hover:no-underline">
                        {`— ${faq.question}`}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm leading-7 text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="team" className="axion-section axion-container">
          <TeamGrid members={cms.teamMembers} />
        </section>

        <section id="contacts" className="axion-container pt-4 pb-12">
          <Card className="border-border bg-card/70">
            <CardHeader>
              <CardTitle className="axion-title text-2xl text-foreground">
                Interested? Contact us
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid gap-3 md:grid-cols-2">
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-muted/45 px-4 py-3 text-sm text-foreground/90 transition hover:border-[#8ba0ff]/40"
                >
                  <Mail className="size-4 text-[#9fb1ff]" />
                  {contact.email}
                </a>
                <a
                  href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-muted/45 px-4 py-3 text-sm text-foreground/90 transition hover:border-[#8ba0ff]/40"
                >
                  <Phone className="size-4 text-[#9fb1ff]" />
                  {contact.phone}
                </a>
              </div>

              <div className="flex gap-3">
                <Button
                  asChild
                  variant="outline"
                  size="icon"
                  className="rounded-full border-border bg-card/70 hover:bg-accent"
                >
                  <a
                    href={contact.instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                  >
                    <Instagram className="size-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="icon"
                  className="rounded-full border-border bg-card/70 hover:bg-accent"
                >
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="size-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="pb-8 pt-2">
        <div className="axion-container">
          <div className="flex flex-col gap-4 rounded-[1.75rem] border border-white/22 bg-white/36 px-5 py-5 text-sm text-muted-foreground shadow-[0_20px_60px_-42px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-white/4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>© 2026 axion. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <Link href="/imprint" className="transition hover:text-foreground">
                Imprint
              </Link>
              <Link href="/privacy" className="transition hover:text-foreground">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
