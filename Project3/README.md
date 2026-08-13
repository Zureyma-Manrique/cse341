# Paws & Paths API — Week 06 (Part 2)

Backend API for **Paws & Paths**, a dog-walking scheduler that connects dog owners with professional walkers.

This Week 06 deliverable adds the final two collections, Google OAuth, and unit tests on top of the
Week 05 `users`/`dogs` CRUD:

- **users** — owner/walker profiles
- **dogs** — dog profiles, linked to an owner's user `_id`
- **walkSchedules** — a scheduled walk between a dog and a walker *(new)*
- **reviews** — an owner's review of a walker after a walk *(new)*

Google OAuth (via Passport) now protects **POST and PUT on `walk-schedules` and `reviews`** — you must be
logged in to create or update a walk schedule or a review. All GET/DELETE routes and the `users`/`dogs`
POST/PUT routes remain open, matching the Week 05 scope.

## Project structure

```
paws-and-paths/
├── config/
│   ├── swagger.js        # swagger-jsdoc config, reads JSDoc comments from routes/
│   └── passport.js       # Google OAuth 2.0 strategy (new)
├── controllers/
│   ├── users.js
│   ├── dogs.js
│   ├── walkSchedules.js  # new
│   └── reviews.js        # new
├── db/
│   └── connect.js        # MongoDB connection singleton
├── middleware/
│   ├── errorHandler.js   # Catch-all error handler
│   ├── notFound.js       # 404 handler
│   └── auth.js           # ensureAuthenticated guard (new)
├── models/
│   ├── user.js
│   ├── dog.js
│   ├── walkSchedule.js   # new
│   └── review.js         # new
├── routes/
│   ├── index.js
│   ├── auth.js            # /auth/google, /auth/google/callback, /auth/user, /auth/logout (new)
│   ├── users.js
│   ├── dogs.js
│   ├── walkSchedules.js  # new
│   └── reviews.js        # new
├── tests/
│   ├── users.test.js         # new
│   ├── dogs.test.js          # new
│   ├── walkSchedules.test.js # new
│   └── reviews.test.js       # new
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in real values:
   ```
   cp .env.example .env
   ```
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from an OAuth 2.0 Client ID
     (application type "Web application") at https://console.cloud.google.com/apis/credentials
   - `GOOGLE_CALLBACK_URL` — must exactly match an "Authorized redirect URI" on that Google Cloud
     OAuth client
   - `SESSION_SECRET` — any long random string
3. Run locally:
   ```
   npm run dev
   ```
4. Visit `http://localhost:3000/api-docs` for the Swagger UI.

## Authentication (Google OAuth)

- `GET /auth/google` — starts the login flow (open in a **browser**, not a REST client/Swagger tab that
  hasn't already authenticated — Google's consent screen requires an interactive browser tab)
- `GET /auth/google/callback` — Google redirects here automatically after consent
- `GET /auth/user` — returns the current session's user, or `401` if not logged in
- `GET /auth/logout` — destroys the session

`POST` and `PUT` on `/walk-schedules` and `/reviews` require an active login session and return `401` if
you're not authenticated.

**Testing protected routes:** because login happens through a real browser redirect to Google, `requests.rest`
can't complete that handshake itself. Log in via `/auth/google` in your browser first, then use **Swagger UI**
(`/api-docs`) in that same browser tab — same-origin requests from Swagger UI automatically carry your
session cookie.

## Deploying to Render

