import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple in-memory rate limiter — per serverless instance, resets on cold start.
// Provides basic abuse protection within a single instance's lifetime.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT) return true;

  entry.count++;
  return false;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  // --- Rate limiting ---
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  // --- Parse body ---
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { email, _trap } = body as Record<string, unknown>;

  // --- Honeypot: bots fill hidden fields, humans don't ---
  if (_trap) {
    // Silently succeed so bots don't know they were blocked
    return NextResponse.json({ success: true });
  }

  // --- Email validation ---
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const trimmed = email.trim().toLowerCase();

  if (trimmed.length > 254 || !EMAIL_REGEX.test(trimmed)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  // --- Env guard ---
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    console.error("[waitlist] RESEND_API_KEY or RESEND_AUDIENCE_ID not set.");
    return NextResponse.json(
      { error: "Service unavailable. Please try again later." },
      { status: 503 }
    );
  }

  // --- Add to Resend Audience ---
  try {
    const resend = new Resend(apiKey);

    await resend.contacts.create({
      email: trimmed,
      audienceId,
      unsubscribed: false,
    });
  } catch (err) {
    // Log full error server-side, return generic message to client
    console.error("[waitlist] Resend error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
