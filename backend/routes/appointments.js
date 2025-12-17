import express from 'express';
import Appointment from '../models/Appointment.js';
import MedicalRecord from '../models/MedicalRecord.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import { authenticated, doctorOnly, adminOnly, staffOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET all appointments with populated data (Authenticated)
router.get('/', authenticated, async (req, res) => {
  try {
    const { status, doctorId, patientId, date } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (doctorId) filter.doctorId = doctorId;
    if (patientId) filter.patientId = patientId;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.appointmentDate = { $gte: startDate, $lt: endDate };
    }
    
    const appointments = await Appointment.find(filter)
      .populate('patientId', 'name patientId phone email')
      .populate('doctorId', 'name specialization department')
      .select('-__v')
      .sort({ appointmentDate: -1 });
    
    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET appointment by ID
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId')
      .populate('doctorId')
      .select('-__v');
    
    if (!appointment) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST schedule appointment (Authenticated)
router.post('/schedule', authenticated, async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDate, appointmentTime, reason, duration } = req.body;
    
    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }
    
    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, error: 'Doctor not found' });
    }
    
    // Create appointment
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      appointmentDate,
      appointmentTime,
      reason,
      duration: duration || 30,
      status: 'Scheduled'
    });
    
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'name patientId phone email')
      .populate('doctorId', 'name specialization department');
    
    res.status(201).json({ success: true, data: populatedAppointment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT update appointment (complete, cancel, etc.)
router.put('/:id', async (req, res) => {
  try {
    req.body.updatedAt = Date.now();
    
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('patientId', 'name patientId phone email')
      .populate('doctorId', 'name specialization department');
    
    if (!appointment) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }
    
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT complete appointment (Doctor only)
router.put('/complete/:id', doctorOnly, async (req, res) => {
  try {
    const { 
      diagnosis, 
      prescription, 
      notes, 
      symptoms,
      vitalSigns,
      labTests,
      admissionRequired,
      admissionDetails
    } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }
    
    // Update appointment status
    appointment.status = 'Completed';
    appointment.diagnosis = diagnosis;
    appointment.prescription = prescription;
    appointment.notes = notes;
    appointment.updatedAt = Date.now();
    
    await appointment.save();
    
    // Create Medical Record
    const medicalRecord = await MedicalRecord.create({
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      appointmentId: appointment._id,
      symptoms: symptoms || [],
      diagnosis: diagnosis,
      prescription: prescription || [],
      labTests: labTests || [],
      vitalSigns: vitalSigns || {},
      notes: notes,
      admissionRequired: admissionRequired || false,
      admissionDetails: admissionDetails || {}
    });
    
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'name patientId phone email')
      .populate('doctorId', 'name specialization department');
    
    res.json({ 
      success: true, 
      data: populatedAppointment,
      medicalRecord: medicalRecord
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE appointment
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET all appointments for a patient
router.get('/patient/:patientId', authenticated, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.params.patientId
    })
      .populate('doctorId', 'name specialization department')
      .select('-__v')
      .sort({ appointmentDate: -1 });
    
    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET upcoming appointments for a patient
router.get('/patient/:patientId/upcoming', async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.params.patientId,
      appointmentDate: { $gte: new Date() },
      status: 'Scheduled'
    })
      .populate('doctorId', 'name specialization department')
      .select('-__v')
      .sort({ appointmentDate: 1 });
    
    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET all appointments for a doctor
router.get('/doctor/:doctorId', authenticated, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctorId: req.params.doctorId
    })
      .populate('patientId', 'name patientId phone email')
      .select('-__v')
      .sort({ appointmentDate: -1 });
    
    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET appointments for a doctor on a specific date
router.get('/doctor/:doctorId/date/:date', async (req, res) => {
  try {
    const startDate = new Date(req.params.date);
    const endDate = new Date(req.params.date);
    endDate.setDate(endDate.getDate() + 1);
    
    const appointments = await Appointment.find({
      doctorId: req.params.doctorId,
      appointmentDate: { $gte: startDate, $lt: endDate }
    })
      .populate('patientId', 'name patientId phone')
      .select('-__v')
      .sort({ appointmentTime: 1 });
    
    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
