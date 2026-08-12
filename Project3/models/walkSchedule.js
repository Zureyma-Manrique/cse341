/**
 * WalkSchedule document shape (MongoDB collection: "walkSchedules")
 * {
 *   dogId: String,          // required, references dogs._id
 *   walkerId: String,       // required, references users._id (a "walker")
 *   scheduledDate: Date,    // required, ISO date string
 *   duration: Number,       // required, minutes, > 0
 *   status: String,         // required, "requested" | "confirmed" | "completed" | "cancelled"
 *   notes: String,          // optional
 *   createdAt: Date
 * }
 */

const REQUIRED_FIELDS = ['dogId', 'walkerId', 'scheduledDate', 'duration', 'status'];
const VALID_STATUSES = ['requested', 'confirmed', 'completed', 'cancelled'];

// Returns an array of validation error strings. Empty array = valid.
function validateWalkSchedule(body, { partial = false } = {}) {
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

  if (body.scheduledDate !== undefined && isNaN(Date.parse(body.scheduledDate))) {
    errors.push('"scheduledDate" must be a valid date.');
  }

  if (
    body.duration !== undefined &&
    (isNaN(Number(body.duration)) || Number(body.duration) <= 0)
  ) {
    errors.push('"duration" must be a positive number (minutes).');
  }

  if (body.status !== undefined && !VALID_STATUSES.includes(body.status)) {
    errors.push(`"status" must be one of: ${VALID_STATUSES.join(', ')}.`);
  }

  return errors;
}

module.exports = { validateWalkSchedule, REQUIRED_FIELDS, VALID_STATUSES };
