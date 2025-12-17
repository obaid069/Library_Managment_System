import connectDB from '../config/database.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import MedicalRecord from '../models/MedicalRecord.js';
import Billing from '../models/Billing.js';
import Department from '../models/Department.js';

await connectDB();

console.log('\n=== SEEDING HOSPITAL DATABASE ===\n');

console.log('Clearing existing data...');
await Promise.all([
  Doctor.deleteMany({}),
  Patient.deleteMany({}),
  Appointment.deleteMany({}),
  MedicalRecord.deleteMany({}),
  Billing.deleteMany({}),
  Department.deleteMany({})
]);
console.log('✓ Cleared all collections\n');

// SEED DOCTORS
console.log('Creating doctors...');
const doctors = await Doctor.insertMany([
  { name: 'Dr. Sarah Wilson', email: 'sarah.wilson@hospital.com', specialization: 'Cardiology', phone: '+1-555-0101', licenseNumber: 'MD-CARD-2018-001', department: 'Cardiology', experience: 12, availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], consultationFee: 150 },
  { name: 'Dr. Michael Chen', email: 'michael.chen@hospital.com', specialization: 'Neurology', phone: '+1-555-0102', licenseNumber: 'MD-NEUR-2015-045', department: 'Neurology', experience: 15, availability: ['Monday', 'Wednesday', 'Friday'], consultationFee: 200 },
  { name: 'Dr. Emily Rodriguez', email: 'emily.rodriguez@hospital.com', specialization: 'Pediatrics', phone: '+1-555-0103', licenseNumber: 'MD-PEDI-2019-112', department: 'Pediatrics', experience: 8, availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], consultationFee: 120 },
  { name: 'Dr. James Anderson', email: 'james.anderson@hospital.com', specialization: 'Orthopedics', phone: '+1-555-0104', licenseNumber: 'MD-ORTH-2012-089', department: 'Orthopedics', experience: 18, availability: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'], consultationFee: 175 },
  { name: 'Dr. Lisa Thompson', email: 'lisa.thompson@hospital.com', specialization: 'General Medicine', phone: '+1-555-0105', licenseNumber: 'MD-GENM-2020-156', department: 'General Medicine', experience: 6, availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], consultationFee: 100 },
  { name: 'Dr. David Kumar', email: 'david.kumar@hospital.com', specialization: 'Surgery', phone: '+1-555-0106', licenseNumber: 'MD-SURG-2010-034', department: 'Surgery', experience: 20, availability: ['Monday', 'Wednesday', 'Friday'], consultationFee: 250 },
  { name: 'Dr. Rachel Green', email: 'rachel.green@hospital.com', specialization: 'Dermatology', phone: '+1-555-0107', licenseNumber: 'MD-DERM-2017-078', department: 'Dermatology', experience: 10, availability: ['Tuesday', 'Thursday', 'Friday'], consultationFee: 130 },
  { name: 'Dr. Robert Martinez', email: 'robert.martinez@hospital.com', specialization: 'Gynecology', phone: '+1-555-0108', licenseNumber: 'MD-GYNE-2016-092', department: 'Gynecology', experience: 11, availability: ['Monday', 'Tuesday', 'Thursday', 'Friday'], consultationFee: 140 }
]);
console.log(`✓ Created ${doctors.length} doctors\n`);

