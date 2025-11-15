// backend/routes/dispatch.js
const express = require('express');
const router = express.Router();
const Dispatch = require('../models/Dispatch');
const Consignment = require('../models/Consignment');
const Truck = require('../models/Truck');
const { protect, authorize } = require('../middleware/auth');
const createActivityLog = require('../utils/activityLogger');

// @route   GET /api/dispatch
// @desc    Get all dispatches
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const dispatches = await Dispatch.find()
      .populate('truck', 'truckNumber')
      .populate('origin', 'name')
      .populate('destination', 'name')
      .populate('consignments', 'consignmentNumber senderName receiverName volume')
      .sort({ createdAt: -1 });
      
    res.status(200).json({ success: true, count: dispatches.length, data: dispatches });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// --- NEW CODE ---
// @route   PUT /api/dispatch/:id/complete
// @desc    Mark a dispatch as completed
// @access  Private (Admin only)
router.put('/:id/complete', protect, authorize('admin'), async (req, res) => {
  try {
    const dispatch = await Dispatch.findById(req.params.id);

    if (!dispatch) {
      return res.status(404).json({ success: false, message: 'Dispatch not found' });
    }

    if (dispatch.status === 'Completed') {
      return res.status(400).json({ success: false, message: 'This dispatch is already completed' });
    }

    // 1. Update Dispatch
    dispatch.status = 'Completed';
    await dispatch.save();

    // 2. Update all associated Consignments to "Delivered"
    await Consignment.updateMany(
      { _id: { $in: dispatch.consignments } },
      { status: 'Delivered' }
    );

    // 3. Update the Truck: Set status to "Available" and move it to the destination branch
    await Truck.updateOne(
      { _id: dispatch.truck },
      { 
        status: 'Available',
        currentBranch: dispatch.destination // The truck is now at the destination
      }
    );

    // 4. Create Activity Log
    const logDetails = `Admin ${req.user.name} marked dispatch ${dispatch.manifestNumber} as Completed.`;
    await createActivityLog(req.user, 'Updated', 'Dispatch', logDetails);

    res.status(200).json({ success: true, data: dispatch });

  } catch (error) {
    console.error('Complete dispatch error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});
// --- END NEW CODE ---

module.exports = router;