# Contacts API — CSE 341

A REST API for storing and retrieving contacts, backed by MongoDB, documented with Swagger.

## Fields per contact
`firstName`, `lastName`, `email`, `favoriteColor`, `birthday`

## Routes
| Method | Route            | Description                     |
|--------|------------------|----------------------------------|
| GET    | `/contacts`      | Get all contacts                |
| GET    | `/contacts/:id`  | Get a single contact by id       |
| POST   | `/contacts`      | Create a new contact             |
| PUT    | `/contacts/:id`  | Update an existing contact       |
| DELETE | `/contacts/:id`  | Delete a contact                 |
| GET    | `/api-docs`      | Interactive Swagger UI           |

## Local setup

1. Install dependencies:
   ```
   npm install
   ```
2. Confirm your `.env` file has:
   ```
   PORT=8080
   MONGODB_URI=<your MongoDB Atlas connection string>
   DB_NAME=contactsDB
   ```
   ⚠️ **Rotate the password on this connection string in MongoDB Atlas** if it was ever shared outside your own machine (Database Access → Edit user → Edit password).

3. In MongoDB Atlas → Network Access, make sure your current IP (and, once deployed, `0.0.0.0/0` or Render's IPs) is allowed to connect.

4. (Optional) Seed the database with 3 sample contacts:
   ```
   node seed.js
   ```

5. Generate the Swagger docs and start the server together:
   ```
   npm run swagger
   ```
   Or just start the server (if `swagger-output.json` already exists):
   ```
   npm start
   ```

6. Visit `http://localhost:8080/api-docs` to see the interactive Swagger UI, and test each route with "Try it out."

## Testing with the REST Client

Open `test.rest` in VS Code (with the [REST Client extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)) and click "Send Request" above each request. Replace `REPLACE_WITH_REAL_ID` with a real `_id` from the GET all response.

## Deploying to Render

1. Push this project to GitHub (`.env` is gitignored — it will NOT be pushed, which is correct).
2. Create a new Web Service on Render, connected to your GitHub repo.
3. In Render's **Environment** tab, add the same variables from your `.env`:
   - `MONGODB_URI`
   - `DB_NAME`
   - (Render sets `PORT` itself, but the fallback in `server.js` handles this either way)
4. In MongoDB Atlas → Network Access, add `0.0.0.0/0` (allow from anywhere) so Render can connect — Atlas's free tier doesn't support static IP allowlisting for Render otherwise.
5. Once deployed, update `swagger.js`'s `host` value (or set a `RENDER_HOST` env var) to your Render URL, then re-run `npm run swagger` and push again so the Swagger docs reflect the live URL.
6. Confirm `https://your-app.onrender.com/api-docs` loads and each route works against the **published** URL (not localhost) before recording your demo video.

## Notes on the rubric
- POST returns the new contact's `_id` in the response body.
- PUT and DELETE return HTTP status codes (`204` and `200`/`404`) rather than a body, per the assignment.
- All fields are required on POST and PUT; missing fields return a `400`.
