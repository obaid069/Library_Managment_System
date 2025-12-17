import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema({
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
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  visitDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  symptoms: {
    type: [String],
    required: true
  },
  diagnosis: {
    type: String,
    required: true,
    trim: true
  },
  prescription: [{
    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine'
    },
    medication: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String,
    quantity: Number,
    issued: {
      type: Boolean,
      default: false
    },
    issuedDate: Date,
    issuedBy: String
  }],
  labTests: [{
    labTestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LabTest'
    },
    testName: String,
    result: String,
    date: Date,
    isRequired: {
      type: Boolean,
      default: false
    }
  }],
  admissionRequired: {
    type: Boolean,
    default: false
  },
  admissionDetails: {
    wardType: String,
    estimatedDays: Number,
    reason: String
  },
  dischargeSummary: {
    dischargeDate: Date,
    finalDiagnosis: String,
    treatmentGiven: String,
    condition: {
      type: String,
      enum: ['Improved', 'Cured', 'Stable', 'Referred', 'Deceased']
    },
    instructions: String,
    followUpRequired: Boolean,
    followUpDate: Date
  },
  vitalSigns: {
    bloodPressure: String,
    temperature: Number,
    pulse: Number,
    weight: Number,
    height: Number,
    oxygenSaturation: Number,
    respiratoryRate: Number
  },
  notes: {
    type: String,
    trim: true
  },
  followUpDate: {
    type: Date
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

// Indexes for efficient querying
medicalRecordSchema.index({ doctorId: 1 });
medicalRecordSchema.index({ visitDate: -1 });
medicalRecordSchema.index({ patientId: 1, visitDate: -1 });

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

export default MedicalRecord;
