// backend/routes/branches.js
const express = require('express');
const router = express.Router();
const Branch = require('../models/Branch');
const { protect, authorize } = require('../middleware/auth');
const createActivityLog = require('../utils/activityLogger'); // <-- ADD THIS

// @route   POST /api/branches
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, location } = req.body;
    const branch = await Branch.create({ name, location });
    
    // --- ADD LOG ---
    const logDetails = `Admin ${req.user.name} created new branch: ${branch.name}`;
    await createActivityLog(req.user, 'Created', 'Branch', logDetails);
    // --- END LOG ---

    res.status(201).json({ success: true, data: branch });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   GET /api/branches
router.get('/', protect, async (req, res) => {
  try {
    const branches = await Branch.find().populate('trucks', 'truckNumber');
    res.status(200).json({ success: true, count: branches.length, data: branches });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   DELETE /api/branches/:id
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }
    if (branch.trucks.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete branch. Please re-assign or delete all trucks first.'
      });
    }

    await Branch.findByIdAndDelete(req.params.id);

    // --- ADD LOG ---
    const logDetails = `Admin ${req.user.name} deleted branch: ${branch.name}`;
    await createActivityLog(req.user, 'Deleted', 'Branch', logDetails);
    // --- END LOG ---

    res.status(200).json({ success: true, message: 'Branch deleted successfully' });
  } catch (error) {
    console.error('Delete branch error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;