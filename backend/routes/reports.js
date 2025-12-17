import express from 'express';
import Appointment from '../models/Appointment.js';
import MedicalRecord from '../models/MedicalRecord.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';

const router = express.Router();

// GET doctor workload (most appointments)
router.get('/doctor-workload', async (req, res) => {
  try {
    const result = await Appointment.aggregate([
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
      { $sort: { totalAppointments: -1 } },
      { $limit: 10 },
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
          _id: 0,
          doctorId: '$_id',
          doctorName: '$doctor.name',
          specialization: '$doctor.specialization',
          department: '$doctor.department',
          totalAppointments: 1,
          completedAppointments: 1,
          scheduledAppointments: 1
        }
      }
    ]);
    
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET active appointments by patient
router.get('/patient-appointments', async (req, res) => {
  try {
    const result = await Appointment.aggregate([
      { $match: { status: 'Scheduled' } },
      {
        $group: {
          _id: '$patientId',
          upcomingAppointments: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'patients',
          localField: '_id',
          foreignField: '_id',
          as: 'patient'
        }
      },
      { $unwind: '$patient' },
      {
        $project: {
          _id: 0,
          patientId: '$_id',
          patientName: '$patient.name',
          patientEmail: '$patient.email',
          upcomingAppointments: 1
        }
      },
      { $sort: { upcomingAppointments: -1 } }
    ]);
    
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET department statistics
router.get('/department-stats', async (req, res) => {
  try {
    const result = await Doctor.aggregate([
      {
        $group: {
          _id: '$department',
          doctorCount: { $sum: 1 },
          avgExperience: { $avg: '$experience' },
          totalConsultationFees: { $sum: '$consultationFee' }
        }
      },
      {
        $project: {
          _id: 0,
          department: '$_id',
          doctorCount: 1,
          avgExperience: { $round: ['$avgExperience', 1] },
          avgConsultationFee: { $round: [{ $divide: ['$totalConsultationFees', '$doctorCount'] }, 2] }
        }
      },
      { $sort: { doctorCount: -1 } }
    ]);
    
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET upcoming appointments (next 7 days)
router.get('/upcoming-appointments', async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    const result = await Appointment.aggregate([
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
          _id: 1,
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
    
    res.json({ success: true, count: result.length, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const [totalPatients, totalDoctors, scheduledAppointments, totalMedicalRecords] = await Promise.all([
      Patient.countDocuments({ status: 'Active' }),
      Doctor.countDocuments(),
      Appointment.countDocuments({ status: 'Scheduled' }),
      MedicalRecord.countDocuments()
    ]);
    
    const todayAppointments = await Appointment.countDocuments({
      appointmentDate: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999))
      },
      status: 'Scheduled'
    });
    
    res.json({
      success: true,
      data: {
        totalPatients,
        totalDoctors,
        scheduledAppointments,
        todayAppointments,
        totalMedicalRecords
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
