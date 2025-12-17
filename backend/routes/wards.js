import express from 'express';
import { Ward, BedAllocation } from '../models/Ward.js';
import { adminOnly, staffOrAdmin, authenticated } from '../middleware/auth.js';

const router = express.Router();

// ========== WARD ROUTES ==========

// GET all wards
router.get('/wards', authenticated, async (req, res) => {
  try {
    const { wardType, status } = req.query;
    const filter = {};
    
    if (wardType) filter.wardType = wardType;
    if (status) filter.status = status;
    
    const wards = await Ward.find(filter).sort({ floor: 1, wardName: 1 });
    res.json({ success: true, count: wards.length, data: wards });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create ward (Admin only)
router.post('/wards', adminOnly, async (req, res) => {
  try {
    const ward = await Ward.create(req.body);
    res.status(201).json({ success: true, data: ward });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT update ward
router.put('/wards/:id', adminOnly, async (req, res) => {
  try {
    const ward = await Ward.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!ward) {
      return res.status(404).json({ success: false, error: 'Ward not found' });
    }
    res.json({ success: true, data: ward });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ========== BED ALLOCATION ROUTES ==========

// GET all bed allocations
router.get('/allocations', authenticated, async (req, res) => {
  try {
    const { status, wardId } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (wardId) filter.wardId = wardId;
    
    const allocations = await BedAllocation.find(filter)
      .populate('patientId', 'name patientId phone')
      .populate('wardId', 'wardName wardType chargesPerDay')
      .populate('admittedBy', 'name specialization')
      .sort({ admissionDate: -1 });
    
    res.json({ success: true, count: allocations.length, data: allocations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET bed allocation by ID
router.get('/allocations/:id', authenticated, async (req, res) => {
  try {
    const allocation = await BedAllocation.findById(req.params.id)
      .populate('patientId')
      .populate('wardId')
      .populate('admittedBy');
    
    if (!allocation) {
      return res.status(404).json({ success: false, error: 'Allocation not found' });
    }
    res.json({ success: true, data: allocation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST admit patient (allocate bed)
router.post('/allocations', staffOrAdmin, async (req, res) => {
  try {
    const { wardId, patientId, bedNumber, admittedBy, reason } = req.body;
    
    // Check ward availability
    const ward = await Ward.findById(wardId);
    if (!ward) {
      return res.status(404).json({ success: false, error: 'Ward not found' });
    }
    
    if (ward.availableBeds <= 0) {
      return res.status(400).json({ success: false, error: 'No beds available in this ward' });
    }
    
    // Create allocation
    const allocation = await BedAllocation.create({
      patientId,
      wardId,
      bedNumber,
      admittedBy,
      reason,
      status: 'Admitted'
    });
    
    // Update ward available beds
    ward.availableBeds -= 1;
    await ward.save();
    
    const populated = await BedAllocation.findById(allocation._id)
      .populate('patientId', 'name patientId')
      .populate('wardId', 'wardName wardType');
    
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT discharge patient
router.put('/allocations/:id/discharge', staffOrAdmin, async (req, res) => {
  try {
    const allocation = await BedAllocation.findById(req.params.id);
    
    if (!allocation) {
      return res.status(404).json({ success: false, error: 'Allocation not found' });
    }
    
    if (allocation.status === 'Discharged') {
      return res.status(400).json({ success: false, error: 'Patient already discharged' });
    }
    
    // Calculate total days and charges
    const dischargeDate = new Date();
    const admissionDate = new Date(allocation.admissionDate);
    const totalDays = Math.ceil((dischargeDate - admissionDate) / (1000 * 60 * 60 * 24));
    
    const ward = await Ward.findById(allocation.wardId);
    const totalCharges = totalDays * ward.chargesPerDay;
    
    // Update allocation
    allocation.dischargeDate = dischargeDate;
    allocation.status = 'Discharged';
    allocation.totalDays = totalDays;
    allocation.totalCharges = totalCharges;
    await allocation.save();
    
    // Update ward available beds
    ward.availableBeds += 1;
    await ward.save();
    
    const populated = await BedAllocation.findById(allocation._id)
      .populate('patientId', 'name patientId')
      .populate('wardId', 'wardName wardType');
    
    res.json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT add daily note
router.put('/allocations/:id/notes', staffOrAdmin, async (req, res) => {
  try {
    const { note, recordedBy } = req.body;
    
    const allocation = await BedAllocation.findById(req.params.id);
    if (!allocation) {
      return res.status(404).json({ success: false, error: 'Allocation not found' });
    }
    
    allocation.dailyNotes.push({
      date: new Date(),
      note,
      recordedBy
    });
    
    await allocation.save();
    res.json({ success: true, data: allocation });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET currently admitted patients
router.get('/allocations/status/admitted', authenticated, async (req, res) => {
  try {
    const allocations = await BedAllocation.find({ status: 'Admitted' })
      .populate('patientId', 'name patientId phone')
      .populate('wardId', 'wardName wardType')
      .sort({ admissionDate: -1 });
    
    res.json({ success: true, count: allocations.length, data: allocations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
