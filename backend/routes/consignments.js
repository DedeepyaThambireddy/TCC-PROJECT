// backend/routes/consignments.js
/** 
const express = require('express');
const router = express.Router();
const Consignment = require('../models/Consignment');
const Branch = require('../models/Branch');
const Truck = require('../models/Truck');
const Dispatch = require('../models/Dispatch');
const { protect, authorize } = require('../middleware/auth');
const createActivityLog = require('../utils/activityLogger'); // <-- ADD THIS
const sendEmail = require('../utils/sendEmail');
// --- Updated "SMART LOOP" Auto-Dispatch Function ---
// It now accepts 'user' so it can log who triggered the dispatch
const checkAndAutoDispatch = async (originId, destinationId, user) => {
  console.log('--- 🚀 SMART AUTO-DISPATCH CHECK INITIATED ---');
  console.log(`Checking route: Origin ${originId} to Destination ${destinationId}`);
  let dispatchesMade = 0;
  let dispatchMessage = 'No new dispatch triggered.';

  while (true) {
    console.log('--- 🔄 Checking for dispatch opportunity... ---');
    try {
      const pendingConsignments = await Consignment.find({
        origin: originId,
        destination: destinationId,
        status: 'Pending'
      }).sort({ volume: -1 });
      const totalPendingVolume = pendingConsignments.reduce((acc, c) => acc + c.volume, 0);
      console.log(`Current pending volume: ${totalPendingVolume} m³`);
      if (totalPendingVolume < 500) {
        console.log('--- 🏁 No more volume to dispatch. Exiting loop. ---');
        dispatchMessage = 'Not enough volume for a new dispatch.';
        break;
      }
      console.log(`--- ✅ Volume check passed (${totalPendingVolume} m³). ---`);
      const availableTruck = await Truck.findOne({
        currentBranch: originId,
        status: 'Available'
      });
      if (!availableTruck) {
        console.log('--- 🏁 No available truck found. Exiting loop. ---');
        dispatchMessage = 'Volume is ready, but no available truck at origin.';
        break;
      }
      console.log(`--- ✅ Found available truck: ${availableTruck.truckNumber} (Capacity: ${availableTruck.capacity} m³). ---`);
      let volumeForThisTruck = 0;
      const consignmentsForThisDispatch = [];
      for (const c of pendingConsignments) {
        if (volumeForThisTruck + c.volume <= availableTruck.capacity) {
          volumeForThisTruck += c.volume;
          consignmentsForThisDispatch.push(c._id);
        }
      }
      if (consignmentsForThisDispatch.length === 0) {
          console.log('--- ⚠️ No consignments fit in the available truck. Exiting loop. ---');
          dispatchMessage = 'Pending consignments are too large for the available truck.';
          break;
      }
      console.log(`Loading truck with ${consignmentsForThisDispatch.length} consignments. Total Volume: ${volumeForThisTruck} m³`);
      const newDispatch = await Dispatch.create({
        truck: availableTruck._id,
        origin: originId,
        destination: destinationId,
        consignments: consignmentsForThisDispatch,
        totalVolume: volumeForThisTruck,
        status: 'In-Transit'
      });
      console.log(`--- ✅ Dispatch ${newDispatch.manifestNumber} created. ---`);
      await Consignment.updateMany(
        { _id: { $in: consignmentsForThisDispatch } },
        { status: 'In-Transit', assignedTruck: availableTruck._id, dispatch: newDispatch._id }
      );
      await Truck.updateOne(
        { _id: availableTruck._id },
        { status: 'Dispatched' }
      );
      console.log(`--- ✅ Truck ${availableTruck.truckNumber} status set to "Dispatched". ---`);
      dispatchesMade++;

      // --- ADD LOG ---
      const logDetails = `Dispatch ${newDispatch.manifestNumber} created by ${user.name} for truck ${availableTruck.truckNumber}.`;
      await createActivityLog(user, 'Dispatched', 'Dispatch', logDetails);
      // --- END LOG ---

    } catch (error) {
      console.error('--- 🚨 AUTO-DISPATCH CRITICAL ERROR ---', error);
      dispatchMessage = 'A server error occurred during dispatch.';
      break;
    }
  }
  if (dispatchesMade > 0) {
    return { success: true, message: `Successfully created ${dispatchesMade} new dispatch(es)!` };
  } else {
    return { success: false, message: dispatchMessage };
  }
};
// ----------------------------------------

// @route   POST /api/consignments
router.post('/', protect, async (req, res) => {
  try {
    const { 
      senderName, senderAddress, receiverName, receiverAddress, 
      volume, origin, destination 
    } = req.body;
    const originBranch = await Branch.findById(origin);
    const destBranch = await Branch.findById(destination);
    if (!originBranch || !destBranch) {
      return res.status(404).json({ message: 'Invalid origin or destination branch' });
    }
    const charge = volume * 50; 
    const newConsignment = await Consignment.create({
      senderName,
      senderAddress,
      receiverName,
      receiverAddress,
      volume,
      origin,
      destination,
      charge,
      status: 'Pending',
      createdBy: req.user.id
    });

    // --- ADD LOG ---
    const logDetails = `Consignment ${newConsignment.consignmentNumber} created by ${req.user.name}.`;
    await createActivityLog(req.user, 'Created', 'Consignment', logDetails);
    // --- END LOG ---

    try {
      const emailSubject = `Your TCC Booking is Confirmed! (ID: ${newConsignment.consignmentNumber})`;
      const emailHtml = `
        <h1>Thank you for your booking, ${req.user.name}!</h1>
        <p>Your new consignment has been successfully booked.</p>
        <p><strong>Tracking ID:</strong> ${newConsignment.consignmentNumber}</p>
        <p><strong>From:</strong> ${originBranch.name}</p>
        <p><strong>To:</strong> ${destBranch.name}</p>
        <p><strong>Volume:</strong> ${volume} m³</p>
        <p>You can track the status of your consignment by logging into your account.</p>
      `;
      // Send the email (this happens in the background)
      sendEmail(req.user.email, emailSubject, emailHtml);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // We don't stop the request, just log the error
    }

    // --- Pass req.user to the dispatch function ---
    const dispatchResult = await checkAndAutoDispatch(origin, destination, req.user);

    res.status(201).json({ 
      success: true, 
      data: newConsignment,
      dispatchMessage: dispatchResult.message 
    });
  } catch (error) {
    console.error('Create consignment error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   GET /api/consignments
router.get('/', protect, async (req, res) => {
  try {
    let query;
    // --- THIS IS THE ROLE-BASED LOGIC ---
   if (req.user.role === 'admin') {
      // If user is Admin, find ALL consignments
      console.log('User is Admin, fetching all consignments.');
      query = Consignment.find();
    } else {
      // If user is "user", find ONLY their consignments
      console.log(`User is ${req.user.name}, fetching only their consignments.`);
      query = Consignment.find({ createdBy: req.user.id });
    }
    // --- END NEW LOGIC ---
    const consignments = await Consignment.find()
      .populate('origin', 'name')
      .populate('destination', 'name')
      .populate('assignedTruck', 'truckNumber')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: consignments.length, data: consignments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   DELETE /api/consignments/:id
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const consignment = await Consignment.findById(req.params.id);
    if (!consignment) {
      return res.status(404).json({ success: false, message: 'Consignment not found' });
    }
    if (consignment.status !== 'Pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete a consignment that is already "In-Transit" or "Delivered"' 
      });
    }
    await Consignment.findByIdAndDelete(req.params.id);

    // --- ADD LOG ---
    const logDetails = `Admin ${req.user.name} deleted consignment: ${consignment.consignmentNumber}`;
    await createActivityLog(req.user, 'Deleted', 'Consignment', logDetails);
    // --- END LOG ---

    res.status(200).json({ success: true, message: 'Consignment deleted successfully' });
  } catch (error) {
    console.error('Delete consignment error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
**/

