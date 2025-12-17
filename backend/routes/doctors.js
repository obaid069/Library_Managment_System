import express from 'express';
import bcrypt from 'bcryptjs';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import { adminOnly, authenticated } from '../middleware/auth.js';

const router = express.Router();

// GET all doctors
router.get('/', async (req, res) => {
  try {
    const { specialization, department } = req.query;
    const filter = {};
    
    if (specialization) filter.specialization = specialization;
    if (department) filter.department = department;
    
    const doctors = await Doctor.find(filter).select('-__v');
    res.json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('-__v');
    if (!doctor) {
      return res.status(404).json({ success: false, error: 'Doctor not found' });
    }
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create doctor (Admin only)
router.post('/', adminOnly, async (req, res) => {
  try {
    const { password, email, name, phone, ...doctorData } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user account
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: 'doctor'
    });

    // Create doctor record
    const doctor = await Doctor.create({
      ...doctorData,
      name,
      email,
      phone,
      userId: user._id
    });

    res.status(201).json({ success: true, data: doctor });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT update doctor (Admin only)
router.put('/:id', adminOnly, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!doctor) {
      return res.status(404).json({ success: false, error: 'Doctor not found' });
    }
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE doctor (Admin only)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, error: 'Doctor not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
