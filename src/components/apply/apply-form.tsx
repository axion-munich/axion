"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Upload } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SubmitState = {
  kind: "idle" | "success" | "error";
  message: string;
};

type FormValues = {
  fullName: string;
  email: string;
  university: string;
  program: string;
  experience: string;
  impactStory: string;
  motivation: string;
  strengths: string;
};

const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024;

const STEP_TITLES = [
  "Personal information",
  "Question 1",
  "Question 2",
  "Question 3",
  "Question 4",
  "CV upload",
] as const;

const INITIAL_VALUES: FormValues = {
  fullName: "",
  email: "",
  university: "",
  program: "",
  experience: "",
  impactStory: "",
  motivation: "",
  strengths: "",
};

export function ApplyForm() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({
    kind: "idle",
    message: "",
  });

  const progress = useMemo(() => ((step + 1) / STEP_TITLES.length) * 100, [step]);

  function updateField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((previous) => ({ ...previous, [field]: value }));
  }

  function validateStep(currentStep: number): string | null {
    if (currentStep === 0) {
      if (!values.fullName.trim()) return "Please enter your full name.";
      if (!values.email.trim()) return "Please enter your email address.";
      if (!values.university.trim()) return "Please enter your university.";
      if (!values.program.trim()) return "Please enter your study program / degree.";
      return null;
    }

    if (currentStep === 1 && !values.experience.trim()) {
      return "Please answer question 1 before continuing.";
    }

    if (currentStep === 2 && !values.impactStory.trim()) {
      return "Please answer question 2 before continuing.";
    }

    if (currentStep === 3 && !values.motivation.trim()) {
      return "Please answer question 3 before continuing.";
    }

    if (currentStep === 4 && !values.strengths.trim()) {
      return "Please answer question 4 before continuing.";
    }

    if (currentStep === 5) {
      if (!cvFile) {
        return "Please upload your CV before submitting.";
      }

      if (cvFile.size > MAX_CV_SIZE_BYTES) {
        return "CV file is too large. Please upload a file up to 5MB.";
      }
    }

    return null;
  }

  function goNext() {
    const error = validateStep(step);

    if (error) {
      setSubmitState({ kind: "error", message: error });
      return;
    }

    setSubmitState({ kind: "idle", message: "" });
    setStep((current) => Math.min(current + 1, STEP_TITLES.length - 1));
  }

  function goBack() {
    setSubmitState({ kind: "idle", message: "" });
    setStep((current) => Math.max(current - 1, 0));
  }

  async function onSubmit() {
    const error = validateStep(step);

    if (error) {
      setSubmitState({ kind: "error", message: error });
      return;
    }

    if (!cvFile) {
      setSubmitState({
        kind: "error",
        message: "Please upload your CV before submitting.",
      });
      return;
    }

    const payload = new FormData();
    payload.append("fullName", values.fullName.trim());
    payload.append("email", values.email.trim());
    payload.append("university", values.university.trim());
    payload.append("program", values.program.trim());
    payload.append("experience", values.experience.trim());
    payload.append("impactStory", values.impactStory.trim());
    payload.append("motivation", values.motivation.trim());
    payload.append("strengths", values.strengths.trim());
    payload.append("cv", cvFile);

    setIsSubmitting(true);
    setSubmitState({ kind: "idle", message: "" });

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        body: payload,
      });

      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Submission failed. Please try again.");
      }

      setValues(INITIAL_VALUES);
      setCvFile(null);
      setStep(0);
      setSubmitState({
        kind: "success",
        message:
          data.message ||
          "Application submitted successfully. We will get back to you soon.",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      setSubmitState({ kind: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  }

  const isSuccess = submitState.kind === "success";

  return (
    <div className="min-h-screen bg-background pb-16">
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="axion-container flex h-16 items-center justify-between">
          <Link href="/" className="axion-title text-lg text-primary">
            axion
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="axion-container py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to homepage
          </Link>

          <Badge className="border-primary/35 bg-primary/10 text-primary" variant="outline">
            Student Application
          </Badge>
        </div>

        <Card className="mx-auto w-full max-w-3xl overflow-hidden border-[#8ba0ff]/25 bg-card/90 dark:bg-[#0d1020]/70">
          {isSuccess ? (
            <CardContent className="relative overflow-hidden px-6 py-14 sm:px-10 sm:py-18">
              <div className="pointer-events-none absolute inset-0">
                <div className="axion-firework axion-firework-1" />
                <div className="axion-firework axion-firework-2" />
                <div className="axion-firework axion-firework-3" />
                <div className="axion-firework axion-firework-4" />
                <div className="axion-confetti axion-confetti-1" />
                <div className="axion-confetti axion-confetti-2" />
                <div className="axion-confetti axion-confetti-3" />
                <div className="axion-confetti axion-confetti-4" />
                <div className="axion-confetti axion-confetti-5" />
                <div className="axion-confetti axion-confetti-6" />
              </div>

              <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
                <div className="mb-6 flex size-18 items-center justify-center rounded-full border border-primary/30 bg-primary/12 shadow-[0_0_40px_rgba(139,160,255,0.25)]">
                  <CheckCircle2 className="size-9 text-primary" />
                </div>

                <p className="mb-3 text-xs uppercase tracking-[0.2em] text-primary/80">
                  Application received
                </p>
                <h1 className="axion-title max-w-xl text-4xl text-foreground sm:text-5xl">
                  Congrats, your application was successfully submitted.
                </h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                  We will review your application carefully and you should hear from us within one week.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href="/">Back to homepage</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          ) : (
            <>
              <CardHeader className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Step {step + 1} of {STEP_TITLES.length}
                  </p>
                  <CardTitle className="axion-title text-3xl text-foreground">
                    {STEP_TITLES[step]}
                  </CardTitle>
                </div>

                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {step === 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2 sm:col-span-2">
                      <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                        Full name
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={values.fullName}
                        onChange={(event) => updateField("fullName", event.target.value)}
                        className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/35"
                        placeholder="Full name"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">
                        Email address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={(event) => updateField("email", event.target.value)}
                        className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/35"
                        placeholder="name@email.com"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label htmlFor="university" className="text-sm font-medium text-foreground">
                        University
                      </label>
                      <input
                        id="university"
                        name="university"
                        type="text"
                        value={values.university}
                        onChange={(event) => updateField("university", event.target.value)}
                        className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/35"
                        placeholder="University name"
                      />
                    </div>

                    <div className="grid gap-2 sm:col-span-2">
                      <label htmlFor="program" className="text-sm font-medium text-foreground">
                        Study program / degree
                      </label>
                      <input
                        id="program"
                        name="program"
                        type="text"
                        value={values.program}
                        onChange={(event) => updateField("program", event.target.value)}
                        className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/35"
                        placeholder="Program / degree"
                      />
                    </div>
                  </div>
                ) : null}

                {step === 1 ? (
                  <div className="grid gap-3">
                    <p className="text-sm font-medium text-foreground">
                      Tell us about your previous internships, work experiences, or projects. What was your role and what did you do?
                    </p>
                    <textarea
                      name="experience"
                      rows={8}
                      value={values.experience}
                      onChange={(event) => updateField("experience", event.target.value)}
                      className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/35"
                      placeholder="Write your answer here"
                    />
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className="grid gap-3">
                    <p className="text-sm font-medium text-foreground">
                      Describe one achievement or impact story you are proud of. What was the challenge and what was the result?
                    </p>
                    <textarea
                      name="impactStory"
                      rows={8}
                      value={values.impactStory}
                      onChange={(event) => updateField("impactStory", event.target.value)}
                      className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/35"
                      placeholder="Write your answer here"
                    />
                  </div>
                ) : null}

                {step === 3 ? (
                  <div className="grid gap-3">
                    <p className="text-sm font-medium text-foreground">
                      Why do you want to join axion, and which area interests you most (Consulting Track or Venture Track)?
                    </p>
                    <textarea
                      name="motivation"
                      rows={8}
                      value={values.motivation}
                      onChange={(event) => updateField("motivation", event.target.value)}
                      className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/35"
                      placeholder="Write your answer here"
                    />
                  </div>
                ) : null}

                {step === 4 ? (
                  <div className="grid gap-3">
                    <p className="text-sm font-medium text-foreground">
                      What skills, perspectives, or strengths would you bring to axion and to a project team?
                    </p>
                    <textarea
                      name="strengths"
                      rows={8}
                      value={values.strengths}
                      onChange={(event) => updateField("strengths", event.target.value)}
                      className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/35"
                      placeholder="Write your answer here"
                    />
                  </div>
                ) : null}

                {step === 5 ? (
                  <div className="grid gap-3">
                    <p className="text-sm font-medium text-foreground">
                      Upload your CV (PDF, DOC, DOCX, max 5MB)
                    </p>
                    <div className="flex items-center gap-3 rounded-lg border border-dashed border-border bg-background px-3 py-3">
                      <Upload className="size-4 text-primary" />
                      <input
                        id="cv"
                        name="cv"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(event) => {
                          const selected = event.target.files?.[0] || null;
                          setCvFile(selected);
                        }}
                        className="w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary/15 file:px-3 file:py-1.5 file:text-primary"
                      />
                    </div>
                    {cvFile ? (
                      <p className="text-xs text-muted-foreground">
                        Selected file: {cvFile.name}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {submitState.kind === "error" ? (
                  <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                    {submitState.message}
                  </p>
                ) : null}

                <div className="flex flex-wrap justify-between gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goBack}
                    disabled={step === 0 || isSubmitting}
                    className="rounded-full border-border bg-card/70 hover:bg-accent"
                  >
                    Back
                  </Button>

                  {step < STEP_TITLES.length - 1 ? (
                    <Button
                      type="button"
                      onClick={goNext}
                      disabled={isSubmitting}
                      className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Next
                      <ArrowRight className="size-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={onSubmit}
                      disabled={isSubmitting}
                      className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit application"
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </main>
    </div>
  );
}
