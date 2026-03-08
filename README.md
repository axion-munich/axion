# axion Munich Website

Next.js rebuild of the axion Munich landing page and student application flow.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Application storage

Student applications are stored in:

- Google Sheets for answers
- Google Drive for CV files

The backend route is [route.ts](/Users/shohzodsobirov/Desktop/axion-codex/src/app/api/apply/route.ts).

## Storage modes

### Recommended for personal Google accounts

Use `GOOGLE_APPS_SCRIPT_URL`.

Reason: service accounts cannot upload files into a normal personal Google Drive folder because they do not have their own Drive storage quota. Apps Script runs as your Google account, so it can create the file in your Drive folder and append the row to your sheet.

Setup guide:
- [Apps Script guide](/Users/shohzodsobirov/Desktop/axion-codex/docs/google-apps-script/README.md)
- [Apps Script code](/Users/shohzodsobirov/Desktop/axion-codex/docs/google-apps-script/Code.gs)

### Only for Google Workspace / Shared Drive setups

Use:
- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SHEET_ID`
- `GOOGLE_DRIVE_FOLDER_ID`

This mode is valid when uploads go into a Shared Drive or another setup where the service account can create files.

## Required environment variables

Create `.env` or `.env.local` using [.env.example](/Users/shohzodsobirov/Desktop/axion-codex/.env.example).

### Admin

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

### Apps Script mode

- `GOOGLE_APPS_SCRIPT_URL`

### Service account mode

- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SHEET_ID`
- `GOOGLE_DRIVE_FOLDER_ID`

If `GOOGLE_APPS_SCRIPT_URL` is set, the app uses Apps Script first.

## Row mapping

Each submission appends one row in this shape:

`name, surname, university, email, cv, question_1, question_2, question_3, question_4, question_5, Checkbox, referer, formid, sent, requestid`

Current mapping:

- `name` -> first word from full name
- `surname` -> remaining words from full name
- `university` -> university
- `email` -> email
- `cv` -> Google Drive file link
- `question_1` -> study program / degree
- `question_2` -> previous internships / work / projects
- `question_3` -> achievement / impact story
- `question_4` -> motivation + preferred track
- `question_5` -> strengths / perspective brought to axion
- `Checkbox` -> `yes`
- `referer` -> request referer
- `formid` -> `axion-next-apply`
- `sent` -> Europe/Berlin timestamp
- `requestid` -> generated UUID

Headers are added automatically on the first row if they are missing:

`Vorname, Nachname, Universitaet, E-Mail, CV Link, Studiengang, Erfahrung / Projekte, Impact Story, Motivation / Track, Staerken, Consent, Referer, Form ID, Submitted At, Request ID`

## Notes

- Max CV size is 5MB.
- Accepted file types: PDF, DOC, DOCX.
- In Apps Script mode, the script sets the uploaded CV to `Anyone with the link -> Viewer` so the sheet stores a usable URL.
- If you change [docs/google-apps-script/Code.gs](/Users/shohzodsobirov/Desktop/axion-codex/docs/google-apps-script/Code.gs), update the Apps Script project and redeploy the web app so the live script uses the latest version.
- `/admin` uses a file-backed store at `content/site-cms.json`. This is suitable for a persistent server or VPS. It will not persist reliably on ephemeral serverless filesystems.
