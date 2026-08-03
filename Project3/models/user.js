/**
 * User document shape (MongoDB collection: "users")
 * {
 *   firstName: String,      // required
 *   lastName: String,       // required
 *   email: String,          // required, unique
 *   role: String,           // required, "owner" | "walker"
 *   phone: String,          // required
 *   oauthProvider: String,  // optional, e.g. "google" | "github"
 *   oauthId: String,        // optional
 *   bio: String,            // optional
 *   createdAt: Date
 * }
 */

const REQUIRED_FIELDS = ['firstName', 'lastName', 'email', 'role', 'phone'];
const VALID_ROLES = ['owner', 'walker'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Returns an array of validation error strings. Empty array = valid.
function validateUser(body, { partial = false } = {}) {
  const errors = [];
  const fieldsToCheck = partial
    ? REQUIRED_FIELDS.filter((f) => Object.prototype.hasOwnProperty.call(body, f))
    : REQUIRED_FIELDS;

  if (!partial) {
    REQUIRED_FIELDS.forEach((field) => {
      if (
        body[field] === undefined ||
        body[field] === null ||
        String(body[field]).trim() === ''
      ) {
        errors.push(`"${field}" is required.`);
      }
    });
  }

  if (body.email !== undefined && !EMAIL_REGEX.test(body.email)) {
    errors.push('"email" must be a valid email address.');
  }

  if (body.role !== undefined && !VALID_ROLES.includes(body.role)) {
    errors.push(`"role" must be one of: ${VALID_ROLES.join(', ')}.`);
  }

  return errors;
}

module.exports = { validateUser, REQUIRED_FIELDS, VALID_ROLES };
