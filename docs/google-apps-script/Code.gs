const SHEET_ID = "PASTE_YOUR_GOOGLE_SHEET_ID";
const DRIVE_FOLDER_ID = "PASTE_YOUR_DRIVE_FOLDER_ID";
const HEADERS = [
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
];

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents || "{}");

    return handleApplication(payload);
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: error && error.message ? error.message : "Unknown Apps Script error.",
    });
  }
}

function handleApplication(payload) {
  var values = payload.values || {};
  var context = payload.context || {};
  var cv = payload.cv || {};

  var required = [
    "fullName",
    "email",
    "university",
    "program",
    "motivation",
    "leadership",
    "businessIdea",
  ];

  for (var i = 0; i < required.length; i++) {
    var field = required[i];
    if (!values[field] || String(values[field]).trim() === "") {
      throw new Error("Missing field: " + field);
    }
  }

  if (!cv.base64 || !cv.name) {
    throw new Error("Missing CV payload.");
  }

  var folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  var bytes = Utilities.base64Decode(cv.base64);
  var blob = Utilities.newBlob(
    bytes,
    cv.mimeType || "application/octet-stream",
    values.fullName + " - CV - " + Date.now() + " - " + cv.name
  );
  var file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  ensureHeaders(sheet);
  var nameParts = String(values.fullName).trim().split(/\s+/);
  var name = nameParts.shift() || String(values.fullName).trim();
  var surname = nameParts.join(" ");
  var row = [
    name,
    surname,
    values.university,
    values.email,
    file.getUrl(),
    values.program,
    values.motivation,
    values.leadership,
    values.businessIdea,
    "yes",
    context.sent || new Date().toISOString(),
  ];

  sheet.appendRow(row);

  return jsonResponse({
    ok: true,
    message: "Application stored successfully.",
    cvUrl: file.getUrl(),
    rowNumber: sheet.getLastRow(),
  });
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
