import { Readable } from "node:stream";

import { google } from "googleapis";
import { NextResponse } from "next/server";

import { buildApplicationConfirmationEmail } from "@/lib/email-template";
import { sendEmail } from "@/lib/send-email";
import { getSiteCms } from "@/lib/site-cms";

export const runtime = "nodejs";

const REQUIRED_TEXT_FIELDS = [
  "fullName",
  "email",
  "university",
  "program",
  "motivation",
  "leadership",
  "businessIdea",
] as const;

const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024;

type RequiredField = (typeof REQUIRED_TEXT_FIELDS)[number];

type SubmissionValues = Record<RequiredField, string>;

type SubmissionContext = {
  sent: string;
};

type AppsScriptResponse = {
  ok?: boolean;
  error?: string;
  message?: string;
};

const SHEET_HEADERS = [
  "Vorname",
  "Nachname",
  "Universitaet",
  "E-Mail",
  "CV Link",
  "Studiengang",
  "Motivation",
  "Leadership",
  "Business Idea",
  "Consent",
  "Submitted At",
] as const;

function getRequiredText(
  formData: FormData,
  field: RequiredField
): string | undefined {
  const value = formData.get(field);

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function createSubmissionContext(): SubmissionContext {
  const submittedAt = new Date();

  return {
    sent: new Intl.DateTimeFormat("sv-SE", {
      dateStyle: "short",
      timeStyle: "medium",
      timeZone: "Europe/Berlin",
    })
      .format(submittedAt)
      .replace(",", ""),
  };
}

function buildSheetRow(values: SubmissionValues, cvUrl: string, context: SubmissionContext) {
  const [name = values.fullName, ...surnameParts] = values.fullName.trim().split(/\s+/);
  const surname = surnameParts.join(" ");

  return [
    name,
    surname,
    values.university,
    values.email,
    cvUrl,
    values.program,
    values.motivation,
    values.leadership,
    values.businessIdea,
    "yes",
    context.sent,
  ];
}

function hasExpectedHeaders(row: string[]) {
  return SHEET_HEADERS.every((header, index) => row[index] === header);
}

async function ensureSheetHeaders(params: {
  sheets: ReturnType<typeof google.sheets>;
  spreadsheetId: string;
  sheetTitle: string;
}) {
  const { sheets, spreadsheetId, sheetTitle } = params;
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties(sheetId,title)",
  });
  const targetSheet = spreadsheet.data.sheets?.find(
    (sheet) => sheet.properties?.title === sheetTitle
  );

  if (!targetSheet?.properties?.sheetId) {
    throw new Error("Could not resolve the target Google Sheet tab.");
  }

  const headerRange = `${sheetTitle}!A1:K1`;
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: headerRange,
  });
  const firstRow = existing.data.values?.[0] ?? [];

  if (hasExpectedHeaders(firstRow)) {
    return;
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          insertDimension: {
            range: {
              sheetId: targetSheet.properties.sheetId,
              dimension: "ROWS",
              startIndex: 0,
              endIndex: 1,
            },
            inheritFromBefore: false,
          },
        },
      ],
    },
  });

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          updateCells: {
            start: {
              sheetId: targetSheet.properties.sheetId,
              rowIndex: 0,
              columnIndex: 0,
            },
            rows: [
              {
                values: SHEET_HEADERS.map((header) => ({
                  userEnteredValue: { stringValue: header },
                })),
              },
            ],
            fields: "userEnteredValue",
          },
        },
      ],
    },
  });
}

async function submitViaAppsScript(params: {
  url: string;
  values: SubmissionValues;
  cv: File;
  cvBuffer: Buffer;
  context: SubmissionContext;
}) {
  const { url, values, cv, cvBuffer, context } = params;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      values,
      context,
      cv: {
        name: cv.name,
        mimeType: cv.type || "application/octet-stream",
        size: cv.size,
        base64: cvBuffer.toString("base64"),
      },
    }),
    cache: "no-store",
  });

  const rawText = await response.text();
  let data: AppsScriptResponse = {};

  try {
    data = rawText ? (JSON.parse(rawText) as AppsScriptResponse) : {};
  } catch {
    data = {};
  }

  if (!response.ok || !data.ok) {
    throw new Error(
      data.error ||
        data.message ||
        "Apps Script submission failed. Verify GOOGLE_APPS_SCRIPT_URL and your web app deployment settings."
    );
  }

  return data;
}

