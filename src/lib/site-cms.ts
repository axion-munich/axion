import { google } from "googleapis";

export type EditableTeamMember = {
  id: string;
  name: string;
  role: string;
  image: string;
};

export type TeamStats = {
  memberCount: number;
  nationalityCount: number;
};

export type SiteCms = {
  applicationsOpen: boolean;
  teamMembers: EditableTeamMember[];
  teamStats: TeamStats;
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

  if (!existing.includes("Form responses 1")) {
    requests.push({ addSheet: { properties: { title: "Form responses 1" } } });
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

// Columns: A=Timestamp, B=First Name, C=Surname, D=Email, E=Phone, F=University, G=Nationality, H=Role, I=Image
type TeamSheetRow = string[];

async function readTeamRawRows(sheets: Sheets, spreadsheetId: string): Promise<TeamSheetRow[]> {
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "'Form responses 1'!A:I",
  });

  const rows = result.data.values || [];

  // Skip header row
  if (rows.length <= 1) return [];

  return rows.slice(1).filter((row) => row[1]); // filter out rows without a first name
}

function mapRowsToMembers(rows: TeamSheetRow[]): EditableTeamMember[] {
  return rows.map((row, index) => ({
    id: `row-${index + 2}`, // +2 because row 1 is header, index is 0-based
    name: [row[1] || "", row[2] || ""].filter(Boolean).join(" "),
    role: row[7] || "",
    image: row[8] || "",
  }));
}

function computeStats(rows: TeamSheetRow[]): TeamStats {
  const memberCount = rows.length;
  const nationalities = new Set(
    rows.map((row) => (row[6] || "").trim().toLowerCase()).filter(Boolean)
  );
  return {
    memberCount,
    nationalityCount: nationalities.size,
  };
}

async function getFormResponsesSheetId(sheets: Sheets, spreadsheetId: string): Promise<number> {
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties(sheetId,title)",
  });

  const tab = spreadsheet.data.sheets?.find((s) => s.properties?.title === "Form responses 1");

  if (tab?.properties?.sheetId == null) {
    throw new Error("'Form responses 1' tab not found in the spreadsheet.");
  }

  return tab.properties.sheetId;
}

/* ---------- In-memory cache ---------- */

let cache: { data: SiteCms; ts: number } | null = null;
const CACHE_TTL = 30_000;

function invalidateCache() {
  cache = null;
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

  const rawRows = await readTeamRawRows(sheets, spreadsheetId);
  const teamMembers = mapRowsToMembers(rawRows);
  const teamStats = computeStats(rawRows);

  const applicationsOpenStr = await getSettingsValue(sheets, spreadsheetId, "applicationsOpen");
  const updatedAt =
    (await getSettingsValue(sheets, spreadsheetId, "updatedAt")) || new Date().toISOString();

  const data: SiteCms = {
    applicationsOpen: applicationsOpenStr === "true",
    teamMembers,
    teamStats,
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

  const rawRows = await readTeamRawRows(sheets, spreadsheetId);
  const teamMembers = mapRowsToMembers(rawRows);
  const teamStats = computeStats(rawRows);

  return {
    applicationsOpen,
    teamMembers,
    teamStats,
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
    range: "'Form responses 1'!A1:I1",
  });

  if (!existing.data.values?.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "'Form responses 1'!A1",
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            "Timestamp",
            "First Name",
            "Surname",
            "Email Address",
            "Phone Number",
            "University",
            "Nationality",
            "Role",
            "Image",
          ],
        ],
      },
    });
  }

  const [firstName, ...surnameParts] = input.name.trim().split(/\s+/);
  const surname = surnameParts.join(" ");

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "'Form responses 1'!A:I",
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          new Date().toISOString(), // Timestamp
          firstName,
          surname,
          "", // Email
          "", // Phone
          "", // University
          "", // Nationality
          input.role.trim(),
          input.image.trim(),
        ],
      ],
    },
  });

  await setSettingsValue(sheets, spreadsheetId, "updatedAt", new Date().toISOString());
  invalidateCache();

  const rawRows = await readTeamRawRows(sheets, spreadsheetId);
  const teamMembers = mapRowsToMembers(rawRows);
  const teamStats = computeStats(rawRows);

  return {
    applicationsOpen: false,
    teamMembers,
    teamStats,
    updatedAt: new Date().toISOString(),
  } satisfies SiteCms;
}

