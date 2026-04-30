"use client";

import { useEffect, useRef, useState } from "react";
import { type TimelineStep } from "@/data/site-content";

type TimelineProps = {
  heading: string;
  steps: TimelineStep[];
};

export function Timeline({ heading, steps }: TimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [fillHeight, setFillHeight] = useState(0);
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    function onScroll() {
      const track = trackRef.current;
      if (!track) return;

      const trackRect = track.getBoundingClientRect();
      const triggerY = window.innerHeight * 0.45;

      // Fill height relative to the track container
      const progress = triggerY - trackRect.top;
      const clampedFill = Math.max(0, Math.min(progress, trackRect.height));
      setFillHeight(clampedFill);

      // Which step is active — based on the dot position
      let current = -1;
      for (let i = 0; i < dotRefs.current.length; i++) {
        const dot = dotRefs.current[i];
        if (!dot) continue;
        const dotRect = dot.getBoundingClientRect();
        const dotCenter = dotRect.top + dotRect.height / 2;
        if (dotCenter < triggerY + 20) {
          current = i;
        }
      }
      setActiveStep(current);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
      {/* Left — sticky heading, vertically centered */}
      <div className="lg:sticky lg:top-[50vh] lg:-translate-y-1/2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          The Journey
        </p>
        <h2 className="axion-title mt-4 text-2xl leading-snug text-foreground sm:text-3xl md:text-[2.5rem] md:leading-[1.2]">
          {heading}
        </h2>
      </div>

      {/* Right — timeline */}
      <div ref={trackRef} className="relative">
        {/* Background line — runs through dot centers */}
        <div className="absolute left-[1.25rem] top-0 bottom-0 w-[3px] -translate-x-1/2 rounded-full bg-border/40 sm:left-[1.5rem]" />

        {/* Highlighted fill line */}
        <div
          className="absolute left-[1.25rem] top-0 w-[3px] -translate-x-1/2 rounded-full bg-primary sm:left-[1.5rem]"
          style={{
            height: fillHeight,
            boxShadow: "0 0 12px rgba(139,160,255,0.45), 0 0 4px rgba(139,160,255,0.3)",
          }}
        />

        <div className="flex flex-col gap-24 sm:gap-28">
          {steps.map((step, i) => {
            const isActive = i <= activeStep;

            return (
              <div key={step.number} className="relative flex gap-6 sm:gap-8">
                {/* Circle — sits on the line */}
                <div
                  ref={(el) => { dotRefs.current[i] = el; }}
                  className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-500 sm:size-12 sm:text-base ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-[0_0_16px_rgba(139,160,255,0.5)]"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.number}
                </div>

                {/* Content */}
                <div
                  className={`flex-1 pt-1.5 transition-opacity duration-500 sm:pt-2 ${
                    isActive ? "opacity-100" : "opacity-35"
                  }`}
                >
                  <h3
                    className={`axion-title text-lg sm:text-xl transition-colors duration-500 ${
                      isActive ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </h3>

                  <ul className="mt-3 space-y-2.5">
                    {step.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2.5 whitespace-pre-line text-sm leading-relaxed text-muted-foreground"
                      >
                        <span
                          className={`mt-2 block size-1.5 shrink-0 rounded-full transition-colors duration-500 ${
                            isActive ? "bg-primary" : "bg-muted-foreground/30"
                          }`}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