// SEED PATIENTS  
console.log('Creating patients...');
const patients = await Patient.insertMany([
  { name: 'John Smith', patientId: 'PAT-2025-001', dateOfBirth: new Date('1985-03-15'), gender: 'Male', phone: '+1-555-1001', email: 'john.smith@email.com', address: { street: '123 Main St', city: 'Boston', state: 'MA', zipCode: '02101' }, bloodGroup: 'O+', emergencyContact: { name: 'Jane Smith', relationship: 'Spouse', phone: '+1-555-1002' }, medicalHistory: { allergies: ['Penicillin'], chronicDiseases: ['Hypertension'], previousSurgeries: [] }, status: 'Active' },
  { name: 'Emma Johnson', patientId: 'PAT-2025-002', dateOfBirth: new Date('1992-07-22'), gender: 'Female', phone: '+1-555-1003', email: 'emma.j@email.com', address: { street: '456 Oak Ave', city: 'Boston', state: 'MA', zipCode: '02102' }, bloodGroup: 'A+', emergencyContact: { name: 'Robert Johnson', relationship: 'Father', phone: '+1-555-1004' }, medicalHistory: { allergies: [], chronicDiseases: [], previousSurgeries: ['Appendectomy'] }, status: 'Active' },
  { name: 'Michael Brown', patientId: 'PAT-2025-003', dateOfBirth: new Date('1978-11-05'), gender: 'Male', phone: '+1-555-1005', email: 'michael.b@email.com', address: { street: '789 Pine Rd', city: 'Cambridge', state: 'MA', zipCode: '02138' }, bloodGroup: 'B+', emergencyContact: { name: 'Sarah Brown', relationship: 'Spouse', phone: '+1-555-1006' }, medicalHistory: { allergies: ['Latex'], chronicDiseases: ['Diabetes Type 2'], previousSurgeries: [] }, status: 'Active' },
  { name: 'Sophia Davis', patientId: 'PAT-2025-004', dateOfBirth: new Date('2015-04-18'), gender: 'Female', phone: '+1-555-1007', email: 'davis.family@email.com', address: { street: '321 Elm St', city: 'Boston', state: 'MA', zipCode: '02103' }, bloodGroup: 'AB+', emergencyContact: { name: 'Jennifer Davis', relationship: 'Mother', phone: '+1-555-1008' }, medicalHistory: { allergies: [], chronicDiseases: [], previousSurgeries: [] }, status: 'Active' },
  { name: 'William Garcia', patientId: 'PAT-2025-005', dateOfBirth: new Date('1965-09-30'), gender: 'Male', phone: '+1-555-1009', email: 'w.garcia@email.com', address: { street: '654 Maple Dr', city: 'Brookline', state: 'MA', zipCode: '02445' }, bloodGroup: 'O-', emergencyContact: { name: 'Maria Garcia', relationship: 'Spouse', phone: '+1-555-1010' }, medicalHistory: { allergies: ['Aspirin'], chronicDiseases: ['Arthritis', 'High Cholesterol'], previousSurgeries: ['Knee Replacement'] }, status: 'Active' },
  { name: 'Olivia Martinez', patientId: 'PAT-2025-006', dateOfBirth: new Date('1988-12-10'), gender: 'Female', phone: '+1-555-1011', email: 'olivia.m@email.com', address: { street: '987 Cedar Ln', city: 'Somerville', state: 'MA', zipCode: '02143' }, bloodGroup: 'A-', emergencyContact: { name: 'Carlos Martinez', relationship: 'Brother', phone: '+1-555-1012' }, medicalHistory: { allergies: [], chronicDiseases: ['Asthma'], previousSurgeries: [] }, status: 'Active' },
  { name: 'James Wilson', patientId: 'PAT-2025-007', dateOfBirth: new Date('1995-06-25'), gender: 'Male', phone: '+1-555-1013', email: 'james.w@email.com', address: { street: '147 Birch Ave', city: 'Boston', state: 'MA', zipCode: '02104' }, bloodGroup: 'B-', emergencyContact: { name: 'Linda Wilson', relationship: 'Mother', phone: '+1-555-1014' }, medicalHistory: { allergies: [], chronicDiseases: [], previousSurgeries: [] }, status: 'Active' },
  { name: 'Isabella Lee', patientId: 'PAT-2025-008', dateOfBirth: new Date('1982-02-14'), gender: 'Female', phone: '+1-555-1015', email: 'isabella.lee@email.com', address: { street: '258 Spruce St', city: 'Newton', state: 'MA', zipCode: '02458' }, bloodGroup: 'AB-', emergencyContact: { name: 'Daniel Lee', relationship: 'Spouse', phone: '+1-555-1016' }, medicalHistory: { allergies: ['Shellfish'], chronicDiseases: [], previousSurgeries: ['C-Section'] }, status: 'Active' },
  { name: 'Ethan Taylor', patientId: 'PAT-2025-009', dateOfBirth: new Date('2010-08-08'), gender: 'Male', phone: '+1-555-1017', email: 'taylor.family@email.com', address: { street: '369 Walnut Rd', city: 'Quincy', state: 'MA', zipCode: '02169' }, bloodGroup: 'O+', emergencyContact: { name: 'Amanda Taylor', relationship: 'Mother', phone: '+1-555-1018' }, medicalHistory: { allergies: ['Peanuts'], chronicDiseases: [], previousSurgeries: [] }, status: 'Active' },
  { name: 'Ava Anderson', patientId: 'PAT-2025-010', dateOfBirth: new Date('1990-01-20'), gender: 'Female', phone: '+1-555-1019', email: 'ava.anderson@email.com', address: { street: '741 Hickory Dr', city: 'Waltham', state: 'MA', zipCode: '02451' }, bloodGroup: 'A+', emergencyContact: { name: 'Mark Anderson', relationship: 'Spouse', phone: '+1-555-1020' }, medicalHistory: { allergies: [], chronicDiseases: ['Migraine'], previousSurgeries: [] }, status: 'Active' }
]);
console.log(`✓ Created ${patients.length} patients\n`);

