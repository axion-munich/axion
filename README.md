# axion Munich

Website and application portal for [axion Munich](https://axion-munich.de) — a student consulting initiative at TU Munich.

Built with Next.js, Tailwind CSS, and Google Sheets as a backend for applications.

## Getting Started

```bash
cp .env.example .env    # fill in your values
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── admin/          # Admin dashboard
│   ├── api/            # API routes (apply, admin)
│   ├── apply/          # Application form
│   ├── blog/           # Blog listing + posts (SEO)
│   ├── imprint/        # Legal imprint
│   ├── privacy/        # Privacy policy
│   └── terms/          # Terms of service
├── components/         # UI and feature components
└── data/               # Site content and blog posts
```

## Environment Variables

Copy `.env.example` to `.env` and fill in the values.

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_APPS_SCRIPT_URL` | Yes* | Apps Script web app URL |
| `GOOGLE_CLIENT_EMAIL` | Alt* | Service account email |
| `GOOGLE_PRIVATE_KEY` | Alt* | Service account private key |
| `GOOGLE_SHEET_ID` | Alt* | Google Sheet ID for applications |
| `GOOGLE_DRIVE_FOLDER_ID` | Alt* | Drive folder for CV uploads |

*Two storage modes — use one:

- **Apps Script mode** (recommended): Set `GOOGLE_APPS_SCRIPT_URL`. Works with personal Google accounts. See [setup guide](docs/google-apps-script/README.md).
- **Service account mode**: Set the `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`, and `GOOGLE_DRIVE_FOLDER_ID` variables. Only works with Google Workspace / Shared Drive.

If both are set, Apps Script mode takes priority.

## Application Flow

Student applications are submitted through `/apply` and stored in:

- **Google Sheets** — form answers
- **Google Drive** — CV files (PDF/DOC/DOCX, max 5 MB)

Each submission appends one row with: name, surname, university, email, CV link, study program, motivation, leadership, business idea, consent, and timestamp.

## Notes

- Blog posts live in `src/data/blog-posts.ts` and are statically generated at build time
- The Apps Script code is in `docs/google-apps-script/Code.gs` — if you modify it, redeploy the web app in Apps Script
