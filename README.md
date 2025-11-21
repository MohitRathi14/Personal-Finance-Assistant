# Personal Finance Assistant

This repository contains a Personal Finance Assistant application with two folders:

- `backend/` — Express + MongoDB API server handling users, transactions, receipts, Cloudinary uploads, and OCR.
- `frontend/` — Vite + React frontend (single-page app).

## Quick start

1. Copy environment variables (see `.env.example`) and fill in secrets.
2. Start backend:

```bash
cd backend
npm install
# Start your backend (this project uses plain node; adjust as needed)
node index.js
```

3. Start frontend:

```bash
cd frontend
npm install
npm run dev
```

## Important files

- `backend/` — server source, routes, models, controllers.
- `frontend/` — React app in `src/`.
- `.env.example` — example environment variables (do not commit real secrets).

## Environment
Required environment variables (see `.env.example`):

- `MONGODB_URI` — MongoDB connection string
- `PORT` — backend port
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — Cloudinary credentials
- `JWT_SECRET` — JWT signing secret
- `EMAIL_USER`, `EMAIL_PASS` — SMTP credentials for nodemailer

## Tests & CI
This repo includes a basic GitHub Actions workflow for the backend. Adjust or expand CI as needed.

## Contributing
See `CONTRIBUTING.md` for guidelines.

## License
This project is released under the MIT License. See `LICENSE`.