// SEED APPOINTMENTS
console.log('Creating appointments...');
const today = new Date();
const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 7);
const lastWeek = new Date(today); lastWeek.setDate(lastWeek.getDate() - 7);

const appointments = await Appointment.insertMany([
  { patientId: patients[0]._id, doctorId: doctors[0]._id, appointmentDate: tomorrow, appointmentTime: '09:00 AM', duration: 30, reason: 'Regular checkup for hypertension', status: 'Scheduled', notes: 'Patient requested morning appointment' },
  { patientId: patients[1]._id, doctorId: doctors[2]._id, appointmentDate: tomorrow, appointmentTime: '10:30 AM', duration: 30, reason: 'Annual physical examination', status: 'Scheduled' },
  { patientId: patients[2]._id, doctorId: doctors[4]._id, appointmentDate: lastWeek, appointmentTime: '02:00 PM', duration: 30, reason: 'Diabetes management consultation', status: 'Completed', diagnosis: 'Type 2 Diabetes - Controlled', prescription: 'Metformin 500mg twice daily, Continue current diet plan' },
  { patientId: patients[3]._id, doctorId: doctors[2]._id, appointmentDate: lastWeek, appointmentTime: '11:00 AM', duration: 30, reason: 'Vaccination - Annual flu shot', status: 'Completed', diagnosis: 'Healthy child, immunization administered', prescription: 'Influenza vaccine administered' },
  { patientId: patients[4]._id, doctorId: doctors[3]._id, appointmentDate: nextWeek, appointmentTime: '03:00 PM', duration: 45, reason: 'Knee pain follow-up', status: 'Scheduled', notes: 'Post knee replacement checkup' },
  { patientId: patients[5]._id, doctorId: doctors[4]._id, appointmentDate: today, appointmentTime: '01:00 PM', duration: 30, reason: 'Asthma control assessment', status: 'Scheduled' },
  { patientId: patients[6]._id, doctorId: doctors[6]._id, appointmentDate: tomorrow, appointmentTime: '02:30 PM', duration: 30, reason: 'Skin rash evaluation', status: 'Scheduled' },
  { patientId: patients[7]._id, doctorId: doctors[7]._id, appointmentDate: nextWeek, appointmentTime: '10:00 AM', duration: 30, reason: 'Prenatal checkup', status: 'Scheduled' },
  { patientId: patients[8]._id, doctorId: doctors[2]._id, appointmentDate: lastWeek, appointmentTime: '09:30 AM', duration: 30, reason: 'Allergy consultation', status: 'Completed', diagnosis: 'Peanut allergy confirmed', prescription: 'EpiPen prescribed, avoid peanuts and tree nuts' },
  { patientId: patients[9]._id, doctorId: doctors[1]._id, appointmentDate: tomorrow, appointmentTime: '11:00 AM', duration: 45, reason: 'Migraine treatment consultation', status: 'Scheduled' },
  { patientId: patients[0]._id, doctorId: doctors[5]._id, appointmentDate: lastWeek, appointmentTime: '04:00 PM', duration: 30, reason: 'Consultation for elective procedure', status: 'Completed', diagnosis: 'Discussed surgical options', prescription: 'Pre-surgery evaluation scheduled' },
  { patientId: patients[1]._id, doctorId: doctors[0]._id, appointmentDate: nextWeek, appointmentTime: '08:30 AM', duration: 30, reason: 'Cardiac health screening', status: 'Scheduled' }
]);
console.log(`✓ Created ${appointments.length} appointments\n`);

