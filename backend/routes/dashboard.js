// backend/routes/dashboard.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Truck = require('../models/Truck');
const Branch = require('../models/Branch');
const Consignment = require('../models/Consignment'); // <-- ADD THIS

// @route   GET /api/dashboard/stats
router.get('/stats', protect, async (req, res) => {
  try {
    // --- THIS SECTION IS FULLY UPDATED ---
    const totalTrucks = await Truck.countDocuments();
    const availableTrucks = await Truck.countDocuments({ status: 'Available' });
    const totalBranches = await Branch.countDocuments();
    
    const totalConsignments = await Consignment.countDocuments(); 
    const pendingConsignments = await Consignment.countDocuments({ status: 'Pending' });
    const dispatchedConsignments = await Consignment.countDocuments({ status: 'In-Transit' });
    // --- END UPDATE ---

    const stats = {
      totalTrucks,
      availableTrucks,
      totalBranches,
      totalConsignments,
      pendingConsignments,
      dispatchedConsignments
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;