async function submitViaGoogleApis(params: {
  values: SubmissionValues;
  cv: File;
  cvBuffer: Buffer;
  context: SubmissionContext;
}) {
  const { values, cv, cvBuffer, context } = params;
  const googleClientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const googlePrivateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const googleSheetId = process.env.GOOGLE_SHEET_ID;
  const googleDriveFolderId = process.env.GOOGLE_CV_FOLDER_ID;

  if (!googleClientEmail || !googlePrivateKey || !googleSheetId) {
    throw new Error(
      "Google credentials are incomplete. Set GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SHEET_ID."
    );
  }

  const auth = new google.auth.JWT({
    email: googleClientEmail,
    key: googlePrivateKey,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
    ],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const drive = google.drive({ version: "v3", auth });

  const createdFile = await drive.files.create({
    requestBody: {
      name: `${values.fullName} - CV - ${Date.now()} - ${cv.name}`,
      parents: googleDriveFolderId ? [googleDriveFolderId] : undefined,
    },
    media: {
      mimeType: cv.type || "application/octet-stream",
      body: Readable.from(cvBuffer),
    },
    fields: "id,webViewLink,webContentLink",
    supportsAllDrives: true,
  });

  const driveFileId = createdFile.data.id;

  if (!driveFileId) {
    throw new Error("CV upload to Google Drive failed.");
  }

  await drive.permissions.create({
    fileId: driveFileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
    supportsAllDrives: true,
  });

  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: googleSheetId,
    fields: "sheets.properties.title",
  });

  const firstSheetTitle = spreadsheet.data.sheets?.[0]?.properties?.title;

  if (!firstSheetTitle) {
    throw new Error("Could not resolve the target Google Sheet tab.");
  }

  const cvUrl =
    createdFile.data.webViewLink ||
    createdFile.data.webContentLink ||
    `https://drive.google.com/file/d/${driveFileId}/view`;

  await ensureSheetHeaders({
    sheets,
    spreadsheetId: googleSheetId,
    sheetTitle: firstSheetTitle,
  });

  const row = buildSheetRow(values, cvUrl, context);

  await sheets.spreadsheets.values.append({
    spreadsheetId: googleSheetId,
    range: `${firstSheetTitle}!A:K`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [row],
    },
  });
}

export async function POST(request: Request) {
  try {
    const cms = await getSiteCms();

    if (!cms.applicationsOpen) {
      return NextResponse.json(
        { error: "Applications are currently closed." },
        { status: 403 }
      );
    }

    const formData = await request.formData();

    const values: SubmissionValues = {
      fullName: "",
      email: "",
      university: "",
      program: "",
      motivation: "",
      leadership: "",
      businessIdea: "",
    };

    for (const field of REQUIRED_TEXT_FIELDS) {
      const value = getRequiredText(formData, field);

      if (!value) {
        return NextResponse.json(
          { error: `Please fill the field: ${field}` },
          { status: 400 }
        );
      }

      values[field] = value;
    }

    const cv = formData.get("cv");

    if (!(cv instanceof File) || cv.size === 0) {
      return NextResponse.json(
        { error: "Please upload your CV before submitting." },
        { status: 400 }
      );
    }

    if (cv.size > MAX_CV_SIZE_BYTES) {
      return NextResponse.json(
        { error: "CV file is too large. Max allowed size is 5MB." },
        { status: 400 }
      );
    }

    const cvBuffer = Buffer.from(await cv.arrayBuffer());
    const context = createSubmissionContext();
    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (appsScriptUrl) {
      await submitViaAppsScript({
        url: appsScriptUrl,
        values,
        cv,
        cvBuffer,
        context,
      });
    } else {
      await submitViaGoogleApis({
        values,
        cv,
        cvBuffer,
        context,
      });
    }

    // Send confirmation email (non-blocking — don't fail the submission if email fails)
    const confirmation = buildApplicationConfirmationEmail(values.fullName);
    sendEmail({
      to: values.email,
      subject: confirmation.subject,
      html: confirmation.html,
    }).catch((err) => {
      console.error("[apply] Confirmation email failed:", err);
    });

    return NextResponse.json({
      ok: true,
      message: "Application submitted successfully.",
    });
  } catch (error) {
    console.error("[apply] Unexpected error", error);

    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof error.message === "string"
    ) {
      if (
        error.message.includes("File not found") ||
        error.message.includes("insufficientFilePermissions") ||
        error.message.includes("The user does not have sufficient permissions")
      ) {
        return NextResponse.json(
          {
            error:
              "Google Drive access failed. Share the Drive folder with the configured account and verify the folder ID.",
          },
          { status: 502 }
        );
      }

      if (
        error.message.includes("Drive API has not been used in project") ||
        error.message.includes("accessNotConfigured")
      ) {
        return NextResponse.json(
          {
            error:
              "Google Drive API is disabled for the configured project. Enable Drive API in Google Cloud, wait a few minutes, then try again.",
          },
          { status: 502 }
        );
      }

      if (
        error.message.includes("Google Sheets API has not been used in project") ||
        error.message.includes("sheets.googleapis.com")
      ) {
        return NextResponse.json(
          {
            error:
              "Google Sheets API is disabled for the configured project. Enable Sheets API in Google Cloud, wait a few minutes, then try again.",
          },
          { status: 502 }
        );
      }

      if (
        error.message.includes("Service Accounts do not have storage quota") ||
        error.message.includes("storage quota")
      ) {
        return NextResponse.json(
          {
            error:
              "This Drive folder is in a personal Google Drive. Service-account uploads cannot work there. Use GOOGLE_APPS_SCRIPT_URL for personal Google accounts, or move uploads to a Shared Drive.",
          },
          { status: 502 }
        );
      }

      if (
        error.message.includes("Requested entity was not found") ||
        error.message.includes("Unable to parse range")
      ) {
        return NextResponse.json(
          {
            error:
              "Google Sheet access failed. Share the sheet with the configured account and verify GOOGLE_SHEET_ID.",
          },
          { status: 502 }
        );
      }

      return NextResponse.json({ error: error.message }, { status: 502 });
    }

    return NextResponse.json(
      { error: "Unexpected server error. Please try again." },
      { status: 500 }
    );
  }
}
