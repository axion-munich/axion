import { Readable } from "node:stream";

import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

import { isAdminRequestAuthenticated } from "@/lib/admin-auth";
import { addTeamMember, removeTeamMember, updateTeamMember } from "@/lib/site-cms";

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

async function uploadTeamImage(file: File, memberName: string): Promise<string> {
  const ext = (file.name || "").split(".").pop()?.toLowerCase() || "";
  const allowed = ["png", "jpg", "jpeg", "webp", "avif"];

  if (ext && !allowed.includes(ext)) {
    throw new Error("Please upload a PNG, JPG, JPEG, WEBP, or AVIF image.");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("Please upload an image up to 8MB.");
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const processedBuffer = await sharp(fileBuffer)
    .rotate()
    .resize(OUTPUT_WIDTH, OUTPUT_HEIGHT, {
      fit: "cover",
      position: "attention",
    })
    .sharpen({ sigma: 1 })
    .webp({ quality: 88 })
    .toBuffer();

  const email = process.env.GOOGLE_CLIENT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!email || !key) {
    throw new Error("Google credentials are not configured.");
  }

  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  const drive = google.drive({ version: "v3", auth });
  const fileName = `${slugify(memberName) || "team-member"}-${Date.now()}.webp`;

  const created = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: folderId ? [folderId] : undefined,
    },
    media: {
      mimeType: "image/webp",
      body: Readable.from(processedBuffer),
    },
    fields: "id",
    supportsAllDrives: true,
  });

  const fileId = created.data.id;

  if (!fileId) {
    throw new Error("Image upload to Google Drive failed.");
  }

  await drive.permissions.create({
    fileId,
    requestBody: { role: "reader", type: "anyone" },
    supportsAllDrives: true,
  });

  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

export async function POST(request: NextRequest) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const name = formData.get("name");
  const role = formData.get("role");
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

  const imagePath = await uploadTeamImage(image, name);

  const next = await addTeamMember({
    name,
    role,
    image: imagePath,
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
    imagePath = await uploadTeamImage(image, name);
  }

  const next = await updateTeamMember({
    id,
    name,
    role,
    image: imagePath,
  });

  return NextResponse.json({ ok: true, teamMembers: next.teamMembers });
}
