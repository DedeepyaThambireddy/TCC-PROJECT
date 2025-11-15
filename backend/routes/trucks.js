// backend/routes/trucks.js
const express = require('express');
const router = express.Router();
const Truck = require('../models/Truck');
const Branch = require('../models/Branch');
const { protect, authorize } = require('../middleware/auth');
const createActivityLog = require('../utils/activityLogger'); // <-- ADD THIS

// @route   POST /api/trucks
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { truckNumber, capacity, status, currentBranch } = req.body;
    const branch = await Branch.findById(currentBranch);
    if (!branch) {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }
    const truck = await Truck.create({
      truckNumber,
      capacity,
      status,
      currentBranch
    });
    branch.trucks.push(truck._id);
    await branch.save();

    // --- ADD LOG ---
    const logDetails = `Admin ${req.user.name} created truck: ${truck.truckNumber}`;
    await createActivityLog(req.user, 'Created', 'Truck', logDetails);
    // --- END LOG ---

    res.status(201).json({ success: true, data: truck });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   GET /api/trucks
router.get('/', protect, async (req, res) => {
  try {
    const trucks = await Truck.find().populate('currentBranch', 'name location');
    res.status(200).json({ success: true, count: trucks.length, data: trucks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   DELETE /api/trucks/:id
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const truck = await Truck.findById(req.params.id);
    if (!truck) {
      return res.status(404).json({ success: false, message: 'Truck not found' });
    }
    await Branch.updateOne(
      { _id: truck.currentBranch },
      { $pull: { trucks: truck._id } }
    );
    await Truck.findByIdAndDelete(req.params.id);

    // --- ADD LOG ---
    const logDetails = `Admin ${req.user.name} deleted truck: ${truck.truckNumber}`;
    await createActivityLog(req.user, 'Deleted', 'Truck', logDetails);
    // --- END LOG ---

    res.status(200).json({ success: true, message: 'Truck deleted successfully' });
  } catch (error) {
    console.error('Delete truck error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;