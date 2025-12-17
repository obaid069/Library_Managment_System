import express from 'express';
import Medicine from '../models/Medicine.js';
import MedicalRecord from '../models/MedicalRecord.js';
import { staffOrAdmin, authenticated } from '../middleware/auth.js';

const router = express.Router();

// GET pending prescriptions (prescriptions not yet issued)
router.get('/pending', staffOrAdmin, async (req, res) => {
  try {
    const pendingPrescriptions = await MedicalRecord.find({
      'prescription.0': { $exists: true }, // Has at least one prescription item
    })
      .populate('patientId', 'name patientId phone')
      .populate('doctorId', 'name specialization')
      .populate('prescription.medicineId', 'name medicineId stockQuantity')
      .sort({ createdAt: -1 })
      .limit(50);
    
    // Filter only those with medicines not fully issued
    const pending = pendingPrescriptions.filter(record => 
      record.prescription.some(item => !item.issued)
    );
    
    res.json({ success: true, count: pending.length, data: pending });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT issue medicines from prescription
router.put('/issue/:recordId', staffOrAdmin, async (req, res) => {
  try {
    const { prescriptionItems } = req.body; // Array of { medicineId, quantity }
    
    const medicalRecord = await MedicalRecord.findById(req.params.recordId);
    if (!medicalRecord) {
      return res.status(404).json({ success: false, error: 'Medical record not found' });
    }
    
    const issuedMedicines = [];
    const errors = [];
    
    for (const item of prescriptionItems) {
      const medicine = await Medicine.findById(item.medicineId);
      
      if (!medicine) {
        errors.push(`Medicine ${item.medicineId} not found`);
        continue;
      }
      
      if (medicine.stockQuantity < item.quantity) {
        errors.push(`Insufficient stock for ${medicine.name}. Available: ${medicine.stockQuantity}, Required: ${item.quantity}`);
        continue;
      }
      
      // Reduce stock
      medicine.stockQuantity -= item.quantity;
      await medicine.save();
      
      // Mark as issued in prescription
      const prescriptionItem = medicalRecord.prescription.find(
        p => p.medicineId?.toString() === item.medicineId
      );
      
      if (prescriptionItem) {
        prescriptionItem.issued = true;
        prescriptionItem.issuedDate = new Date();
        prescriptionItem.issuedBy = req.user.name || 'Pharmacy Staff';
      }
      
      issuedMedicines.push({
        medicine: medicine.name,
        quantity: item.quantity,
        remaining: medicine.stockQuantity
      });
    }
    
    await medicalRecord.save();
    
    res.json({ 
      success: true, 
      message: 'Medicines issued successfully',
      issued: issuedMedicines,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET prescription by medical record ID
router.get('/prescription/:recordId', authenticated, async (req, res) => {
  try {
    const medicalRecord = await MedicalRecord.findById(req.params.recordId)
      .populate('patientId', 'name patientId')
      .populate('doctorId', 'name specialization')
      .populate('prescription.medicineId', 'name medicineId stockQuantity unitPrice');
    
    if (!medicalRecord) {
      return res.status(404).json({ success: false, error: 'Medical record not found' });
    }
    
    res.json({ success: true, data: medicalRecord });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