export async function removeTeamMember(memberId: string) {
  const auth = getAuth();
  const spreadsheetId = getSheetId();
  const sheets = google.sheets({ version: "v4", auth });

  await ensureTabs(sheets, spreadsheetId);

  // memberId is "row-{sheetRowNumber}", extract the row number
  const match = memberId.match(/^row-(\d+)$/);
  if (!match) {
    throw new Error("Invalid team member ID format.");
  }

  const sheetRowNumber = parseInt(match[1], 10);

  // Verify the row exists by reading it
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'Form responses 1'!A${sheetRowNumber}:I${sheetRowNumber}`,
  });

  if (!result.data.values?.length || !result.data.values[0][1]) {
    throw new Error("Team member not found.");
  }

  const tabSheetId = await getFormResponsesSheetId(sheets, spreadsheetId);

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: tabSheetId,
              dimension: "ROWS",
              startIndex: sheetRowNumber - 1, // 0-indexed
              endIndex: sheetRowNumber,
            },
          },
        },
      ],
    },
  });

  await setSettingsValue(sheets, spreadsheetId, "updatedAt", new Date().toISOString());
  invalidateCache();

  const rawRows = await readTeamRawRows(sheets, spreadsheetId);
  const teamMembers = mapRowsToMembers(rawRows);
  const teamStats = computeStats(rawRows);

  return {
    applicationsOpen: false,
    teamMembers,
    teamStats,
    updatedAt: new Date().toISOString(),
  } satisfies SiteCms;
}

export async function updateTeamMember(input: UpdateTeamMemberInput) {
  const auth = getAuth();
  const spreadsheetId = getSheetId();
  const sheets = google.sheets({ version: "v4", auth });

  await ensureTabs(sheets, spreadsheetId);

  // memberId is "row-{sheetRowNumber}"
  const match = input.id.match(/^row-(\d+)$/);
  if (!match) {
    throw new Error("Invalid team member ID format.");
  }

  const sheetRowNumber = parseInt(match[1], 10);

  // Read existing row to preserve other columns
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'Form responses 1'!A${sheetRowNumber}:I${sheetRowNumber}`,
  });

  const existingRow = result.data.values?.[0];
  if (!existingRow || !existingRow[1]) {
    throw new Error("Team member not found.");
  }

  const [firstName, ...surnameParts] = input.name.trim().split(/\s+/);
  const surname = surnameParts.join(" ");
  const image = input.image?.trim() || existingRow[8] || "";

  // Update only name (B, C), role (H), and image (I) — preserve other columns
  const updatedRow = [
    existingRow[0] || "", // Timestamp
    firstName,
    surname,
    existingRow[3] || "", // Email
    existingRow[4] || "", // Phone
    existingRow[5] || "", // University
    existingRow[6] || "", // Nationality
    input.role.trim(),
    image,
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `'Form responses 1'!A${sheetRowNumber}:I${sheetRowNumber}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [updatedRow],
    },
  });

  await setSettingsValue(sheets, spreadsheetId, "updatedAt", new Date().toISOString());
  invalidateCache();

  const rawRows = await readTeamRawRows(sheets, spreadsheetId);
  const teamMembers = mapRowsToMembers(rawRows);
  const teamStats = computeStats(rawRows);

  return {
    applicationsOpen: false,
    teamMembers,
    teamStats,
    updatedAt: new Date().toISOString(),
  } satisfies SiteCms;
}
