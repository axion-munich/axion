import { NextRequest, NextResponse } from "next/server";
import { extname, join } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

import { isAdminRequestAuthenticated } from "@/lib/admin-auth";
import { addTeamMember, removeTeamMember, updateTeamMember } from "@/lib/site-cms";

const TEAM_UPLOADS_DIRECTORY = join(process.cwd(), "public", "uploads", "team");
const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;
const OUTPUT_WIDTH = 960;
const OUTPUT_HEIGHT = 1280;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

async function storeTeamImage(file: File, memberName: string) {
  const originalExtension = extname(file.name || "").toLowerCase();
  const fallbackExtension =
    file.type === "image/png"
      ? ".png"
      : file.type === "image/webp"
        ? ".webp"
        : file.type === "image/avif"
          ? ".avif"
          : ".jpg";
  const extension = originalExtension || fallbackExtension;

  if (![".png", ".jpg", ".jpeg", ".webp", ".avif"].includes(extension)) {
    throw new Error("Please upload a PNG, JPG, JPEG, WEBP, or AVIF image.");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("Please upload an image up to 8MB.");
  }

  const fileName = `${slugify(memberName) || "team-member"}-${Date.now()}.webp`;
  const filePath = join(TEAM_UPLOADS_DIRECTORY, fileName);
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const normalizedBuffer = await sharp(fileBuffer)
    .rotate()
    .resize(OUTPUT_WIDTH, OUTPUT_HEIGHT, {
      fit: "cover",
      position: "attention",
    })
    .sharpen({ sigma: 1 })
    .webp({ quality: 88 })
    .toBuffer();

  await mkdir(TEAM_UPLOADS_DIRECTORY, { recursive: true });
  await writeFile(filePath, normalizedBuffer);

  return `/uploads/team/${fileName}`;
}

export async function POST(request: NextRequest) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const name = formData.get("name");
  const role = formData.get("role");
  const bio = formData.get("bio");
  const expertise = formData.get("expertise");
  const image = formData.get("image");

  if (
    typeof name !== "string" ||
    typeof role !== "string" ||
    !(image instanceof File) ||
    image.size === 0 ||
    !name.trim() ||
    !role.trim()
  ) {
    return NextResponse.json(
      { error: "Name, role, and image file are required." },
      { status: 400 }
    );
  }

  const imagePath = await storeTeamImage(image, name);

  const next = await addTeamMember({
    name,
    role,
    image: imagePath,
    bio: typeof bio === "string" ? bio : "",
    expertise: typeof expertise === "string" ? expertise.split(",") : [],
  });

  return NextResponse.json({ ok: true, teamMembers: next.teamMembers });
}

export async function DELETE(request: NextRequest) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as { id?: string };

  if (!body.id?.trim()) {
    return NextResponse.json({ error: "Member id is required." }, { status: 400 });
  }

  const next = await removeTeamMember(body.id);
  return NextResponse.json({ ok: true, teamMembers: next.teamMembers });
}

export async function PATCH(request: NextRequest) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const id = formData.get("id");
  const name = formData.get("name");
  const role = formData.get("role");
  const bio = formData.get("bio");
  const expertise = formData.get("expertise");
  const image = formData.get("image");

  if (
    typeof id !== "string" ||
    typeof name !== "string" ||
    typeof role !== "string" ||
    !id.trim() ||
    !name.trim() ||
    !role.trim()
  ) {
    return NextResponse.json(
      { error: "Id, name, and role are required." },
      { status: 400 }
    );
  }

  let imagePath: string | undefined;

  if (image instanceof File && image.size > 0) {
    imagePath = await storeTeamImage(image, name);
  }

  const next = await updateTeamMember({
    id,
    name,
    role,
    image: imagePath,
    bio: typeof bio === "string" ? bio : "",
    expertise: typeof expertise === "string" ? expertise.split(",") : [],
  });

  return NextResponse.json({ ok: true, teamMembers: next.teamMembers });
}
