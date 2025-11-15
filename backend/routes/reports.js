// backend/routes/reports.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Consignment = require('../models/Consignment');
const Dispatch = require('../models/Dispatch');
const mongoose = require('mongoose');

// @route   GET /api/reports/summary
// @desc    Get all aggregated report data
// @access  Private (Admin & Manager)
router.get('/summary', protect, async (req, res) => {
  try {
    // 1. Calculate Total Revenue & Revenue by Destination
    const revenueData = await Consignment.aggregate([
      {
        $group: {
          _id: '$destination', // Group by destination branch
          totalRevenue: { $sum: '$charge' }
        }
      },
      {
        $lookup: { // Join with 'branches' to get the name
          from: 'branches',
          localField: '_id',
          foreignField: '_id',
          as: 'branchInfo'
        }
      },
      {
        $unwind: '$branchInfo' // Deconstruct the array
      },
      {
        $project: {
          _id: 0,
          name: '$branchInfo.name', // Get the branch name
          revenue: '$totalRevenue'
        }
      }
    ]);

    // Calculate total revenue from the grouped data
    const totalRevenue = revenueData.reduce((acc, item) => acc + item.revenue, 0);

    // 2. Calculate Truck Usage (Dispatches per Truck)
    const truckUsage = await Dispatch.aggregate([
      {
        $group: {
          _id: '$truck', // Group by truck ID
          dispatchCount: { $sum: 1 } // Count dispatches
        }
      },
      {
        $lookup: { // Join with 'trucks' to get the truck number
          from: 'trucks',
          localField: '_id',
          foreignField: '_id',
          as: 'truckInfo'
        }
      },
      {
        $unwind: '$truckInfo'
      },
      {
        $project: {
          _id: 0,
          name: '$truckInfo.truckNumber',
          count: '$dispatchCount'
        }
      }
    ]);

    // 3. Calculate Average Consignment Waiting Time
    // (Time from creation to being "In-Transit")
    const waitTimeData = await Consignment.aggregate([
      {
        $match: { status: { $in: ['In-Transit', 'Delivered'] } } // Only for items that were dispatched
      },
      {
        $lookup: { // Join with 'dispatches' to get the dispatch creation date
          from: 'dispatches',
          localField: 'dispatch',
          foreignField: '_id',
          as: 'dispatchInfo'
        }
      },
      { $unwind: '$dispatchInfo' },
      {
        $project: {
          // Calculate time diff in milliseconds
          waitDuration: { $subtract: ['$dispatchInfo.createdAt', '$createdAt'] }
        }
      },
      {
        $group: {
          _id: null,
          avgWaitTimeInMillis: { $avg: '$waitDuration' }
        }
      }
    ]);

    const avgWaitTimeHours = (waitTimeData[0]?.avgWaitTimeInMillis || 0) / (1000 * 60 * 60);

    // 4. Send all reports
    res.status(200).json({
      success: true,
      data: {
        totalRevenue: totalRevenue,
        avgWaitTimeHours: avgWaitTimeHours.toFixed(2),
        revenueByDestination: revenueData,
        truckUsage: truckUsage
      }
    });

  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;