// backend/routes/consignments.js
const express = require('express');
const router = express.Router();
// backend/routes/consignments.js
const Consignment = require('../models/Consignment');
const Branch = require('../models/Branch');
const Truck = require('../models/Truck');
const Dispatch = require('../models/Dispatch');
const { protect, authorize } = require('../middleware/auth');
const createActivityLog = require('../utils/activityLogger');
const sendEmail = require('../utils/sendEmail');

// --- This is your "SMART LOOP" Auto-Dispatch Function ---
// (This is your existing, perfect function)
const checkAndAutoDispatch = async (originId, destinationId, user) => {
  console.log('--- 🚀 SMART AUTO-DISPATCH CHECK INITIATED ---');
  let dispatchesMade = 0;
  let dispatchMessage = 'No new dispatch triggered.';
  while (true) {
    try {
      const pendingConsignments = await Consignment.find({ origin: originId, destination: destinationId, status: 'Pending' }).sort({ volume: -1 });
      const totalPendingVolume = pendingConsignments.reduce((acc, c) => acc + c.volume, 0);
      if (totalPendingVolume < 500) {
        dispatchMessage = 'Not enough volume for a new dispatch.';
        break;
      }
      const availableTruck = await Truck.findOne({ currentBranch: originId, status: 'Available' });
      if (!availableTruck) {
        dispatchMessage = 'Volume is ready, but no available truck at origin.';
        break;
      }
      let volumeForThisTruck = 0;
      const consignmentsForThisDispatch = [];
      for (const c of pendingConsignments) {
        if (volumeForThisTruck + c.volume <= availableTruck.capacity) {
          volumeForThisTruck += c.volume;
          consignmentsForThisDispatch.push(c._id);
        }
      }
      if (consignmentsForThisDispatch.length === 0) {
          dispatchMessage = 'Pending consignments are too large for the available truck.';
          break;
      }
      const newDispatch = await Dispatch.create({
        truck: availableTruck._id,
        origin: originId,
        destination: destinationId,
        consignments: consignmentsForThisDispatch,
        totalVolume: volumeForThisTruck,
        status: 'In-Transit'
      });
      await Consignment.updateMany(
        { _id: { $in: consignmentsForThisDispatch } },
        { status: 'In-Transit', assignedTruck: availableTruck._id, dispatch: newDispatch._id }
      );
      await Truck.updateOne({ _id: availableTruck._id }, { status: 'Dispatched' });
      dispatchesMade++;
      const logDetails = `Dispatch ${newDispatch.manifestNumber} created by ${user.name} for truck ${availableTruck.truckNumber}.`;
      await createActivityLog(user, 'Dispatched', 'Dispatch', logDetails);
    } catch (error) {
      console.error('--- 🚨 AUTO-DISPATCH CRITICAL ERROR ---', error);
      dispatchMessage = 'A server error occurred during dispatch.';
      break;
    }
  }
  if (dispatchesMade > 0) { return { success: true, message: `Successfully created ${dispatchesMade} new dispatch(es)!` }; }
  else { return { success: false, message: dispatchMessage }; }
};
// ----------------------------------------

