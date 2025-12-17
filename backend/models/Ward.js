import mongoose from 'mongoose';

const wardSchema = new mongoose.Schema({
  wardId: {
    type: String,
    required: true,
    unique: true
  },
  wardName: {
    type: String,
    required: true
  },
  wardType: {
    type: String,
    enum: ['General', 'ICU', 'Private', 'Semi-Private', 'Emergency', 'Pediatric', 'Maternity'],
    required: true
  },
  floor: {
    type: Number,
    required: true
  },
  totalBeds: {
    type: Number,
    required: true
  },
  availableBeds: {
    type: Number,
    required: true
  },
  chargesPerDay: {
    type: Number,
    required: true
  },
  facilities: [{
    type: String
  }],
  nurseInCharge: {
    type: String
  },
  status: {
    type: String,
    enum: ['Active', 'Under Maintenance', 'Closed'],
    default: 'Active'
  }
}, {
  timestamps: true
});

const bedAllocationSchema = new mongoose.Schema({
  allocationId: {
    type: String,
    required: true,
    unique: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  wardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ward',
    required: true
  },
  bedNumber: {
    type: String,
    required: true
  },
  admissionDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  dischargeDate: {
    type: Date
  },
  admittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Admitted', 'Discharged', 'Transferred'],
    default: 'Admitted'
  },
  dailyNotes: [{
    date: Date,
    note: String,
    recordedBy: String
  }],
  totalDays: {
    type: Number,
    default: 0
  },
  totalCharges: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Ward = mongoose.model('Ward', wardSchema);
const BedAllocation = mongoose.model('BedAllocation', bedAllocationSchema);

export { Ward, BedAllocation };
