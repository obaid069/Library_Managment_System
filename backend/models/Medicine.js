import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  medicineId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  genericName: {
    type: String
  },
  manufacturer: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Antibiotic', 'Painkiller', 'Vitamin', 'Antiviral', 'Antiseptic', 'Cardiac', 'Diabetic', 'Other'],
    required: true
  },
  dosageForm: {
    type: String,
    enum: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops', 'Inhaler'],
    required: true
  },
  strength: {
    type: String,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true
  },
  stockQuantity: {
    type: Number,
    required: true,
    default: 0
  },
  reorderLevel: {
    type: Number,
    default: 50
  },
  expiryDate: {
    type: Date,
    required: true
  },
  batchNumber: {
    type: String
  },
  rackNumber: {
    type: String
  },
  status: {
    type: String,
    enum: ['Available', 'Low Stock', 'Out of Stock', 'Expired'],
    default: 'Available'
  },
  prescriptionRequired: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Auto-update status based on stock and expiry
medicineSchema.pre('save', function(next) {
  if (this.expiryDate < new Date()) {
    this.status = 'Expired';
  } else if (this.stockQuantity === 0) {
    this.status = 'Out of Stock';
  } else if (this.stockQuantity <= this.reorderLevel) {
    this.status = 'Low Stock';
  } else {
    this.status = 'Available';
  }
  next();
});

const Medicine = mongoose.model('Medicine', medicineSchema);

export default Medicine;
