import mongoose from 'mongoose';

const labTestSchema = new mongoose.Schema({
  testId: {
    type: String,
    required: true,
    unique: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  testName: {
    type: String,
    required: true
  },
  testCategory: {
    type: String,
    enum: ['Blood Test', 'Urine Test', 'X-Ray', 'CT Scan', 'MRI', 'Ultrasound', 'ECG', 'Other'],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Routine', 'Urgent', 'Emergency'],
    default: 'Routine'
  },
  requestedDate: {
    type: Date,
    default: Date.now
  },
  completedDate: {
    type: Date
  },
  labTechnician: {
    type: String
  },
  results: {
    type: String
  },
  observations: {
    type: String
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    uploadedAt: Date
  }],
  normalRange: {
    type: String
  },
  resultValue: {
    type: String
  },
  unit: {
    type: String
  },
  isAbnormal: {
    type: Boolean,
    default: false
  },
  cost: {
    type: Number,
    required: true
  },
  remarks: {
    type: String
  }
}, {
  timestamps: true
});

const LabTest = mongoose.model('LabTest', labTestSchema);

export default LabTest;
