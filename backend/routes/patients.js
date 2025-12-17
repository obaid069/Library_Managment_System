import express from 'express';
import Patient from '../models/Patient.js';
import { adminOnly, staffOrAdmin, authenticated } from '../middleware/auth.js';

const router = express.Router();

// GET all patients with optional filters (Staff or Admin)
router.get('/', staffOrAdmin, async (req, res) => {
  try {
    const { status, bloodGroup, gender } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (gender) filter.gender = gender;
    
    const patients = await Patient.find(filter).select('-__v');
    res.json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET patient by ID (Authenticated)
router.get('/:id', authenticated, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).select('-__v');
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create patient (Staff or Admin)
router.post('/', staffOrAdmin, async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json({ success: true, data: patient });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT update patient (Staff or Admin)
router.put('/:id', staffOrAdmin, async (req, res) => {
  try {
    req.body.updatedAt = Date.now();
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE patient (Admin only)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET patient statistics by blood group
router.get('/stats/bloodgroups', async (req, res) => {
  try {
    const bloodGroups = await Patient.aggregate([
      {
        $group: {
          _id: '$bloodGroup',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    res.json({ success: true, data: bloodGroups });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
