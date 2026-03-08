const SHEET_ID = "PASTE_YOUR_GOOGLE_SHEET_ID";
const DRIVE_FOLDER_ID = "PASTE_YOUR_DRIVE_FOLDER_ID";
const HEADERS = [
  "Vorname",
  "Nachname",
  "Universitaet",
  "E-Mail",
  "CV Link",
  "Studiengang",
  "Erfahrung / Projekte",
  "Impact Story",
  "Motivation / Track",
  "Staerken",
  "Consent",
  "Referer",
  "Form ID",
  "Submitted At",
  "Request ID",
];

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || "{}");
    const values = payload.values || {};
    const context = payload.context || {};
    const cv = payload.cv || {};

    const required = [
      "fullName",
      "email",
      "university",
      "program",
      "experience",
      "impactStory",
      "motivation",
      "strengths",
    ];

    for (const field of required) {
      if (!values[field] || String(values[field]).trim() === "") {
        throw new Error("Missing field: " + field);
      }
    }

    if (!cv.base64 || !cv.name) {
      throw new Error("Missing CV payload.");
    }

    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const bytes = Utilities.base64Decode(cv.base64);
    const blob = Utilities.newBlob(
      bytes,
      cv.mimeType || "application/octet-stream",
      values.fullName + " - CV - " + Date.now() + " - " + cv.name
    );
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    ensureHeaders(sheet);
    const nameParts = String(values.fullName).trim().split(/\s+/);
    const name = nameParts.shift() || String(values.fullName).trim();
    const surname = nameParts.join(" ");
    const row = [
      name,
      surname,
      values.university,
      values.email,
      file.getUrl(),
      values.program,
      values.experience,
      values.impactStory,
      values.motivation,
      values.strengths,
      "yes",
      context.referer || "https://axion-munich.de/apply",
      "axion-next-apply",
      context.sent || new Date().toISOString(),
      context.requestId || Utilities.getUuid(),
    ];

    sheet.appendRow(row);

    return jsonResponse({
      ok: true,
      message: "Application stored successfully.",
      cvUrl: file.getUrl(),
      rowNumber: sheet.getLastRow(),
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: error && error.message ? error.message : "Unknown Apps Script error.",
    });
  }
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function ensureHeaders(sheet) {
  const firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];

  if (HEADERS.every(function(header, index) { return firstRow[index] === header; })) {
    return;
  }

  sheet.insertRowBefore(1);
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
}
