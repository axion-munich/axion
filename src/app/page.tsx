import {
  ArrowRight,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Sparkles,
  Users,
  Globe,
} from "lucide-react";
import Link from "next/link";

import { MobileNav } from "@/components/mobile-nav";
import { StudentTabs } from "@/components/student-tabs";
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
  studentFaqs,
  studentHighlights,
  studentsIntro,
  tracks,
  whyUsLabel,
} from "@/data/site-content";
import { getSiteCms } from "@/lib/site-cms";

export const dynamic = "force-dynamic";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="space-y-4 text-center">
      {eyebrow ? (
        <Badge className="border-primary/35 bg-primary/10 text-primary" variant="outline">
          {eyebrow}
        </Badge>
      ) : null}
      <h2 className="axion-title text-3xl leading-tight text-foreground md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mx-auto max-w-4xl text-sm leading-7 text-muted-foreground md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default async function Home() {
  const cms = await getSiteCms();
  const applicationsOpen = cms.applicationsOpen;

  return (
    <div id="top" className="relative min-h-screen overflow-x-clip">
      <header className="relative z-40 px-4 pt-5">
        <div className="axion-container">
          <div className="relative flex min-h-[4.5rem] items-center rounded-[1.75rem] border border-white/30 bg-white/58 px-4 shadow-[0_22px_70px_-38px_rgba(15,23,42,0.55)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#0b1020]/62 sm:px-6">
            <a href="#top" className="axion-title text-lg text-primary">
              axion
            </a>

            <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
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

            <div className="ml-auto flex items-center gap-3">
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              {applicationsOpen ? (
                <Button
                  asChild
                  className="hidden rounded-full bg-primary px-4 text-xs text-primary-foreground hover:bg-primary/90 md:inline-flex"
                  size="sm"
                >
                  <a href="/apply">Apply Now</a>
                </Button>
              ) : (
                <Button
                  disabled
                  className="hidden rounded-full bg-muted px-3 text-xs text-muted-foreground md:inline-flex"
                  size="sm"
                >
                  Closed
                </Button>
              )}
              <MobileNav applicationsOpen={applicationsOpen} links={navLinks} />
            </div>
          </div>
        </div>
      </header>

      <main className="relative pb-20">
        {/* Ambient glows — Polar-style dramatic background */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-[#8ba0ff]/25 blur-[180px]" />
        <div className="pointer-events-none absolute top-[50rem] -left-40 h-[28rem] w-[28rem] rounded-full bg-[#4c63d0]/15 blur-[160px]" />
        <div className="pointer-events-none absolute top-[30rem] -right-32 h-[22rem] w-[22rem] rounded-full bg-[#8ba0ff]/10 blur-[140px]" />

        {/* ─── Hero ─── */}
        <section className="axion-container flex min-h-[calc(100vh-5.5rem)] items-center justify-center text-center">
          <div className="w-full max-w-5xl space-y-8 py-20">
            <Badge className="border-primary/35 bg-primary/10 text-primary text-sm px-3 py-1" variant="outline">
              <Sparkles className="mr-1.5 size-3.5" />
              {hero.kicker}
            </Badge>

            <h1 className="axion-title text-[2.75rem] leading-[1.08] tracking-tight text-foreground sm:text-7xl lg:text-[5.25rem]">
              {hero.title}
            </h1>

            <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {hero.subtitle.split(".").slice(0, 2).join(".")}.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Button
                asChild
                className="rounded-full bg-primary px-8 py-3 text-base text-primary-foreground hover:bg-primary/90"
              >
                <a href={hero.ctaPrimary.href}>
                  {hero.ctaPrimary.label}
                  <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-border bg-card/70 px-8 py-3 text-base text-foreground hover:bg-accent"
              >
                <a href={hero.ctaSecondary.href}>{hero.ctaSecondary.label}</a>
              </Button>
            </div>

            {/* Stat pills — like Polar's feature badges below hero */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Users className="size-4 text-[#9fb1ff]" />
                {cms.teamStats.memberCount} Members
              </span>
              <span className="hidden h-4 w-px bg-border sm:block" />
              <span className="flex items-center gap-2">
                <Globe className="size-4 text-[#9fb1ff]" />
                {cms.teamStats.nationalityCount} Nationalities
              </span>
            </div>
          </div>
        </section>

        {/* ─── Mission — centered statement ─── */}
        <section id="about" className="axion-section axion-container">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Mission
            </p>
            <p className="mt-6 axion-title text-2xl leading-snug text-foreground sm:text-3xl md:text-[2.5rem] md:leading-[1.25]">
              {missionText}
            </p>
          </div>
        </section>

        {/* Subtle divider */}
        <div className="axion-container">
          <div className="h-px bg-border/60" />
        </div>

        {/* ─── For Students ─── */}
        <section id="students" className="axion-section axion-container space-y-10">
          <SectionHeading eyebrow={studentsIntro} title="For Students" />

          <StudentTabs
            highlights={studentHighlights}
            tracks={tracks}
            joinRequirements={joinRequirements}
            joinRequirementsIntro={joinRequirementsIntro}
            applicationsOpen={applicationsOpen}
          />
        </section>

        {/* Subtle divider */}
        <div className="axion-container">
          <div className="h-px bg-border/60" />
        </div>

        {/* ─── For Start-Ups ─── */}
        <section id="start-ups" className="axion-section axion-container space-y-10">
          <SectionHeading
            eyebrow={whyUsLabel}
            title="For Start-Ups"
            description={startupSupportText}
          />

          <Card
            id="application"
            className="border-[#8ba0ff]/20 bg-card/80 text-center dark:bg-[#0c1020]/70"
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

        {/* Subtle divider */}
        <div className="axion-container">
          <div className="h-px bg-border/60" />
        </div>

        {/* ─── FAQ ─── */}
        <section id="faq" className="axion-section axion-container space-y-10">
          <SectionHeading title="FAQ" />

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

        {/* Subtle divider */}
        <div className="axion-container">
          <div className="h-px bg-border/60" />
        </div>

        {/* ─── Team ─── */}
        <section id="team" className="axion-section axion-container">
          <TeamGrid members={cms.teamMembers} />
        </section>

        {/* ─── Contact ─── */}
        <section id="contacts" className="axion-container pb-16 pt-4">
          <div className="space-y-6 text-center">
            <h2 className="axion-title text-3xl leading-tight text-foreground md:text-4xl">
              Contact us
            </h2>

            <div className="mx-auto grid max-w-2xl gap-3 sm:grid-cols-2">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center justify-center gap-3 rounded-xl border border-border bg-muted/45 px-4 py-3 text-sm text-foreground/90 transition hover:border-[#8ba0ff]/40"
              >
                <Mail className="size-4 text-[#9fb1ff]" />
                {contact.email}
              </a>
              <a
                href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                className="flex items-center justify-center gap-3 rounded-xl border border-border bg-muted/45 px-4 py-3 text-sm text-foreground/90 transition hover:border-[#8ba0ff]/40"
              >
                <Phone className="size-4 text-[#9fb1ff]" />
                {contact.phone}
              </a>
            </div>

            <div className="flex justify-center gap-3">
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
          </div>
        </section>
      </main>

      <footer className="pb-8 pt-2">
        <div className="axion-container">
          <div className="flex flex-col gap-4 rounded-[1.75rem] border border-white/22 bg-white/36 px-5 py-5 text-sm text-muted-foreground shadow-[0_20px_60px_-42px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-white/4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>&copy; 2026 axion. All rights reserved.</p>
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
