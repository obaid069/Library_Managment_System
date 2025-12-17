import connectDB from '../config/database.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import MedicalRecord from '../models/MedicalRecord.js';
import Department from '../models/Department.js';

await connectDB();

console.log('\n=== HOSPITAL AGGREGATION QUERIES ===\n');

// 1. Doctor Workload Analysis
console.log('1. Doctor Workload - Total Appointments by Doctor\n');
const doctorWorkload = await Appointment.aggregate([
  {
    $group: {
      _id: '$doctorId',
      totalAppointments: { $sum: 1 },
      completedAppointments: {
        $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
      },
      scheduledAppointments: {
        $sum: { $cond: [{ $eq: ['$status', 'Scheduled'] }, 1, 0] }
      }
    }
  },
  {
    $lookup: {
      from: 'doctors',
      localField: '_id',
      foreignField: '_id',
      as: 'doctor'
    }
  },
  { $unwind: '$doctor' },
  {
    $project: {
      doctorName: '$doctor.name',
      specialization: '$doctor.specialization',
      totalAppointments: 1,
      completedAppointments: 1,
      scheduledAppointments: 1
    }
  },
  { $sort: { totalAppointments: -1 } }
]);

console.log('Doctor Workload Statistics:');
doctorWorkload.forEach((doc, index) => {
  console.log(`${index + 1}. ${doc.doctorName} (${doc.specialization})`);
  console.log(`   Total: ${doc.totalAppointments}, Completed: ${doc.completedAppointments}, Scheduled: ${doc.scheduledAppointments}`);
});

// 2. Patient Demographics - Age Distribution
console.log('\n\n2. Patient Demographics - Age Groups\n');
const ageGroups = await Patient.aggregate([
  {
    $project: {
      name: 1,
      age: {
        $divide: [
          { $subtract: [new Date(), '$dateOfBirth'] },
          365.25 * 24 * 60 * 60 * 1000
        ]
      }
    }
  },
  {
    $bucket: {
      groupBy: '$age',
      boundaries: [0, 18, 35, 50, 65, 120],
      default: 'Other',
      output: {
        count: { $sum: 1 },
        patients: { $push: '$name' }
      }
    }
  }
]);

console.log('Age Distribution:');
const ageLabels = { 0: 'Children (0-17)', 18: 'Young Adults (18-34)', 35: 'Adults (35-49)', 50: 'Middle Age (50-64)', 65: 'Seniors (65+)' };
ageGroups.forEach(group => {
  const label = ageLabels[group._id] || 'Other';
  console.log(`${label}: ${group.count} patient(s)`);
});

// 3. Blood Group Distribution
console.log('\n\n3. Blood Group Distribution\n');
const bloodGroupStats = await Patient.aggregate([
  {
    $group: {
      _id: '$bloodGroup',
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } }
]);

console.log('Blood Group Statistics:');
bloodGroupStats.forEach(bg => {
  console.log(`${bg._id}: ${bg.count} patient(s)`);
});

// 4. Appointment Trends - By Status
console.log('\n\n4. Appointment Status Overview\n');
const appointmentStatus = await Appointment.aggregate([
  {
    $group: {
      _id: '$status',
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } }
]);

console.log('Appointment Status:');
appointmentStatus.forEach(status => {
  console.log(`${status._id}: ${status.count} appointment(s)`);
});

// 5. Department Statistics
console.log('\n\n5. Department Statistics\n');
const deptStats = await Doctor.aggregate([
  {
    $group: {
      _id: '$department',
      doctorCount: { $sum: 1 },
      avgExperience: { $avg: '$experience' },
      avgConsultationFee: { $avg: '$consultationFee' },
      totalExperience: { $sum: '$experience' }
    }
  },
  {
    $project: {
      department: '$_id',
      doctorCount: 1,
      avgExperience: { $round: ['$avgExperience', 1] },
      avgConsultationFee: { $round: ['$avgConsultationFee', 2] },
      totalExperience: 1
    }
  },
  { $sort: { doctorCount: -1 } }
]);

console.log('Department Overview:');
deptStats.forEach(dept => {
  console.log(`${dept._id}:`);
  console.log(`  Doctors: ${dept.doctorCount}, Avg Experience: ${dept.avgExperience} years`);
  console.log(`  Avg Consultation Fee: $${dept.avgConsultationFee}`);
});