// SEED MEDICAL RECORDS
console.log('Creating medical records...');
const medicalRecords = await MedicalRecord.insertMany([
  { patientId: patients[0]._id, doctorId: doctors[0]._id, visitDate: lastWeek, symptoms: ['High blood pressure', 'Occasional headaches'], diagnosis: 'Hypertension - Stage 1', prescription: [{ medication: 'Lisinopril', dosage: '10mg', duration: '30 days', instructions: 'Take once daily in the morning' }], labTests: [{ testName: 'Blood Pressure', result: '145/92 mmHg', date: lastWeek }], vitalSigns: { bloodPressure: '145/92', temperature: 98.6, pulse: 78, weight: 180, height: 70 }, notes: 'Patient advised on lifestyle modifications', followUpDate: nextWeek },
  { patientId: patients[2]._id, doctorId: doctors[4]._id, visitDate: lastWeek, symptoms: ['Increased thirst', 'Frequent urination'], diagnosis: 'Type 2 Diabetes Mellitus - Controlled', prescription: [{ medication: 'Metformin', dosage: '500mg', duration: '90 days', instructions: 'Take twice daily with meals' }], labTests: [{ testName: 'HbA1c', result: '6.8%', date: lastWeek }, { testName: 'Fasting Blood Glucose', result: '125 mg/dL', date: lastWeek }], vitalSigns: { bloodPressure: '130/85', temperature: 98.4, pulse: 72, weight: 195, height: 69 }, notes: 'Blood sugar levels improving', followUpDate: new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000) },
  { patientId: patients[3]._id, doctorId: doctors[2]._id, visitDate: lastWeek, symptoms: ['None - Preventive care'], diagnosis: 'Healthy child - Immunization visit', prescription: [{ medication: 'Influenza Vaccine', dosage: '0.5mL', duration: 'Single dose', instructions: 'Intramuscular injection administered' }], labTests: [], vitalSigns: { bloodPressure: '90/60', temperature: 98.2, pulse: 88, weight: 75, height: 56 }, notes: 'Child is developing normally', followUpDate: new Date(today.getTime() + 180 * 24 * 60 * 60 * 1000) },
  { patientId: patients[8]._id, doctorId: doctors[2]._id, visitDate: lastWeek, symptoms: ['Skin rash after eating peanuts', 'Difficulty breathing'], diagnosis: 'Severe Peanut Allergy', prescription: [{ medication: 'EpiPen (Epinephrine)', dosage: '0.3mg', duration: 'As needed', instructions: 'Use immediately if exposed to peanuts' }, { medication: 'Cetirizine', dosage: '10mg', duration: '30 days', instructions: 'Take once daily for mild allergic symptoms' }], labTests: [{ testName: 'Allergy Panel', result: 'Positive for peanut allergen', date: lastWeek }], vitalSigns: { bloodPressure: '118/75', temperature: 98.3, pulse: 70, weight: 95, height: 60 }, notes: 'Patient educated on avoiding peanuts and tree nuts', followUpDate: new Date(today.getTime() + 180 * 24 * 60 * 60 * 1000) }
]);
console.log(`✓ Created ${medicalRecords.length} medical records\n`);

// SEED BILLING
console.log('Creating billing records...');
const billings = await Billing.insertMany([
  { patientId: patients[0]._id, appointmentId: appointments[0]._id, items: [{ description: 'Doctor Consultation - General Medicine', quantity: 1, unitPrice: 100, total: 100 }, { description: 'Blood Pressure Test', quantity: 1, unitPrice: 25, total: 25 }], subtotal: 125, tax: 10, discount: 0, totalAmount: 135, paid: true, paymentMethod: 'Credit Card', paymentDate: lastWeek, invoiceNumber: 'INV-2025-001' },
  { patientId: patients[2]._id, appointmentId: appointments[2]._id, items: [{ description: 'Doctor Consultation - General Medicine', quantity: 1, unitPrice: 100, total: 100 }, { description: 'HbA1c Test', quantity: 1, unitPrice: 50, total: 50 }, { description: 'Fasting Blood Glucose Test', quantity: 1, unitPrice: 30, total: 30 }], subtotal: 180, tax: 14.4, discount: 0, totalAmount: 194.4, paid: true, paymentMethod: 'Insurance', paymentDate: lastWeek, invoiceNumber: 'INV-2025-002' },
  { patientId: patients[3]._id, appointmentId: appointments[3]._id, items: [{ description: 'Pediatric Consultation', quantity: 1, unitPrice: 120, total: 120 }, { description: 'Influenza Vaccine', quantity: 1, unitPrice: 35, total: 35 }], subtotal: 155, tax: 12.4, discount: 15, totalAmount: 152.4, paid: true, paymentMethod: 'Cash', paymentDate: lastWeek, invoiceNumber: 'INV-2025-003' },
  { patientId: patients[8]._id, appointmentId: appointments[8]._id, items: [{ description: 'Pediatric Consultation', quantity: 1, unitPrice: 120, total: 120 }, { description: 'Allergy Panel Test', quantity: 1, unitPrice: 150, total: 150 }, { description: 'EpiPen Prescription', quantity: 2, unitPrice: 300, total: 600 }], subtotal: 870, tax: 69.6, discount: 0, totalAmount: 939.6, paid: false, paymentMethod: null, paymentDate: null, invoiceNumber: 'INV-2025-004' }
]);
console.log(`✓ Created ${billings.length} billing records\n`);

