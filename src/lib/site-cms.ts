import { randomUUID } from "node:crypto";

import { google } from "googleapis";

import { teamMembers as defaultTeamMembers } from "@/data/site-content";

export type EditableTeamMember = {
  id: string;
  name: string;
  role: string;
  image: string;
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
};

type UpdateTeamMemberInput = {
  id: string;
  name: string;
  role: string;
  image?: string;
};

/* ---------- Google Sheets helpers ---------- */

function getAuth() {
  const email = process.env.GOOGLE_CLIENT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!email || !key) {
    throw new Error("Set GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY.");
  }

  return new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheetId() {
  const id = process.env.GOOGLE_TEAM_SHEET_ID;

  if (!id) {
    throw new Error("Set GOOGLE_TEAM_SHEET_ID in environment variables.");
  }

  return id;
}

type Sheets = ReturnType<typeof google.sheets>;

let tabsEnsured = false;

async function ensureTabs(sheets: Sheets, spreadsheetId: string) {
  if (tabsEnsured) return;

  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties.title",
  });

  const existing = spreadsheet.data.sheets?.map((s) => s.properties?.title) || [];
  const requests: object[] = [];

  if (!existing.includes("Team")) {
    requests.push({ addSheet: { properties: { title: "Team" } } });
  }

  if (!existing.includes("Settings")) {
    requests.push({ addSheet: { properties: { title: "Settings" } } });
  }

  if (requests.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests },
    });
  }

  tabsEnsured = true;
}

async function getSettingsValue(
  sheets: Sheets,
  spreadsheetId: string,
  key: string
): Promise<string | null> {
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Settings!A:B",
  });

  for (const row of result.data.values || []) {
    if (row[0] === key) return row[1] ?? null;
  }

  return null;
}

