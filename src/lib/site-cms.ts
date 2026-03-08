import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { teamMembers, type TeamMember } from "@/data/site-content";

export type EditableTeamMember = TeamMember & {
  id: string;
};

export type SiteCms = {
  applicationsOpen: boolean;
  teamMembers: EditableTeamMember[];
  updatedAt: string;
};

type AddTeamMemberInput = {
  name: string;
  role: string;
  image: string;
  bio?: string;
  expertise?: string[];
};

const CMS_DIRECTORY = path.join(process.cwd(), "content");
const CMS_FILE_PATH = path.join(CMS_DIRECTORY, "site-cms.json");

function createDefaultCms(): SiteCms {
  return {
    applicationsOpen: false,
    teamMembers: teamMembers.map((member) => ({
      ...member,
      id: randomUUID(),
    })),
    updatedAt: new Date().toISOString(),
  };
}

async function ensureCmsFile() {
  try {
    await readFile(CMS_FILE_PATH, "utf8");
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? error.code : undefined;

    if (code !== "ENOENT") {
      throw error;
    }

    await mkdir(CMS_DIRECTORY, { recursive: true });
    await writeFile(CMS_FILE_PATH, JSON.stringify(createDefaultCms(), null, 2), "utf8");
  }
}

export async function getSiteCms(): Promise<SiteCms> {
  await ensureCmsFile();
  const raw = await readFile(CMS_FILE_PATH, "utf8");
  const parsed = JSON.parse(raw) as Partial<SiteCms>;

  return {
    applicationsOpen: Boolean(parsed.applicationsOpen),
    teamMembers: Array.isArray(parsed.teamMembers)
      ? parsed.teamMembers.map((member) => ({
          id: typeof member.id === "string" ? member.id : randomUUID(),
          name: typeof member.name === "string" ? member.name : "",
          role: typeof member.role === "string" ? member.role : "",
          image: typeof member.image === "string" ? member.image : "",
          bio: typeof member.bio === "string" ? member.bio : "",
          expertise: Array.isArray(member.expertise)
            ? member.expertise.filter((item): item is string => typeof item === "string")
            : [],
        }))
      : createDefaultCms().teamMembers,
    updatedAt:
      typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
  };
}

export async function saveSiteCms(data: SiteCms) {
  await mkdir(CMS_DIRECTORY, { recursive: true });
  await writeFile(
    CMS_FILE_PATH,
    JSON.stringify({ ...data, updatedAt: new Date().toISOString() }, null, 2),
    "utf8"
  );
}

export async function setApplicationsOpen(applicationsOpen: boolean) {
  const current = await getSiteCms();
  const next: SiteCms = {
    ...current,
    applicationsOpen,
    updatedAt: new Date().toISOString(),
  };

  await saveSiteCms(next);
  return next;
}

export async function addTeamMember(input: AddTeamMemberInput) {
  const current = await getSiteCms();

  const member: EditableTeamMember = {
    id: randomUUID(),
    name: input.name.trim(),
    role: input.role.trim(),
    image: input.image.trim(),
    bio: input.bio?.trim() || "",
    expertise: (input.expertise || []).map((item) => item.trim()).filter(Boolean),
  };

  const next: SiteCms = {
    ...current,
    teamMembers: [...current.teamMembers, member],
    updatedAt: new Date().toISOString(),
  };

  await saveSiteCms(next);
  return next;
}
