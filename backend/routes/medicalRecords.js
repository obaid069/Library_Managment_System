import express from 'express';
import MedicalRecord from '../models/MedicalRecord.js';
import { authenticated } from '../middleware/auth.js';

const router = express.Router();

// GET medical records by patient ID
router.get('/patient/:patientId', authenticated, async (req, res) => {
    try {
        const records = await MedicalRecord.find({ patientId: req.params.patientId })
            .populate('doctorId', 'name specialization')
            .populate('appointmentId')
            .sort({ visitDate: -1 });

        res.json({ success: true, data: records });
    } catch (error) {
        console.error('Error fetching medical records:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET single medical record by ID
router.get('/:id', authenticated, async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.id)
            .populate('doctorId', 'name specialization')
            .populate('patientId', 'name email phone');

        if (!record) {
            return res.status(404).json({ success: false, message: 'Medical record not found' });
        }

        res.json({ success: true, data: record });
    } catch (error) {
        console.error('Error fetching medical record:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
