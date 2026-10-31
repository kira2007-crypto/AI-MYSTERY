# AI Mystery Room

This project implements a MERN-style mystery investigation app following the requirements in [specGem.md](specGem.md).

## Features
- Scenario-driven mystery case generation
- Suspect roster with motives and alibis
- Evidence board with WhatsApp, CCTV, and image clues
- Accusation desk with suspect and evidence selection
- Verdict and debriefing screen
- Backend API with in-memory persistence for demo purposes

## Run locally

```bash
npm install
npm run dev
```

The app will start:
- API: http://localhost:5001
- Frontend: http://localhost:5173 (or the next available Vite port)

## Deploy to production

### Option A: Deploy the full app as one Node service (recommended for quick setup)

This app is already set up to serve the built frontend from the same Node server in production.

1. Create a production environment file from the example:
   ```bash
   cp .env.example .env
   ```
2. Update the values for your environment:
   - `NODE_ENV=production`
   - `PORT=10000` or your host default
   - `MONGODB_URI` if you want persistent storage
   - `CLIENT_ORIGIN` to include your deployed frontend URL
   - `VITE_API_BASE_URL` to your deployed backend URL, for example `https://your-app.onrender.com/api`
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the frontend:
   ```bash
   npm run build
   ```
5. Start the app:
   ```bash
   npm start
   ```

### Option B: Deploy to Render

1. Push this repo to GitHub.
2. Sign in to Render and create a new Web Service.
3. Connect the repo.
4. Use these settings:
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Node version: `20`
5. Add environment variables in Render settings:
   - `NODE_ENV=production`
   - `PORT=10000`
   - `CLIENT_ORIGIN=https://your-frontend-url.com`
   - `MONGODB_URI=your_mongodb_uri`
   - `VITE_API_BASE_URL=https://your-render-url.onrender.com/api`
6. Deploy.

### Option C: Deploy frontend and backend separately

- Frontend: Vercel or Netlify
- Backend: Render or Railway
- Set `VITE_API_BASE_URL` on the frontend to the deployed backend URL
- On the backend, set `CLIENT_ORIGIN` to the frontend URL

## Notes
- MongoDB is optional for the demo; if `MONGODB_URI` is not provided, the app uses an in-memory store.
- The generated case logic follows the specification but is implemented as a deterministic simulator so it works without an external Gemini key in local development.
- In production, the Express server serves the built static frontend from the `dist` folder.
