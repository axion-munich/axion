/* eslint-disable @next/next/no-img-element */
"use client";

import type { TeamMember } from "@/data/site-content";

type TeamGridProps = {
  members: TeamMember[];
};

export function TeamGrid({ members }: TeamGridProps) {
  const marqueeMembers = [...members, ...members, ...members];

  return (
    <div className="space-y-5">
      <div className="space-y-2 text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Founders & Board
        </p>
        <p className="mx-auto max-w-2xl text-sm leading-7 text-muted-foreground">
          Meet the people building axion behind the scenes.
        </p>
      </div>

      <div className="relative overflow-hidden py-2">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />

        <div className="axion-marquee-track">
          {marqueeMembers.map((member, index) => (
            <div
              key={`${member.name}-${index}`}
              className="axion-team-card group"
              aria-hidden={index >= members.length}
            >
              <div className="relative aspect-[3/4] w-28 shrink-0 overflow-hidden rounded-xl bg-muted/25 sm:w-32">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>

              <div className="min-w-0 space-y-1 pt-2">
                <p className="line-clamp-2 min-h-10 text-pretty font-[family-name:var(--font-unbounded)] text-sm leading-5 text-foreground/90">
                  {member.name}
                </p>
                <p className="text-xs text-muted-foreground/90">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
