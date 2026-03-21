# Cloud Cost Analysis & Optimization Platform

A production-ready **Next.js App Router** demo that helps users upload cloud billing data (AWS, Azure, GCP), analyze spend trends, export summary reports, and generate AI-assisted optimization guidance.

## Features

- Dark premium SaaS UI with sidebar navigation
- Dashboard with KPI cards and Recharts visualizations
- CSV upload using Papa Parse
- MongoDB persistence with automatic in-memory fallback for demo reliability
- Cost analysis with date and service filters
- Reports module with PDF export
- Rule-based optimization recommendations
- GenAI cost optimization via OpenAI with Gemini fallback
- Sample dataset preload and reset button

## Project Structure

```text
app/
components/
lib/
models/
public/
```

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | Optional MongoDB connection string |
| `OPENAI_API_KEY` | Optional OpenAI API key |
| `OPENAI_MODEL` | Optional OpenAI model override |
| `GEMINI_API_KEY` | Optional Gemini API key fallback |
| `GEMINI_MODEL` | Optional Gemini model override |
| `NEXT_PUBLIC_APP_NAME` | Optional app title |

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deployment on Vercel

1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Add environment variables from `.env.example`.
4. Deploy.

Vercel automatically detects the Next.js app and uses the correct build command.

## CSV Format

Required columns:

- `date`
- `service_name`
- `cost`
- `region` (optional)

## Notes

- Authentication is intentionally omitted for demo purposes.
- If MongoDB is unavailable, the app continues using in-memory data storage.
- If no AI API key is provided, the GenAI page returns high-quality fallback insights.
