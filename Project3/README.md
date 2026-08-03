# Paws & Paths API — Week 05 (Part 1)

Backend API for **Paws & Paths**, a dog-walking scheduler that connects dog owners with professional walkers.

This Week 05 deliverable implements full CRUD + validation + error handling for the first two of the four planned collections:

- **users** — owner/walker profiles
- **dogs** — dog profiles, linked to an owner's user `_id`

The remaining two collections (`walk-schedules`, `reviews`) and OAuth are planned for Week 06 per the project proposal.

## Project structure

```
paws-and-paths/
├── config/
│   └── swagger.js        # swagger-jsdoc config, reads JSDoc comments from routes/
├── controllers/
│   ├── users.js          # CRUD logic for the users collection
│   └── dogs.js           # CRUD logic for the dogs collection
├── db/
│   └── connect.js         # MongoDB connection singleton
├── middleware/
│   ├── errorHandler.js   # Catch-all error handler
│   └── notFound.js       # 404 handler
├── models/
│   ├── user.js            # User field validation
│   └── dog.js              # Dog field validation
├── routes/
│   ├── index.js
│   ├── users.js
│   └── dogs.js
├── .env.example
├── package.json
└── server.js
```

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your MongoDB Atlas connection string:
   ```
   cp .env.example .env
   ```
3. Run locally:
   ```
   npm run dev
   ```
4. Visit `http://localhost:3000/api-docs` for the Swagger UI.

## Deploying to Render

1. Push this repo to GitHub (make sure `.env` is **not** committed — it's already in `.gitignore`).
2. Create a new Web Service on Render pointing at the repo.
3. Set the following environment variables in the Render dashboard:
   - `MONGODB_URI`
   - `SWAGGER_SERVER_URL` → your Render URL, e.g. `https://paws-and-paths.onrender.com`
4. Build command: `npm install`. Start command: `npm start`.
5. Once deployed, Swagger docs will be live at `https://<your-app>.onrender.com/api-docs`.

## Endpoints implemented

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

## Error handling

Every controller function wraps its database call in a `try/catch`:
- **400** — invalid ObjectId format, or failed field validation (see `models/user.js` / `models/dog.js`)
- **404** — resource not found for GET (single)/PUT/DELETE
- **500** — unexpected server/database error

## Individual contributions (Week 05)

> Fill in with your own words for the assignment submission text box. Suggested starting points based on the work done in this deliverable:

1. Designed and implemented the `users` and `dogs` MongoDB collections, including field-level validation modules (`models/user.js`, `models/dog.js`) and full CRUD controllers with try/catch error handling returning appropriate 400/404/500 status codes.
2. Set up the Express project's MVC folder structure (`routes/`, `controllers/`, `models/`, `middleware/`, `db/`, `config/`), configured the MongoDB Atlas connection singleton, and built out the Swagger/OpenAPI documentation (via `swagger-jsdoc` + `swagger-ui-express`) published at `/api-docs`.
