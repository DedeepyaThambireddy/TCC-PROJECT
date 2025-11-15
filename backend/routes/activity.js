// backend/routes/activity.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Activity = require('../models/Activity');

// @route   GET /api/activity
// @desc    Get all recent activity
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Get the most recent 5 activities, populate the user's name
    const activities = await Activity.find()
      .sort({ createdAt: -1 }) // Newest first
      .limit(5) // Only get 5
      .populate('user', 'name'); // Get the name of the user who did the action

    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;