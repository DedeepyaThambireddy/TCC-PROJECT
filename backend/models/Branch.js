// backend/models/Branch.js
const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a branch name'],
    trim: true,
    unique: true
  },
  location: {
    type: String,
    required: [true, 'Please provide a location'],
    trim: true
  },
  // This will store an array of truck IDs that belong to this branch
  trucks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Truck'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Branch', branchSchema);