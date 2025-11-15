// backend/models/Consignment.js
const mongoose = require('mongoose');

const consignmentSchema = new mongoose.Schema({
  consignmentNumber: {
    type: String,
    unique: true
    // We removed 'required: true' because the pre-save hook generates it.
  },
  senderName: {
    type: String,
    required: [true, 'Please provide sender name'],
    trim: true
  },
  senderAddress: {
    type: String,
    required: [true, 'Please provide sender address'],
    trim: true
  },
  receiverName: {
    type: String,
    required: [true, 'Please provide receiver name'],
    trim: true
  },
  receiverAddress: {
    type: String,
    required: [true, 'Please provide receiver address'],
    trim: true
  },
  volume: {
    type: Number,
    required: [true, 'Please provide consignment volume in m³']
  },
  origin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  charge: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In-Transit', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  // These will be filled in by the auto-dispatch logic
  assignedTruck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Truck'
  },
  dispatch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dispatch'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

// Auto-generate consignmentNumber before saving
consignmentSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Generate a unique number, e.g., TCC-10001
    const lastConsignment = await this.constructor.findOne().sort({ createdAt: -1 });
    let lastNumber = 10000;
    if (lastConsignment && lastConsignment.consignmentNumber) {
      lastNumber = parseInt(lastConsignment.consignmentNumber.split('-')[1]);
    }
    this.consignmentNumber = `TCC-${lastNumber + 1}`;
  }
  next();
});

module.exports = mongoose.model('Consignment', consignmentSchema);