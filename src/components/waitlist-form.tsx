"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState(""); // honeypot — must stay empty
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), _trap: trap }),
      });

      const data: { success?: boolean; error?: string } = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-1 py-1">
        <p className="text-base font-medium text-foreground">You&apos;re on the list!</p>
        <p className="text-sm text-muted-foreground">We&apos;ll notify you when applications open.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-sm flex-col items-center gap-2"
      noValidate
    >
      {/* Honeypot — visually hidden, never filled by real users */}
      <input
        type="text"
        name="_trap"
        value={trap}
        onChange={(e) => setTrap(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}
      />

      <div className="flex w-full gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          maxLength={254}
          disabled={status === "loading"}
          className="min-w-0 flex-1 rounded-full border border-border bg-background/70 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
        />
        <Button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-full bg-primary px-5 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {status === "loading" ? (
            "..."
          ) : (
            <>
              Notify me <ArrowRight className="size-3.5" />
            </>
          )}
        </Button>
      </div>

      {status === "error" && (
        <p className="text-xs text-destructive">{errorMsg}</p>
      )}

    </form>
  );
}
