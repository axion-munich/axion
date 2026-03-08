/* eslint-disable @next/next/no-img-element */
"use client";

import type { TeamMember } from "@/data/site-content";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type TeamGridProps = {
  members: TeamMember[];
};

export function TeamGrid({ members }: TeamGridProps) {
  const marqueeMembers = [...members, ...members];

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Founders & Board
        </p>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
          Meet the people building axion behind the scenes.
        </p>
      </div>

      <div className="relative overflow-hidden py-2">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />

        <div className="axion-marquee-track">
          {marqueeMembers.map((member, index) => (
            <Dialog key={`${member.name}-${index}`}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="axion-team-card group"
                  aria-label={`Open profile for ${member.name}`}
                  aria-hidden={index >= members.length}
                  tabIndex={index >= members.length ? -1 : 0}
                >
                  <div className="relative aspect-[3/4] w-28 shrink-0 overflow-hidden rounded-xl bg-muted/25 sm:w-32">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-contain object-center transition duration-500 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  </div>

                  <div className="min-w-0 space-y-1 pt-2">
                    <p className="line-clamp-2 min-h-10 text-pretty font-[family-name:var(--font-unbounded)] text-sm leading-5 text-foreground/90">
                      {member.name}
                    </p>
                    <p className="text-xs text-muted-foreground/90">{member.role}</p>
                  </div>
                </button>
              </DialogTrigger>

              <DialogContent className="max-h-[88vh] max-w-3xl overflow-y-auto border-border bg-popover text-foreground dark:bg-[#0d0f15]">
                <div className="grid gap-6 md:grid-cols-[260px_1fr] md:gap-8">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-border">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <DialogTitle className="font-[family-name:var(--font-unbounded)] text-2xl text-foreground">
                        {member.name}
                      </DialogTitle>
                      <DialogDescription className="text-base text-[#9fb1ff]">
                        {member.role}
                      </DialogDescription>
                    </div>

                    {member.bio ? (
                      <p className="text-sm leading-7 text-muted-foreground">{member.bio}</p>
                    ) : null}

                    {member.expertise.length > 0 ? (
                      <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          Expertise
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {member.expertise.map((skill) => (
                            <Badge
                              key={`${member.name}-${skill}`}
                              className="border-[#8ba0ff]/40 bg-[#8ba0ff]/10 text-primary"
                              variant="outline"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </div>
  );
}
