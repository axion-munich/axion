# Google Apps Script setup

Use this mode when the CV folder is inside a personal Google Drive account. This avoids the service-account storage quota limitation.

## Steps

1. Open [script.new](https://script.new).
2. Replace the default file contents with the code from [Code.gs](/Users/shohzodsobirov/Desktop/axion-codex/docs/google-apps-script/Code.gs).
3. Replace `SHEET_ID` and `DRIVE_FOLDER_ID` at the top of the script.
4. Click `Deploy` -> `New deployment`.
5. For type, choose `Web app`.
6. Set:
   - `Execute as`: `Me`
   - `Who has access`: `Anyone`
7. Click `Deploy`.
8. Authorize the script when Google asks.
9. Copy the `Web app URL`.
10. Add it to your env:
    - `GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec`
11. Restart `npm run dev`.
12. Submit a test application.

## What it does

- uploads the CV into your Drive folder
- sets the file to `Anyone with the link -> Viewer`
- appends one row to the first tab in your Google Sheet
- writes the Drive file link into the `cv` column
- ensures a header row exists at the top of the sheet

## Notes

- This runs as your Google account, not as the service account.
- Keep the web app URL private.
- If you redeploy the script, update `GOOGLE_APPS_SCRIPT_URL` if Google gives you a new URL.
- After changing the script code, create a new deployment version or update the existing deployment so the live web app uses the latest code.
