import { NextRequest, NextResponse } from "next/server";

import { isAdminRequestAuthenticated } from "@/lib/admin-auth";
import { addTeamMember } from "@/lib/site-cms";

export async function POST(request: NextRequest) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as {
    name?: string;
    role?: string;
    image?: string;
    bio?: string;
    expertise?: string;
  };

  if (!body.name?.trim() || !body.role?.trim() || !body.image?.trim()) {
    return NextResponse.json(
      { error: "Name, role, and image URL are required." },
      { status: 400 }
    );
  }

  const next = await addTeamMember({
    name: body.name,
    role: body.role,
    image: body.image,
    bio: body.bio,
    expertise: typeof body.expertise === "string" ? body.expertise.split(",") : [],
  });

  return NextResponse.json({ ok: true, teamMembers: next.teamMembers });
}