// SEED DEPARTMENTS
console.log('Creating departments...');
const departments = await Department.insertMany([
  { name: 'Cardiology', code: 'CARD', description: 'Heart and cardiovascular system care', headOfDepartment: doctors[0]._id, location: { building: 'Main Hospital', floor: '3rd Floor', room: 'Wing A' }, contactNumber: '+1-555-CARD', email: 'cardiology@hospital.com', services: ['ECG', 'Echocardiography', 'Cardiac Stress Test'], operatingHours: { weekdays: { open: '08:00 AM', close: '06:00 PM' }, weekends: { open: '09:00 AM', close: '01:00 PM' } }, bedCapacity: 25, status: 'Active' },
  { name: 'Neurology', code: 'NEUR', description: 'Brain and nervous system disorders', headOfDepartment: doctors[1]._id, location: { building: 'Main Hospital', floor: '4th Floor', room: 'Wing B' }, contactNumber: '+1-555-NEUR', email: 'neurology@hospital.com', services: ['MRI', 'CT Scan', 'EEG'], operatingHours: { weekdays: { open: '08:00 AM', close: '05:00 PM' }, weekends: { open: 'Closed', close: 'Closed' } }, bedCapacity: 20, status: 'Active' },
  { name: 'Pediatrics', code: 'PEDI', description: 'Child healthcare and development', headOfDepartment: doctors[2]._id, location: { building: 'Children\'s Wing', floor: '1st Floor', room: 'Entire Wing' }, contactNumber: '+1-555-PEDI', email: 'pediatrics@hospital.com', services: ['Immunizations', 'Growth Monitoring', 'Pediatric Care'], operatingHours: { weekdays: { open: '08:00 AM', close: '08:00 PM' }, weekends: { open: '09:00 AM', close: '05:00 PM' } }, bedCapacity: 30, status: 'Active' },
  { name: 'Orthopedics', code: 'ORTH', description: 'Bone, joint, and muscle care', headOfDepartment: doctors[3]._id, location: { building: 'Main Hospital', floor: '2nd Floor', room: 'Wing C' }, contactNumber: '+1-555-ORTH', email: 'orthopedics@hospital.com', services: ['X-Ray', 'Joint Replacement', 'Fracture Care'], operatingHours: { weekdays: { open: '07:00 AM', close: '06:00 PM' }, weekends: { open: '08:00 AM', close: '02:00 PM' } }, bedCapacity: 35, status: 'Active' },
  { name: 'General Medicine', code: 'GENM', description: 'Primary care and general health services', headOfDepartment: doctors[4]._id, location: { building: 'Outpatient Center', floor: 'Ground Floor', room: 'All Rooms' }, contactNumber: '+1-555-GENM', email: 'general@hospital.com', services: ['General Checkup', 'Preventive Care', 'Chronic Disease Management'], operatingHours: { weekdays: { open: '07:00 AM', close: '09:00 PM' }, weekends: { open: '08:00 AM', close: '08:00 PM' } }, bedCapacity: 40, status: 'Active' }
]);
console.log(`✓ Created ${departments.length} departments\n`);

console.log('=== DATABASE SEEDING COMPLETED ===\n');
console.log('Summary:');
console.log(`  - Doctors: ${doctors.length}`);
console.log(`  - Patients: ${patients.length}`);
console.log(`  - Appointments: ${appointments.length}`);
console.log(`  - Medical Records: ${medicalRecords.length}`);
console.log(`  - Billing Records: ${billings.length}`);
console.log(`  - Departments: ${departments.length}`);
console.log('\n✓ Hospital database ready!\n');

process.exit(0);
