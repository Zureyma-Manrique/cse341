/**
 * Review document shape (MongoDB collection: "reviews")
 * {
 *   walkScheduleId: String, // required, references walkSchedules._id
 *   reviewerId: String,     // required, references users._id (the owner writing it)
 *   walkerId: String,       // required, references users._id (the walker being reviewed)
 *   rating: Number,         // required, integer 1-5
 *   comment: String,        // optional
 *   createdAt: Date
 * }
 */

const REQUIRED_FIELDS = ['walkScheduleId', 'reviewerId', 'walkerId', 'rating'];

// Returns an array of validation error strings. Empty array = valid.
function validateReview(body, { partial = false } = {}) {
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

  if (body.rating !== undefined) {
    const rating = Number(body.rating);
    if (isNaN(rating) || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      errors.push('"rating" must be an integer between 1 and 5.');
    }
  }

  if (body.comment !== undefined && String(body.comment).length > 1000) {
    errors.push('"comment" must be 1000 characters or fewer.');
  }

  return errors;
}

module.exports = { validateReview, REQUIRED_FIELDS };
