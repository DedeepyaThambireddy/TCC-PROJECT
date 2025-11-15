// backend/models/Truck.js
const mongoose = require('mongoose');

const truckSchema = new mongoose.Schema({
  truckNumber: {
    type: String,
    required: [true, 'Please provide a truck number'],
    unique: true,
    trim: true
  },
  // Capacity in cubic meters (as per your project doc)
  capacity: {
    type: Number,
    required: [true, 'Please provide truck capacity'],
    default: 500 // Default to 500 cubic meters
  },
  status: {
    type: String,
    enum: ['Available', 'Dispatched', 'Idle', 'Maintenance'],
    default: 'Available'
  },
  // The branch this truck currently belongs to
  currentBranch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Truck', truckSchema);