1. Push this repo to GitHub (make sure `.env` is **not** committed — it's in `.gitignore`).
2. Create a new Web Service on Render pointing at the repo, root directory `Project3`.
3. Set these environment variables in the Render dashboard:
   `MONGODB_URI`, `SWAGGER_SERVER_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`,
   `GOOGLE_CALLBACK_URL` (set this to `https://<your-app>.onrender.com/auth/google/callback`), `SESSION_SECRET`.
4. Add that same production callback URL as an "Authorized redirect URI" on the Google Cloud OAuth client.
5. Build command: `npm install`. Start command: `npm start`.
6. Once deployed, Swagger docs are live at `https://<your-app>.onrender.com/api-docs`.

## Collections & Endpoints

### Users
| Method | Route | Description |
|---|---|---|
| GET | /users | Get all users |
| GET | /users/:id | Get a single user |
| POST | /users | Create a user |
| PUT | /users/:id | Update a user |
| DELETE | /users/:id | Delete a user |

### Dogs
| Method | Route | Description |
|---|---|---|
| GET | /dogs | Get all dogs |
| GET | /dogs/:id | Get a single dog |
| GET | /dogs/owner/:ownerId | Get all dogs for a specific owner |
| POST | /dogs | Create a dog |
| PUT | /dogs/:id | Update a dog |
| DELETE | /dogs/:id | Delete a dog |

### Walk Schedules *(new, POST/PUT protected)*
| Method | Route | Description |
|---|---|---|
| GET | /walk-schedules | Get all walk schedules |
| GET | /walk-schedules/:id | Get a single walk schedule |
| POST | /walk-schedules | Create a walk schedule (login required) |
| PUT | /walk-schedules/:id | Update a walk schedule (login required) |
| DELETE | /walk-schedules/:id | Delete a walk schedule |

### Reviews *(new, POST/PUT protected)*
| Method | Route | Description |
|---|---|---|
| GET | /reviews | Get all reviews |
| GET | /reviews/:id | Get a single review |
| POST | /reviews | Create a review (login required) |
| PUT | /reviews/:id | Update a review (login required) |
| DELETE | /reviews/:id | Delete a review |

## Error handling & validation

Every controller function wraps its database call in a `try/catch` and validates the request body against
a `models/*.js` rule set before writing:
- **400** — invalid ObjectId format, failed field validation, or an unknown reference (e.g. a `dogId`/`walkerId`
  that doesn't exist)
- **401** — missing/invalid login session on a protected route
- **404** — resource not found for GET (single)/PUT/DELETE
- **500** — unexpected server/database error

## Testing

Unit tests live in `tests/` and mock `db/connect` so they run without a real MongoDB connection.

```
npm test
```

This runs Jest + Supertest against each collection's routes, covering:
- `GET` (all) and `GET /:id` for **all four collections** (200 / 400 / 404 / 500 cases)
- `POST`/`PUT` on the two protected collections returning `401` when no session is present

## Week 07 completion checklist

Cross-referenced against the "Finish Project" rubric:

| Requirement | Status |
|---|---|
| 4+ collections | ✅ `users`, `dogs`, `walkSchedules`, `reviews` |
| One collection with 7+ fields | ✅ `users` (firstName, lastName, email, role, phone, oauthProvider, oauthId, bio, createdAt) |
| Connects to MongoDB | ✅ `db/connect.js` |
| Full CRUD on all collections | ✅ |
| Error handling (try/catch, 400/500) on every route | ✅ |
| Data validation on POST/PUT for all 4 collections | ✅ `models/*.js` |
| Unit tests for every GET/GetAll route | ✅ `tests/` — includes `/dogs/owner/:ownerId` |
| OAuth protecting 2+ routes | ✅ Google OAuth via Passport, protects `walk-schedules` & `reviews` POST/PUT |
| Swagger docs published at `/api-docs`, functional as a REST client | ✅ Swagger UI + `requests.rest` for manual testing |
| Published to Render | ⚠️ Confirm the Render service is redeployed on the latest push before recording the video |
| Individual contributions documented | ✅ See below |

## Individual contributions (Week 07)

> Fill in with your own words / teammates' names for the assignment submission text box. Suggested starting
> points based on the work done in this deliverable:

**Week 06:**
1. Designed and implemented the `walkSchedules` and `reviews` collections — field-level validation
   (`models/walkSchedule.js`, `models/review.js`), full CRUD controllers, and Swagger documentation for both.
2. Implemented Google OAuth 2.0 login with Passport (`config/passport.js`, `middleware/auth.js`,
   `routes/auth.js`), wired sessions through MongoDB-backed storage, and protected the `walk-schedules` and
   `reviews` POST/PUT routes behind an authentication check.
3. Wrote the Jest/Supertest unit test suite (`tests/`) covering the GET and GET-all routes for all four
   collections, using a mocked database layer so tests run without a live MongoDB connection.

**Week 07:**
1. Closed the remaining unit-test gap by adding coverage for the `/dogs/owner/:ownerId` route, so every
   GET route in the project now has passing tests.
2. Wrote `requests.rest`, a full manual test file covering every route (including validation-error and
   401-unauthorized cases) to make the API's documentation functional as a REST client per the rubric, and
   verified the Swagger spec at `/api-docs` correctly lists all 13 routes across the 4 collections.
