# Pravaah frontend

React + Vite client for the [Pravaah backend](https://github.com/kritharth2005/Pravah). It has two portals: Citizen (plain-language summaries and advice) and Legal Professional (technical analysis).

```sh
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

The backend is expected at `http://127.0.0.1:8000`. To point elsewhere, copy `.env.example` to `.env.local` and set `VITE_API_BASE_URL`.

| Path | Purpose |
|------|---------|
| `src/services/api.js` | The only module that talks to the backend |
| `src/components/DocumentUpload.jsx` | Upload/paste form, shared by both portals |
| `src/components/SummaryView.jsx`, `lawyer/LawyerSummaryView.jsx` | Result views (Markdown, audio, notices, metrics) |
| `src/components/SummaryActions.jsx` | Copy and print, shared by both views |

Uploads accept PDF, PNG, JPG (sent to the backend for extraction/OCR) and TXT (read in the browser), up to 10 MB.
