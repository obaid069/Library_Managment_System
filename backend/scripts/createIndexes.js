import connectDB from '../config/database.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import MedicalRecord from '../models/MedicalRecord.js';
import Billing from '../models/Billing.js';
import Department from '../models/Department.js';

await connectDB();

console.log('\n=== CREATING HOSPITAL DATABASE INDEXES ===\n');

console.log('Creating indexes for Doctor collection...');
await Doctor.collection.createIndex({ email: 1 }, { unique: true });
await Doctor.collection.createIndex({ specialization: 1 });
await Doctor.collection.createIndex({ department: 1 });
await Doctor.collection.createIndex({ licenseNumber: 1 }, { unique: true });
await Doctor.collection.createIndex({ name: 1 });
console.log('✓ Doctor indexes created');

console.log('\nCreating indexes for Patient collection...');
await Patient.collection.createIndex({ patientId: 1 }, { unique: true });
await Patient.collection.createIndex({ name: 1 });
await Patient.collection.createIndex({ email: 1 });
await Patient.collection.createIndex({ phone: 1 });
await Patient.collection.createIndex({ bloodGroup: 1 });
await Patient.collection.createIndex({ status: 1 });
await Patient.collection.createIndex({ dateOfBirth: 1 });
console.log('✓ Patient indexes created');

console.log('\nCreating indexes for Appointment collection...');
await Appointment.collection.createIndex({ patientId: 1 });
await Appointment.collection.createIndex({ doctorId: 1 });
await Appointment.collection.createIndex({ appointmentDate: 1 });
await Appointment.collection.createIndex({ status: 1 });
await Appointment.collection.createIndex({ doctorId: 1, appointmentDate: 1 });
await Appointment.collection.createIndex({ patientId: 1, status: 1 });
console.log('✓ Appointment indexes created');

console.log('\nCreating indexes for MedicalRecord collection...');
await MedicalRecord.collection.createIndex({ patientId: 1 });
await MedicalRecord.collection.createIndex({ doctorId: 1 });
await MedicalRecord.collection.createIndex({ visitDate: -1 });
await MedicalRecord.collection.createIndex({ patientId: 1, visitDate: -1 });
await MedicalRecord.collection.createIndex({ appointmentId: 1 });
console.log('✓ MedicalRecord indexes created');

console.log('\nCreating indexes for Billing collection...');
await Billing.collection.createIndex({ patientId: 1 });
await Billing.collection.createIndex({ appointmentId: 1 });
await Billing.collection.createIndex({ paid: 1 });
await Billing.collection.createIndex({ invoiceNumber: 1 }, { unique: true, sparse: true });
await Billing.collection.createIndex({ createdAt: -1 });
console.log('✓ Billing indexes created');

console.log('\nCreating indexes for Department collection...');
await Department.collection.createIndex({ name: 1 }, { unique: true });
await Department.collection.createIndex({ code: 1 }, { unique: true });
await Department.collection.createIndex({ status: 1 });
await Department.collection.createIndex({ headOfDepartment: 1 });
console.log('✓ Department indexes created');

console.log('\n=== ALL INDEXES CREATED SUCCESSFULLY ===\n');
console.log('Database is optimized for fast queries!');
console.log('\nIndex Summary:');
console.log('  - Doctor: 5 indexes (email, specialization, department, license, name)');
console.log('  - Patient: 7 indexes (patientId, name, email, phone, blood group, status, DOB)');
console.log('  - Appointment: 6 indexes (patient, doctor, date, status, compound indexes)');
console.log('  - MedicalRecord: 5 indexes (patient, doctor, visit date, appointment, compound)');
console.log('  - Billing: 5 indexes (patient, appointment, paid, invoice, date)');
console.log('  - Department: 4 indexes (name, code, status, head)');
console.log('\n✓ Total: 32 indexes created for optimal performance!\n');

process.exit(0);
