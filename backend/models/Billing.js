import mongoose from 'mongoose';

const billingSchema = new mongoose.Schema({
  billId: {
    type: String,
    required: true,
    unique: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  admissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BedAllocation'
  },
  billDate: {
    type: Date,
    default: Date.now
  },
  charges: {
    consultationFee: {
      type: Number,
      default: 0
    },
    labTests: [{
      testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LabTest'
      },
      testName: String,
      cost: Number
    }],
    medicines: [{
      medicineId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine'
      },
      medicineName: String,
      quantity: Number,
      unitPrice: Number,
      total: Number
    }],
    roomCharges: {
      days: Number,
      ratePerDay: Number,
      total: {
        type: Number,
        default: 0
      }
    },
    otherCharges: [{
      description: String,
      amount: Number
    }]
  },
  items: [{
    description: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Partial', 'Paid'],
    default: 'Unpaid'
  },
  amountPaid: {
    type: Number,
    default: 0
  },
  amountDue: {
    type: Number,
    default: 0
  },
  paid: {
    type: Boolean,
    default: false
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Credit Card', 'Debit Card', 'Insurance', 'Online', 'UPI'],
    default: null
  },
  paymentDate: {
    type: Date
  },
  invoiceNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  generatedBy: {
    type: String
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate amount due before saving
billingSchema.pre('save', function(next) {
  this.amountDue = this.totalAmount - this.amountPaid;
  if (this.amountPaid === 0) {
    this.paymentStatus = 'Unpaid';
  } else if (this.amountPaid >= this.totalAmount) {
    this.paymentStatus = 'Paid';
    this.paid = true;
  } else {
    this.paymentStatus = 'Partial';
  }
  next();
});

// Indexes for efficient querying
billingSchema.index({ patientId: 1 });
billingSchema.index({ appointmentId: 1 });
billingSchema.index({ paid: 1 });
billingSchema.index({ billId: 1 });
billingSchema.index({ invoiceNumber: 1 });
billingSchema.index({ createdAt: -1 });

const Billing = mongoose.model('Billing', billingSchema);

export default Billing;
