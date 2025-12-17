import express from 'express';
import Medicine from '../models/Medicine.js';
import { adminOnly, staffOrAdmin, authenticated } from '../middleware/auth.js';

const router = express.Router();

// GET all medicines
router.get('/', authenticated, async (req, res) => {
  try {
    const { category, status, search } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { genericName: { $regex: search, $options: 'i' } },
        { medicineId: { $regex: search, $options: 'i' } }
      ];
    }
    
    const medicines = await Medicine.find(filter).sort({ name: 1 });
    res.json({ success: true, count: medicines.length, data: medicines });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET medicine by ID
router.get('/:id', authenticated, async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ success: false, error: 'Medicine not found' });
    }
    res.json({ success: true, data: medicine });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST add new medicine (Admin only)
router.post('/', adminOnly, async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json({ success: true, data: medicine });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT update medicine stock
router.put('/:id/stock', staffOrAdmin, async (req, res) => {
  try {
    const { quantity, operation } = req.body; // operation: 'add' or 'subtract'
    const medicine = await Medicine.findById(req.params.id);
    
    if (!medicine) {
      return res.status(404).json({ success: false, error: 'Medicine not found' });
    }
    
    if (operation === 'add') {
      medicine.stockQuantity += quantity;
    } else if (operation === 'subtract') {
      medicine.stockQuantity = Math.max(0, medicine.stockQuantity - quantity);
    }
    
    await medicine.save();
    res.json({ success: true, data: medicine });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT issue medicine (reduce stock)
router.put('/:id/issue', staffOrAdmin, async (req, res) => {
  try {
    const { quantity, patientId } = req.body;
    const medicine = await Medicine.findById(req.params.id);
    
    if (!medicine) {
      return res.status(404).json({ success: false, error: 'Medicine not found' });
    }
    
    if (medicine.stockQuantity < quantity) {
      return res.status(400).json({ success: false, error: 'Insufficient stock' });
    }
    
    medicine.stockQuantity -= quantity;
    await medicine.save();
    
    res.json({ 
      success: true, 
      message: 'Medicine issued successfully',
      data: medicine 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE medicine
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) {
      return res.status(404).json({ success: false, error: 'Medicine not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET low stock medicines
router.get('/status/low-stock', authenticated, async (req, res) => {
  try {
    const medicines = await Medicine.find({ 
      $or: [
        { status: 'Low Stock' },
        { status: 'Out of Stock' }
      ]
    }).sort({ stockQuantity: 1 });
    
    res.json({ success: true, count: medicines.length, data: medicines });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET expired medicines
router.get('/status/expired', authenticated, async (req, res) => {
  try {
    const medicines = await Medicine.find({ 
      expiryDate: { $lt: new Date() }
    }).sort({ expiryDate: 1 });
    
    res.json({ success: true, count: medicines.length, data: medicines });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
