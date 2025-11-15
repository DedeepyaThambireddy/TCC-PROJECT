// backend/models/Activity.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  // Who performed the action (e.g., Admin)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // What was the action?
  action: {
    type: String,
    required: true,
    enum: ['Created', 'Deleted', 'Dispatched', 'Updated']
  },
  // What entity was affected?
  entity: {
    type: String,
    required: true,
    enum: ['Truck', 'Branch', 'Consignment', 'Dispatch']
  },
  // A human-readable message for the log
  details: {
    type: String,
    required: true
  }
}, { timestamps: true }); // We'll use the 'createdAt' as the timestamp

module.exports = mongoose.model('Activity', activitySchema);