# axion Munich

Website for [axion Munich](https://axion-munich.de) — a student consulting initiative at TU Munich.

Built with Next.js and Tailwind CSS.

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
│   ├── apply/          # Application form
│   ├── blog/           # Blog listing + posts
│   ├── imprint/        # Legal imprint
│   ├── privacy/        # Privacy policy
│   └── terms/          # Terms of service
├── components/         # UI and feature components
└── data/               # Site content and blog posts
```

## Environment Variables

Copy `.env.example` to `.env` and fill in the values. See `.env.example` for the full list.