// 6. Patients with Chronic Diseases
console.log('\n\n6. Patients with Chronic Conditions\n');
const chronicPatients = await Patient.aggregate([
  {
    $match: {
      'medicalHistory.chronicDiseases': { $exists: true, $ne: [] }
    }
  },
  {
    $project: {
      name: 1,
      patientId: 1,
      chronicDiseases: '$medicalHistory.chronicDiseases',
      diseaseCount: { $size: '$medicalHistory.chronicDiseases' }
    }
  },
  { $sort: { diseaseCount: -1 } }
]);

console.log(`Total patients with chronic conditions: ${chronicPatients.length}`);
chronicPatients.forEach(patient => {
  console.log(`${patient.name} (${patient.patientId}): ${patient.chronicDiseases.join(', ')}`);
});

// 7. Most Common Specializations
console.log('\n\n7. Most Common Medical Specializations\n');
const specializations = await Doctor.aggregate([
  {
    $group: {
      _id: '$specialization',
      doctorCount: { $sum: 1 },
      doctors: { $push: '$name' }
    }
  },
  { $sort: { doctorCount: -1 } }
]);

console.log('Specialization Distribution:');
specializations.forEach(spec => {
  console.log(`${spec._id}: ${spec.doctorCount} doctor(s)`);
});

// 8. Upcoming Appointments (Next 7 Days)
console.log('\n\n8. Upcoming Appointments (Next 7 Days)\n');
const today = new Date();
const nextWeek = new Date();
nextWeek.setDate(today.getDate() + 7);

const upcomingAppts = await Appointment.aggregate([
  {
    $match: {
      appointmentDate: { $gte: today, $lte: nextWeek },
      status: 'Scheduled'
    }
  },
  {
    $lookup: {
      from: 'patients',
      localField: 'patientId',
      foreignField: '_id',
      as: 'patient'
    }
  },
  {
    $lookup: {
      from: 'doctors',
      localField: 'doctorId',
      foreignField: '_id',
      as: 'doctor'
    }
  },
  { $unwind: '$patient' },
  { $unwind: '$doctor' },
  {
    $project: {
      patientName: '$patient.name',
      doctorName: '$doctor.name',
      specialization: '$doctor.specialization',
      appointmentDate: 1,
      appointmentTime: 1,
      reason: 1
    }
  },
  { $sort: { appointmentDate: 1, appointmentTime: 1 } }
]);

console.log(`Total upcoming appointments: ${upcomingAppts.length}`);
upcomingAppts.forEach(apt => {
  console.log(`${new Date(apt.appointmentDate).toLocaleDateString()} ${apt.appointmentTime} - ${apt.patientName} with ${apt.doctorName} (${apt.specialization})`);
});

// 9. Medical Records Summary
console.log('\n\n9. Medical Records Summary\n');
const recordsSummary = await MedicalRecord.aggregate([
  {
    $group: {
      _id: null,
      totalRecords: { $sum: 1 },
      uniquePatients: { $addToSet: '$patientId' },
      uniqueDoctors: { $addToSet: '$doctorId' }
    }
  },
  {
    $project: {
      totalRecords: 1,
      uniquePatients: { $size: '$uniquePatients' },
      uniqueDoctors: { $size: '$uniqueDoctors' }
    }
  }
]);

if (recordsSummary.length > 0) {
  console.log('Medical Records Overview:');
  console.log(`Total Records: ${recordsSummary[0].totalRecords}`);
  console.log(`Patients with Records: ${recordsSummary[0].uniquePatients}`);
  console.log(`Doctors with Records: ${recordsSummary[0].uniqueDoctors}`);
}

// 10. Patients by Gender
console.log('\n\n10. Patient Gender Distribution\n');
const genderDist = await Patient.aggregate([
  {
    $group: {
      _id: '$gender',
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } }
]);

console.log('Gender Distribution:');
genderDist.forEach(g => {
  console.log(`${g._id}: ${g.count} patient(s)`);
});

console.log('\n\n=== AGGREGATION QUERIES COMPLETED ===\n');
console.log('All hospital analytics demonstrated successfully!\n');

process.exit(0);
