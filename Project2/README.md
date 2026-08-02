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
3. Generate the Swagger docs: `npm run swagger`
4. Start the server: `npm start` (or `npm run dev` with nodemon)
5. Visit `http://localhost:3000/api-docs` for the interactive Swagger UI.

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
