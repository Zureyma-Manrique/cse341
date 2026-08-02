# Calendar Agent API

An automated Calendar Agent API built with Node.js, Express, and the native
MongoDB driver. It uses Gemini 2.5 Flash (`@google/genai`) to turn a natural-language
prompt into structured agile user stories, which are saved as `"pending"` for
human review before being approved and (eventually) synced to a calendar.

## Directory Structure

```
calendar-agent-api/
├── controllers/
│   ├── userStoryController.js   # AI generation + CRUD for userStories
│   └── projectController.js     # CRUD for projects
├── db/
│   └── connect.js               # Singleton MongoDB connection
├── docs/
│   ├── swagger.js               # swagger-autogen generation script
│   └── swagger-output.json      # Generated Swagger spec (served at /api-docs)
├── middleware/
│   └── validators.js            # express-validator rule sets
├── models/
│   ├── userStory.js             # userStories document shape + defaults
│   └── project.js                # projects document shape + defaults
├── routes/
│   ├── index.js                 # Mounts /api-docs, /userStories, /projects
│   ├── userStoryRoutes.js
│   └── projectRoutes.js
├── services/
│   └── aiService.js             # Gemini client + structured-output schema
├── .env.example
├── .gitignore
├── package.json
├── server.js                    # Entry point
└── requests.rest                # REST Client test file
```

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in real values:
   - `PORT` — e.g. `3000`
   - `MONGODB_URI` — your Atlas (or local) connection string
   - `GEMINI_API_KEY` — from https://ai.google.dev
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from https://console.cloud.google.com/apis/credentials
     (create an OAuth 2.0 Client ID, application type "Web application")
   - `GOOGLE_CALLBACK_URL` — must exactly match an "Authorized redirect URI" on that
     Google Cloud OAuth client, e.g. `http://localhost:3000/auth/google/callback`
     locally, or `https://your-app.onrender.com/auth/google/callback` in production
   - `SESSION_SECRET` — any long random string
3. Generate the Swagger docs: `npm run swagger`
4. Start the server: `npm start` (or `npm run dev` with nodemon)
5. Visit `http://localhost:3000/api-docs` for the interactive Swagger UI.

## Authentication (Google OAuth)

- `GET /auth/google` — starts the login flow (open in a **browser**, not a REST client — Google's consent screen requires an interactive browser tab)
- `GET /auth/google/callback` — Google redirects here automatically after consent
- `GET /auth/user` — returns the current session's user, or `401` if not logged in
- `GET /auth/logout` — destroys the session

All `/userStories/*` and `/projects/*` routes require an active login session and
return `401` if you're not authenticated.

**Testing protected routes:** because login happens through a real browser redirect
to Google, the `requests.rest` file can't complete that handshake itself. The
practical flow is: log in via `/auth/google` in your browser first, then use
**Swagger UI** (`/api-docs`) in that same browser tab to test the protected routes —
same-origin requests from Swagger UI automatically carry your session cookie.

## Collections

- **userStories**: `title`, `description`, `promptSource`, `status`,
  `estimatedHours`, `scheduledDate`, `googleEventId`, `isSynced`,
  `projectName`, `createdAt`.
- **projects**: `projectName`, `context`, `createdAt`.

## Routes

| Method | Route                     | Description                                   |
|--------|---------------------------|------------------------------------------------|
| POST   | `/userStories/generate`   | AI-generate stories from a `prompt`, save as pending |
| GET    | `/userStories`            | Get all stories with status `pending`          |
| GET    | `/userStories/:id`        | Get one story by id                             |
| PUT    | `/userStories/:id`        | Update status/fields (e.g., approve)            |
| DELETE | `/userStories/:id`        | Delete a story                                  |
| POST   | `/projects`               | Create a project                                |
| GET    | `/projects`               | List all projects                               |
| GET    | `/projects/:id`           | Get one project by id                           |
| DELETE | `/projects/:id`           | Delete a project                                |

## Notes

- Re-run `npm run swagger` any time routes change, then restart the server.
- On Render, set the same three env vars in the dashboard (never commit `.env`).
- `swagger-output.json` ships with an empty placeholder so the server boots
  even before you've generated real docs; regenerate before your final push.
