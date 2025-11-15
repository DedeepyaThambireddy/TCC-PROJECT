// backend/models/Dispatch.js
const mongoose = require('mongoose');

const dispatchSchema = new mongoose.Schema({
  manifestNumber: {
    type: String,
    unique: true
    // We removed 'required: true' because the pre-save hook generates it.
  },
  truck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Truck',
    required: true
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
  // An array of all consignment IDs included in this dispatch
  consignments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consignment'
  }],
  totalVolume: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['In-Transit', 'Completed'],
    default: 'In-Transit'
  }
}, { timestamps: true });

// Auto-generate manifestNumber before saving
dispatchSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Generate a unique number, e.g., MAN-20001
    const lastDispatch = await this.constructor.findOne().sort({ createdAt: -1 });
    let lastNumber = 20000;
    if (lastDispatch && lastDispatch.manifestNumber) {
      lastNumber = parseInt(lastDispatch.manifestNumber.split('-')[1]);
    }
    this.manifestNumber = `MAN-${lastNumber + 1}`;
  }
  next();
});

module.exports = mongoose.model('Dispatch', dispatchSchema);