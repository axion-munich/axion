"use client";

import { Menu } from "lucide-react";

import type { NavLink } from "@/data/site-content";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type MobileNavProps = {
  applicationsOpen: boolean;
  links: NavLink[];
};

export function MobileNav({ applicationsOpen, links }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden rounded-full border border-border bg-card/70 text-foreground hover:bg-accent"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="border-border bg-background px-0 text-foreground">
        <SheetHeader className="border-b border-border px-5 pb-5">
          <SheetTitle className="font-[family-name:var(--font-unbounded)] text-lg text-primary">
            axion
          </SheetTitle>
        </SheetHeader>

        <nav className="grid gap-1 px-3 pt-3">
          {links.map((link) => (
            <SheetClose asChild key={link.id}>
              <a
                href={`#${link.id}`}
                className="rounded-md px-3 py-2 text-sm text-foreground transition hover:bg-accent"
              >
                {link.label}
              </a>
            </SheetClose>
          ))}
        </nav>

        <SheetFooter className="border-t border-border px-5 py-5">
          <ThemeToggle />
          {applicationsOpen ? (
            <SheetClose asChild>
              <a
                href="/apply"
                className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground"
              >
                Apply Now
              </a>
            </SheetClose>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex h-10 cursor-not-allowed items-center justify-center rounded-full bg-muted px-4 text-sm font-semibold text-muted-foreground"
            >
              Applications closed
            </button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
