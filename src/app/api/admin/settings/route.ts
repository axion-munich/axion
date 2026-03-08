import { NextRequest, NextResponse } from "next/server";

import { isAdminRequestAuthenticated } from "@/lib/admin-auth";
import { setApplicationsOpen } from "@/lib/site-cms";

export async function PATCH(request: NextRequest) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as { applicationsOpen?: boolean };

  if (typeof body.applicationsOpen !== "boolean") {
    return NextResponse.json(
      { error: "applicationsOpen must be a boolean." },
      { status: 400 }
    );
  }

  const next = await setApplicationsOpen(body.applicationsOpen);
  return NextResponse.json({ ok: true, applicationsOpen: next.applicationsOpen });
}
