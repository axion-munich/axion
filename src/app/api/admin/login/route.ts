import { NextResponse } from "next/server";

import {
  areAdminCredentialsValid,
  attachAdminSession,
  isAdminCredentialsSet,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!isAdminCredentialsSet()) {
    return NextResponse.json(
      { error: "ADMIN_USERNAME and ADMIN_PASSWORD must be configured." },
      { status: 500 }
    );
  }

  const body = (await request.json()) as { username?: string; password?: string };

  if (
    !body.username ||
    !body.password ||
    !areAdminCredentialsValid({ username: body.username, password: body.password })
  ) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  attachAdminSession(response);
  return response;
}