// @route   POST /api/consignments
// @desc    Add a new consignment (Both Admin and User can do this)
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { 
      senderName, senderAddress, receiverName, receiverAddress, 
      volume, origin, destination 
    } = req.body;
    
    const originBranch = await Branch.findById(origin);
    const destBranch = await Branch.findById(destination);
    if (!originBranch || !destBranch) {
      return res.status(404).json({ message: 'Invalid origin or destination branch' });
    }

    const charge = volume * 50; 

    // --- This correctly saves the user ID ---
    const newConsignment = await Consignment.create({
      senderName,
      senderAddress,
      receiverName,
      receiverAddress,
      volume,
      origin,
      destination,
      charge,
      status: 'Pending',
      createdBy: req.user.id // <-- This links the consignment to the user
    });

    const logDetails = `Consignment ${newConsignment.consignmentNumber} created by ${req.user.name}.`;
    await createActivityLog(req.user, 'Created', 'Consignment', logDetails);

    // --- This correctly triggers the email ---
    try {
      const emailSubject = `Your TCC Booking is Confirmed! (ID: ${newConsignment.consignmentNumber})`;
      const emailHtml = `<h1>Thank you for your booking, ${req.user.name}!</h1><p>Your new consignment has been successfully booked.</p><p><strong>Tracking ID:</strong> ${newConsignment.consignmentNumber}</p><p><strong>From:</strong> ${originBranch.name}</p><p><strong>To:</strong> ${destBranch.name}</p><p><strong>Volume:</strong> ${volume} m³</p><p>You can track the status of your consignment by logging into your account.</p>`;
      sendEmail(req.user.email, emailSubject, emailHtml);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }
    // --- END EMAIL LOGIC ---

    const dispatchResult = await checkAndAutoDispatch(origin, destination, req.user);

    res.status(201).json({ 
      success: true, 
      data: newConsignment,
      dispatchMessage: dispatchResult.message 
    });

  } catch (error) {
    console.error('Create consignment error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// --- THIS IS THE NEW FIX ---

// @route   GET /api/consignments/all
// @desc    Get ALL consignments (Admin Only)
// @access  Private (Admin)
router.get('/all', protect, authorize('admin'), async (req, res) => {
  try {
    const consignments = await Consignment.find()
      .populate('origin', 'name')
      .populate('destination', 'name')
      .populate('assignedTruck', 'truckNumber')
      .sort({ createdAt: -1 });
      
    res.status(200).json({ success: true, count: consignments.length, data: consignments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   GET /api/consignments/my-consignments
// @desc    Get ONLY the logged-in user's consignments (User Only)
// @access  Private (User)
router.get('/consignments', protect, authorize('user'), async (req, res) => {
  try {
    const consignments = await Consignment.find({ createdBy: req.user.id })
      .populate('origin', 'name')
      .populate('destination', 'name')
      .populate('assignedTruck', 'truckNumber')
      .sort({ createdAt: -1 });
      
    res.status(200).json({ success: true, count: consignments.length, data: consignments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

router.get('/my-consignments', protect, authorize('user'), async (req, res) => {
  try {
    // This line finds only consignments matching the logged-in user's ID
    const consignments = await Consignment.find({ createdBy: req.user.id })
      .populate('origin', 'name')
      .populate('destination', 'name')
      .populate('assignedTruck', 'truckNumber')
      .sort({ createdAt: -1 });
      
    res.status(200).json({ success: true, count: consignments.length, data: consignments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});
// --- END NEW FIX ---


// @route   DELETE /api/consignments/:id
// @desc    Delete a consignment
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const consignment = await Consignment.findById(req.params.id);
    if (!consignment) {
      return res.status(404).json({ success: false, message: 'Consignment not found' });
    }
    if (consignment.status !== 'Pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete a consignment that is already "In-Transit" or "Delivered"' 
      });
    }

    await Consignment.findByIdAndDelete(req.params.id);

    const logDetails = `Admin ${req.user.name} deleted consignment: ${consignment.consignmentNumber}`;
    await createActivityLog(req.user, 'Deleted', 'Consignment', logDetails);

    res.status(200).json({ success: true, message: 'Consignment deleted successfully' });
  } catch (error) {
    console.error('Delete consignment error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;