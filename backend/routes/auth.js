import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import { adminOnly } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-hospital-2024';

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Get role-specific record ID
    let roleId = user._id;
    
    if (user.role === 'patient') {
      const patient = await Patient.findOne({ userId: user._id });
      if (patient) {
        roleId = patient._id;
      }
    } else if (user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: user._id });
      if (doctor) {
        roleId = doctor._id;
      }
    }
    // For staff and admin, use user._id as they don't have separate collections

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: roleId, // Use role-specific ID
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data with token
    const userData = {
      id: roleId, // Use role-specific ID
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    };

    res.json({ 
      success: true, 
      data: userData,
      token,
      message: 'Login successful' 
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Register (for patients)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, dateOfBirth, gender, bloodGroup } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role: 'patient'
    });

    await user.save();

    // Generate patient ID
    const patientCount = await Patient.countDocuments();
    const patientId = `PAT${String(patientCount + 1).padStart(5, '0')}`;

    // Create patient record
    const patient = new Patient({
      name,
      email,
      phone,
      dateOfBirth: dateOfBirth || new Date(),
      gender: gender || 'Male',
      bloodGroup: bloodGroup || '',
      patientId,
      userId: user._id,
      medicalHistory: []
    });

    await patient.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role,
        patientId: patient._id
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      patientId: patient._id
    };

    res.status(201).json({ 
      success: true, 
      data: userData,
      token,
      message: 'Registration successful' 
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all users (admin only)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
