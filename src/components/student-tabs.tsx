"use client";

import { CheckCircle2 } from "lucide-react";

import type { Highlight, Track } from "@/data/site-content";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type StudentTabsProps = {
  highlights: Highlight[];
  tracks: Track[];
  joinRequirements: Highlight[];
  joinRequirementsIntro: string;
  applicationsOpen: boolean;
};

export function StudentTabs({
  highlights,
  tracks,
  joinRequirements,
  joinRequirementsIntro,
  applicationsOpen,
}: StudentTabsProps) {
  return (
    <div className="space-y-10">
      <div className="rounded-2xl border border-border bg-card/60 p-4 dark:bg-[#0c1020]/50 sm:p-6">
        <Tabs defaultValue={highlights[0]?.title}>
          <TabsList className="h-auto w-full flex-wrap justify-center gap-1 overflow-x-auto bg-muted/50 p-1 dark:bg-white/5">
            {highlights.map((h) => (
              <TabsTrigger key={h.title} value={h.title} className="text-xs sm:text-sm">
                {h.title}
              </TabsTrigger>
            ))}
            {tracks.map((t) => (
              <TabsTrigger key={t.name} value={t.name} className="text-xs sm:text-sm">
                {t.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {highlights.map((h) => (
            <TabsContent key={h.title} value={h.title} className="mt-6 text-center">
              <p className="mx-auto max-w-3xl text-sm leading-7 text-muted-foreground md:text-base md:leading-8">
                {h.text}
              </p>
            </TabsContent>
          ))}

          {tracks.map((track) => (
            <TabsContent key={track.name} value={track.name} className="mt-6 space-y-5 text-center text-sm">
              <p className="mx-auto max-w-3xl leading-7 text-muted-foreground md:text-base md:leading-8">
                {track.description}
              </p>

              <div className="mx-auto grid max-w-3xl gap-6 text-left sm:grid-cols-2">
                <div className="space-y-3">
                  <p className="font-semibold text-foreground">{track.experienceLabel}</p>
                  <ul className="space-y-2 text-muted-foreground">
                    {track.experienceItems.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#9fb1ff]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <p className="font-semibold text-foreground">{track.focusLabel}</p>
                  <ul className="space-y-2 text-muted-foreground">
                    {track.focusAreas.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#9fb1ff]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div className="space-y-4 text-center">
        <p className="mx-auto max-w-2xl text-sm leading-7 text-muted-foreground">{joinRequirementsIntro}</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {joinRequirements.map((req) => (
            <div
              key={req.title}
              className="rounded-xl border border-border bg-card/50 p-4 text-left dark:bg-[#0c1020]/40"
            >
              <p className="text-sm font-semibold text-foreground">{req.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{req.text}</p>
            </div>
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
          <Button disabled className="rounded-full bg-muted px-6 text-muted-foreground">
            Applications closed
          </Button>
        )}
      </div>
    </div>
  );
}
