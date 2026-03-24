import { NextRequest, NextResponse } from "next/server";

import { isAdminRequestAuthenticated } from "@/lib/admin-auth";
import { setApplicationsOpen, setBanners } from "@/lib/site-cms";
import type { BannerItem } from "@/lib/site-cms";

export async function PATCH(request: NextRequest) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as {
    applicationsOpen?: boolean;
    banners?: BannerItem[];
  };

  // Handle applications toggle
  if (typeof body.applicationsOpen === "boolean") {
    const next = await setApplicationsOpen(body.applicationsOpen);
    return NextResponse.json({ ok: true, applicationsOpen: next.applicationsOpen });
  }

  // Handle banners update
  if (Array.isArray(body.banners)) {
    await setBanners(body.banners);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json(
    { error: "No valid fields provided." },
    { status: 400 }
  );
}
