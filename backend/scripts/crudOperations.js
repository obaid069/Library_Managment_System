import connectDB from '../config/database.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import MedicalRecord from '../models/MedicalRecord.js';

await connectDB();

console.log('\n=== HOSPITAL CRUD OPERATIONS DEMO ===\n');

// CREATE Operations
console.log('1. CREATE Operations\n');

console.log('Creating a new doctor...');
const newDoctor = await Doctor.create({
  name: 'Dr. Amanda Foster',
  email: 'amanda.foster@hospital.com',
  specialization: 'Psychiatry',
  phone: '+1-555-0199',
  licenseNumber: 'MD-PSYCH-2021-225',
  department: 'Psychiatry',
  experience: 5,
  availability: ['Monday', 'Wednesday', 'Friday'],
  consultationFee: 160
});
console.log('✓ Created doctor:', newDoctor.name);

console.log('\nCreating a new patient...');
const newPatient = await Patient.create({
  name: 'Daniel Thompson',
  patientId: 'PAT-2025-999',
  dateOfBirth: new Date('1993-05-12'),
  gender: 'Male',
  phone: '+1-555-9999',
  email: 'daniel.t@email.com',
  address: {
    street: '999 Test Ave',
    city: 'Boston',
    state: 'MA',
    zipCode: '02199'
  },
  bloodGroup: 'O+',
  emergencyContact: {
    name: 'Sarah Thompson',
    relationship: 'Sister',
    phone: '+1-555-9998'
  },
  medicalHistory: {
    allergies: [],
    chronicDiseases: [],
    previousSurgeries: []
  },
  status: 'Active'
});
console.log('✓ Created patient:', newPatient.name, '-', newPatient.patientId);

console.log('\nCreating a new appointment...');
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const newAppointment = await Appointment.create({
  patientId: newPatient._id,
  doctorId: newDoctor._id,
  appointmentDate: tomorrow,
  appointmentTime: '02:00 PM',
  duration: 45,
  reason: 'Initial psychiatric evaluation',
  status: 'Scheduled',
  notes: 'First-time patient'
});
console.log('✓ Created appointment for', new Date(newAppointment.appointmentDate).toLocaleDateString());

// READ Operations
console.log('\n\n2. READ Operations\n');

console.log('Finding all cardiologists...');
const cardiologists = await Doctor.find({ specialization: 'Cardiology' });
console.log(`✓ Found ${cardiologists.length} cardiologist(s)`);
cardiologists.forEach(doc => console.log(`  - ${doc.name} (${doc.experience} years exp)`));

console.log('\nFinding all patients with blood group O+...');
const oPositivePatients = await Patient.find({ bloodGroup: 'O+' });
console.log(`✓ Found ${oPositivePatients.length} patient(s) with O+ blood`);

console.log('\nFinding all scheduled appointments...');
const scheduledAppts = await Appointment.find({ status: 'Scheduled' })
  .populate('patientId', 'name patientId')
  .populate('doctorId', 'name specialization');
console.log(`✓ Found ${scheduledAppts.length} scheduled appointment(s)`);
scheduledAppts.slice(0, 3).forEach(apt => {
  console.log(`  - ${apt.patientId?.name} with Dr. ${apt.doctorId?.name?.split(' ')[1]} on ${new Date(apt.appointmentDate).toLocaleDateString()}`);
});

console.log('\nFinding a specific patient by ID...');
const patient = await Patient.findOne({ patientId: 'PAT-2025-001' });
if (patient) {
  console.log(`✓ Found patient: ${patient.name}, Blood Group: ${patient.bloodGroup}`);
}

// UPDATE Operations
console.log('\n\n3. UPDATE Operations\n');

console.log('Updating doctor consultation fee...');
const updatedDoctor = await Doctor.findByIdAndUpdate(
  newDoctor._id,
  { consultationFee: 180 },
  { new: true }
);
console.log(`✓ Updated ${updatedDoctor.name}'s fee to $${updatedDoctor.consultationFee}`);

console.log('\nUpdating patient contact information...');
const updatedPatient = await Patient.findByIdAndUpdate(
  newPatient._id,
  { phone: '+1-555-8888', updatedAt: Date.now() },
  { new: true }
);
console.log(`✓ Updated ${updatedPatient.name}'s phone to ${updatedPatient.phone}`);

console.log('\nCompleting an appointment...');
const completedAppt = await Appointment.findByIdAndUpdate(
  newAppointment._id,
  {
    status: 'Completed',
    diagnosis: 'Anxiety disorder - Mild',
    prescription: 'Cognitive behavioral therapy recommended, follow-up in 2 weeks',
    notes: 'Patient responding well to initial consultation',
    updatedAt: Date.now()
  },
  { new: true }
);
console.log(`✓ Marked appointment as ${completedAppt.status}`);

console.log('\nUpdating multiple patients (adding chronic disease)...');
const updateResult = await Patient.updateMany(
  { 'medicalHistory.chronicDiseases': { $size: 0 } },
  { $set: { updatedAt: Date.now() } }
);
console.log(`✓ Updated ${updateResult.modifiedCount} patient record(s)`);

// DELETE Operations
console.log('\n\n4. DELETE Operations\n');

console.log('Deleting the test appointment...');
await Appointment.findByIdAndDelete(newAppointment._id);
console.log('✓ Deleted test appointment');

console.log('\nDeleting the test patient...');
await Patient.findByIdAndDelete(newPatient._id);
console.log('✓ Deleted test patient');

console.log('\nDeleting the test doctor...');
await Doctor.findByIdAndDelete(newDoctor._id);
console.log('✓ Deleted test doctor');

console.log('\n\n=== CRUD OPERATIONS COMPLETED ===\n');
console.log('All CREATE, READ, UPDATE, and DELETE operations demonstrated successfully!');
console.log('The test data has been cleaned up.\n');

process.exit(0);
