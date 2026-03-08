import { createHash, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "axion_admin_session";

function getAdminUsername() {
  return process.env.ADMIN_USERNAME || "";
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function isAdminCredentialsSet() {
  return getAdminUsername().length > 0 && getAdminPassword().length > 0;
}

export function areAdminCredentialsValid(candidate: {
  username: string;
  password: string;
}) {
  const expectedUsername = getAdminUsername();
  const expectedPassword = getAdminPassword();

  if (!expectedUsername || !expectedPassword) {
    return false;
  }

  return (
    safeEqual(candidate.username, expectedUsername) &&
    safeEqual(candidate.password, expectedPassword)
  );
}

export function getAdminSessionValue() {
  return hashValue(`${getAdminUsername()}:${getAdminPassword()}`);
}

export function attachAdminSession(response: NextResponse) {
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: getAdminSessionValue(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export function clearAdminSession(response: NextResponse) {
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function isAdminAuthenticated() {
  if (!isAdminCredentialsSet()) {
    return false;
  }

  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!session) {
    return false;
  }

  return safeEqual(session, getAdminSessionValue());
}

export function isAdminRequestAuthenticated(request: NextRequest) {
  if (!isAdminCredentialsSet()) {
    return false;
  }

  const session = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

  if (!session) {
    return false;
  }

  return safeEqual(session, getAdminSessionValue());
}