async function setSettingsValue(
  sheets: Sheets,
  spreadsheetId: string,
  key: string,
  value: string
) {
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Settings!A:B",
  });

  const rows = result.data.values || [];
  const rowIndex = rows.findIndex((row) => row[0] === key);

  if (rowIndex >= 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Settings!B${rowIndex + 1}`,
      valueInputOption: "RAW",
      requestBody: { values: [[value]] },
    });
  } else {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Settings!A:B",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [[key, value]] },
    });
  }
}

async function readTeamRows(sheets: Sheets, spreadsheetId: string): Promise<EditableTeamMember[]> {
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Team!A:D",
  });

  const rows = result.data.values || [];

  if (rows.length <= 1) return [];

  return rows
    .slice(1)
    .filter((row) => row[0])
    .map((row) => ({
      id: row[0] || randomUUID(),
      name: row[1] || "",
      role: row[2] || "",
      image: row[3] || "",
    }));
}

async function getTeamTabSheetId(sheets: Sheets, spreadsheetId: string): Promise<number> {
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties(sheetId,title)",
  });

  const teamSheet = spreadsheet.data.sheets?.find((s) => s.properties?.title === "Team");

  if (teamSheet?.properties?.sheetId == null) {
    throw new Error("Team tab not found in the spreadsheet.");
  }

  return teamSheet.properties.sheetId;
}

/* ---------- In-memory cache ---------- */

let cache: { data: SiteCms; ts: number } | null = null;
const CACHE_TTL = 30_000;

function invalidateCache() {
  cache = null;
}

/* ---------- Seed defaults ---------- */

async function seedDefaults(sheets: Sheets, spreadsheetId: string): Promise<SiteCms> {
  const defaults: EditableTeamMember[] = defaultTeamMembers.map((m) => ({
    id: randomUUID(),
    name: m.name,
    role: m.role,
    image: m.image,
  }));

  const headerRow = ["ID", "Name", "Role", "Image"];
  const dataRows = defaults.map((m) => [m.id, m.name, m.role, m.image]);

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "Team!A1",
    valueInputOption: "RAW",
    requestBody: { values: [headerRow, ...dataRows] },
  });

  await setSettingsValue(sheets, spreadsheetId, "applicationsOpen", "false");
  await setSettingsValue(sheets, spreadsheetId, "updatedAt", new Date().toISOString());

  return {
    applicationsOpen: false,
    teamMembers: defaults,
    updatedAt: new Date().toISOString(),
  };
}

/* ---------- Public API ---------- */

export async function getSiteCms(): Promise<SiteCms> {
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return cache.data;
  }

  const auth = getAuth();
  const spreadsheetId = getSheetId();
  const sheets = google.sheets({ version: "v4", auth });

  await ensureTabs(sheets, spreadsheetId);

  const teamMembers = await readTeamRows(sheets, spreadsheetId);

  if (teamMembers.length === 0) {
    const seeded = await seedDefaults(sheets, spreadsheetId);
    cache = { data: seeded, ts: Date.now() };
    return seeded;
  }

  const applicationsOpenStr = await getSettingsValue(sheets, spreadsheetId, "applicationsOpen");
  const updatedAt =
    (await getSettingsValue(sheets, spreadsheetId, "updatedAt")) || new Date().toISOString();

  const data: SiteCms = {
    applicationsOpen: applicationsOpenStr === "true",
    teamMembers,
    updatedAt,
  };

  cache = { data, ts: Date.now() };
  return data;
}

export async function setApplicationsOpen(applicationsOpen: boolean) {
  const auth = getAuth();
  const spreadsheetId = getSheetId();
  const sheets = google.sheets({ version: "v4", auth });

  await ensureTabs(sheets, spreadsheetId);
  await setSettingsValue(sheets, spreadsheetId, "applicationsOpen", String(applicationsOpen));
  await setSettingsValue(sheets, spreadsheetId, "updatedAt", new Date().toISOString());

  invalidateCache();

  const teamMembers = await readTeamRows(sheets, spreadsheetId);

  return {
    applicationsOpen,
    teamMembers,
    updatedAt: new Date().toISOString(),
  } satisfies SiteCms;
}

export async function addTeamMember(input: AddTeamMemberInput) {
  const auth = getAuth();
  const spreadsheetId = getSheetId();
  const sheets = google.sheets({ version: "v4", auth });

  await ensureTabs(sheets, spreadsheetId);

  // Ensure header row exists
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Team!A1:D1",
  });

  if (!existing.data.values?.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "Team!A1",
      valueInputOption: "RAW",
      requestBody: { values: [["ID", "Name", "Role", "Image"]] },
    });
  }

  const id = randomUUID();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Team!A:D",
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[id, input.name.trim(), input.role.trim(), input.image.trim()]],
    },
  });

  await setSettingsValue(sheets, spreadsheetId, "updatedAt", new Date().toISOString());
  invalidateCache();

  const teamMembers = await readTeamRows(sheets, spreadsheetId);

  return {
    applicationsOpen: false,
    teamMembers,
    updatedAt: new Date().toISOString(),
  } satisfies SiteCms;
}

export async function removeTeamMember(memberId: string) {
  const auth = getAuth();
  const spreadsheetId = getSheetId();
  const sheets = google.sheets({ version: "v4", auth });

  await ensureTabs(sheets, spreadsheetId);

  // Find the row with this ID
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Team!A:A",
  });

  const ids = result.data.values || [];
  let rowIndex = -1;

  for (let i = 1; i < ids.length; i++) {
    if (ids[i]?.[0] === memberId) {
      rowIndex = i;
      break;
    }
  }

  if (rowIndex === -1) {
    throw new Error("Team member not found.");
  }

  const teamSheetId = await getTeamTabSheetId(sheets, spreadsheetId);

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: teamSheetId,
              dimension: "ROWS",
              startIndex: rowIndex,
              endIndex: rowIndex + 1,
            },
          },
        },
      ],
    },
  });

  await setSettingsValue(sheets, spreadsheetId, "updatedAt", new Date().toISOString());
  invalidateCache();

  const teamMembers = await readTeamRows(sheets, spreadsheetId);

  return {
    applicationsOpen: false,
    teamMembers,
    updatedAt: new Date().toISOString(),
  } satisfies SiteCms;
}

export async function updateTeamMember(input: UpdateTeamMemberInput) {
  const auth = getAuth();
  const spreadsheetId = getSheetId();
  const sheets = google.sheets({ version: "v4", auth });

  await ensureTabs(sheets, spreadsheetId);

  // Find the row
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Team!A:D",
  });

  const rows = result.data.values || [];
  let rowIndex = -1;

  for (let i = 1; i < rows.length; i++) {
    if (rows[i]?.[0] === input.id) {
      rowIndex = i;
      break;
    }
  }

  if (rowIndex === -1) {
    throw new Error("Team member not found.");
  }

  const existingImage = rows[rowIndex][3] || "";
  const image = input.image?.trim() || existingImage;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `Team!A${rowIndex + 1}:D${rowIndex + 1}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [[input.id, input.name.trim(), input.role.trim(), image]],
    },
  });

  await setSettingsValue(sheets, spreadsheetId, "updatedAt", new Date().toISOString());
  invalidateCache();

  const teamMembers = await readTeamRows(sheets, spreadsheetId);

  return {
    applicationsOpen: false,
    teamMembers,
    updatedAt: new Date().toISOString(),
  } satisfies SiteCms;
}
