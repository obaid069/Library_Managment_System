import express from 'express';
import LabTest from '../models/LabTest.js';
import { authenticated, doctorOnly, staffOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET all lab tests
router.get('/', authenticated, async (req, res) => {
  try {
    const { status, patientId, priority } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (patientId) filter.patientId = patientId;
    if (priority) filter.priority = priority;
    
    const labTests = await LabTest.find(filter)
      .populate('patientId', 'name patientId')
      .populate('doctorId', 'name specialization')
      .sort({ requestedDate: -1 });
    
    res.json({ success: true, count: labTests.length, data: labTests });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET lab test by ID
router.get('/:id', authenticated, async (req, res) => {
  try {
    const labTest = await LabTest.findById(req.params.id)
      .populate('patientId')
      .populate('doctorId')
      .populate('appointmentId');
    
    if (!labTest) {
      return res.status(404).json({ success: false, error: 'Lab test not found' });
    }
    res.json({ success: true, data: labTest });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create lab test request (Doctor only)
router.post('/', doctorOnly, async (req, res) => {
  try {
    const labTest = await LabTest.create(req.body);
    const populated = await LabTest.findById(labTest._id)
      .populate('patientId', 'name patientId')
      .populate('doctorId', 'name');
    
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT update lab test results (Staff)
router.put('/:id/results', staffOrAdmin, async (req, res) => {
  try {
    const { results, observations, resultValue, isAbnormal, labTechnician } = req.body;
    
    const labTest = await LabTest.findByIdAndUpdate(
      req.params.id,
      {
        results,
        observations,
        resultValue,
        isAbnormal,
        labTechnician,
        status: 'Completed',
        completedDate: new Date()
      },
      { new: true, runValidators: true }
    ).populate('patientId', 'name patientId').populate('doctorId', 'name');
    
    if (!labTest) {
      return res.status(404).json({ success: false, error: 'Lab test not found' });
    }
    
    res.json({ success: true, data: labTest });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT update lab test status
router.put('/:id/status', staffOrAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    const labTest = await LabTest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!labTest) {
      return res.status(404).json({ success: false, error: 'Lab test not found' });
    }
    
    res.json({ success: true, data: labTest });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET pending lab tests
router.get('/status/pending', staffOrAdmin, async (req, res) => {
  try {
    const labTests = await LabTest.find({ status: 'Pending' })
      .populate('patientId', 'name patientId')
      .populate('doctorId', 'name')
      .sort({ priority: -1, requestedDate: 1 });
    
    res.json({ success: true, count: labTests.length, data: labTests });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE lab test
router.delete('/:id', doctorOnly, async (req, res) => {
  try {
    const labTest = await LabTest.findByIdAndDelete(req.params.id);
    if (!labTest) {
      return res.status(404).json({ success: false, error: 'Lab test not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
