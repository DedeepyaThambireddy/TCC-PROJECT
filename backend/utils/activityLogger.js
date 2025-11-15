// backend/utils/activityLogger.js
const Activity = require('../models/Activity');

/**
 * Creates a new activity log entry.
 * @param {object} user - The user object from req.user (can be null for system)
 * @param {string} action - e.g., 'Created', 'Deleted', 'Dispatched'
 * @param {string} entity - e.g., 'Truck', 'Branch', 'Consignment'
 * @param {string} details - The human-readable log message
 */
const createActivityLog = async (user, action, entity, details) => {
  try {
    await Activity.create({
      user: user ? user._id : null,
      action,
      entity,
      details
    });
  } catch (error) {
    console.error('Failed to create activity log:', error);
  }
};

module.exports = createActivityLog;