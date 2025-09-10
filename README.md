## Calendar Statistics App

A lightweight productivity dashboard that connects to your Google Calendar, pulls events for a time range (default last 30 days), and shows simple statistics and charts.

### Tech Stack
- Frontend: React (Vite) + TailwindCSS + Ant Design + @ant-design/plots
- Backend: Node.js + Express.js
- Auth: Google OAuth 2.0
- Data: Google Calendar API
- Recommended deployment: Frontend on Vercel, Backend on Render/Heroku/Fly.io. Full-stack option possible on Railway/Fly.io.

### Monorepo Structure
```
.
├── backend/               # Express API (OAuth, events, stats)
├── frontend/              # Vite React app
├── .gitignore
├── package.json           # root scripts (run both)
└── README.md
```

### Prerequisites
- Node.js 18+
- A Google Cloud project with OAuth 2.0 credentials (Web application)

### Google Cloud Console Setup
1. Go to Google Cloud Console → APIs & Services → Credentials → Create Credentials → OAuth client ID.
2. Application type: Web application.
3. Authorized redirect URI:
   - Local: `http://localhost:5001/auth/google/callback`
4. Save the Client ID and Client Secret.
5. Enable the Google Calendar API in APIs & Services → Library.

### Environment Variables

Backend (`backend/.env`):
```
PORT=5001
NODE_ENV=development

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
OAUTH_REDIRECT_URI=http://localhost:5001/auth/google/callback

# JWT
JWT_SECRET=super-secret-jwt-key-change-me
COOKIE_NAME=calstats_token

# CORS
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5001
```

Frontend (`frontend/.env`):
```
VITE_BACKEND_URL=http://localhost:5001
```

### Install & Run (Local)
From the repo root:
```
npm install
npm start
```
This launches:
- Backend on `http://localhost:5001`
- Frontend on `http://localhost:5173`

Visit `http://localhost:5173` → click "Sign in with Google" → approve → redirected to Dashboard.

### Features
- Google Sign-In (OAuth 2.0) using `offline` access with refresh token stored inside a signed HTTP-only cookie (JWT).
- Pulls events from your primary calendar for a configurable period (default 30 days).
- Stats: total events, average meeting length, with guests vs solo, busiest day, % events with guests.
- Charts: Column (events per day), Pie (solo vs group).

### Security & Trade-offs
- Session strategy: a signed JWT HTTP-only cookie stores minimal profile fields and the refresh token. For a production app, consider storing refresh tokens encrypted server-side or in a DB rather than inside the cookie. This example prioritizes simplicity.
- CORS: configured to allow the frontend origin with `credentials: true`.
- API quota: The Calendar API is rate-limited; batch your requests if you expand the app.

### Deployment

Frontend (Vercel):
1. Import the `frontend/` directory as a Vercel project.
2. Set Environment Variable: `VITE_BACKEND_URL` to your deployed backend URL (e.g., `https://your-api.onrender.com`).
3. Build command: `npm run build`; Output directory: `dist`.

Backend (Render/Heroku):
1. Create a new Web Service with the `backend/` directory.
2. Node version: 18+.
3. Set environment variables from the backend `.env.example`.
4. Start command: `npm start` (listens on `PORT`).
5. Update your Google Cloud OAuth redirect URI to your backend URL, e.g., `https://your-api.onrender.com/auth/google/callback`.

Full-stack option (Railway/Fly.io):
- Deploy backend as a service with envs above; deploy frontend separately pointing to the backend URL.

### Project Scripts
- Root
  - `npm start` – Run backend and frontend concurrently in dev
- Backend
  - `npm run dev` – Nodemon server
  - `npm start` – Node server
- Frontend
  - `npm run dev` / `npm start` – Vite dev server
  - `npm run build` – Build for production

### Notes
- If Google doesn't return a refresh token after first consent, revoke app access from your Google Account → Security → Third-party apps, then try again.
- For production, set `NODE_ENV=production`, use secure cookies, and configure `sameSite: 'none'` with HTTPS origins.

### License
MIT


