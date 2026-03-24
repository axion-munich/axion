"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type AnnouncementBannerProps = {
  banners: { text: string }[];
};

export function AnnouncementBanner({ banners }: AnnouncementBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActiveIndex((i) => (i + 1) % banners.length);
        setVisible(true);
      }, 300);
    }, 30_000);

    return () => clearInterval(interval);
  }, [banners.length]);

  if (dismissed || banners.length === 0) return null;

  return (
    <div className="relative z-50 bg-[#1a1a2e] shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
      <div className="axion-container flex min-h-[2.75rem] items-center justify-center px-12">
        <span
          className="text-sm font-semibold tracking-wide text-white transition-opacity duration-300 sm:text-[0.95rem]"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {banners[activeIndex].text}
        </span>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="absolute right-3 rounded-full p-1 text-white/50 transition hover:bg-white/10 hover:text-white"
          aria-label="Dismiss banner"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
