/**
 * Dog document shape (MongoDB collection: "dogs")
 * {
 *   name: String,               // required
 *   breed: String,              // required
 *   age: Number,                // required
 *   size: String,                // required, "small" | "medium" | "large"
 *   ownerId: String,            // required, references users._id
 *   specialInstructions: String, // optional
 *   createdAt: Date
 * }
 */

const REQUIRED_FIELDS = ['name', 'breed', 'age', 'size', 'ownerId'];
const VALID_SIZES = ['small', 'medium', 'large'];

// Returns an array of validation error strings. Empty array = valid.
function validateDog(body, { partial = false } = {}) {
  const errors = [];

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

  if (body.age !== undefined && (isNaN(Number(body.age)) || Number(body.age) < 0)) {
    errors.push('"age" must be a non-negative number.');
  }

  if (body.size !== undefined && !VALID_SIZES.includes(body.size)) {
    errors.push(`"size" must be one of: ${VALID_SIZES.join(', ')}.`);
  }

  return errors;
}

module.exports = { validateDog, REQUIRED_FIELDS, VALID_SIZES };
