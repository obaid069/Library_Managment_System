import express from 'express';
import Billing from '../models/Billing.js';
import { authenticated, staffOrAdmin, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET all bills
router.get('/', authenticated, async (req, res) => {
  try {
    const { patientId, paymentStatus, paid } = req.query;
    const filter = {};
    
    if (patientId) filter.patientId = patientId;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (paid !== undefined) filter.paid = paid === 'true';
    
    const bills = await Billing.find(filter)
      .populate('patientId', 'name patientId phone')
      .populate('appointmentId', 'appointmentDate')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, count: bills.length, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET bill by ID
router.get('/:id', authenticated, async (req, res) => {
  try {
    const bill = await Billing.findById(req.params.id)
      .populate('patientId')
      .populate('appointmentId')
      .populate('charges.labTests.testId')
      .populate('charges.medicines.medicineId');
    
    if (!bill) {
      return res.status(404).json({ success: false, error: 'Bill not found' });
    }
    res.json({ success: true, data: bill });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST generate bill
router.post('/', staffOrAdmin, async (req, res) => {
  try {
    const billData = req.body;
    
    // Auto-calculate subtotal
    let subtotal = 0;
    
    // Consultation fee
    if (billData.charges?.consultationFee) {
      subtotal += billData.charges.consultationFee;
    }
    
    // Lab tests
    if (billData.charges?.labTests) {
      billData.charges.labTests.forEach(test => {
        subtotal += test.cost || 0;
      });
    }
    
    // Medicines
    if (billData.charges?.medicines) {
      billData.charges.medicines.forEach(med => {
        med.total = (med.quantity || 0) * (med.unitPrice || 0);
        subtotal += med.total;
      });
    }
    
    // Room charges
    if (billData.charges?.roomCharges) {
      billData.charges.roomCharges.total = 
        (billData.charges.roomCharges.days || 0) * 
        (billData.charges.roomCharges.ratePerDay || 0);
      subtotal += billData.charges.roomCharges.total;
    }
    
    // Other charges
    if (billData.charges?.otherCharges) {
      billData.charges.otherCharges.forEach(charge => {
        subtotal += charge.amount || 0;
      });
    }
    
    // Calculate total
    billData.subtotal = subtotal;
    billData.totalAmount = subtotal + (billData.tax || 0) - (billData.discount || 0);
    billData.amountDue = billData.totalAmount;
    
    const bill = await Billing.create(billData);
    const populated = await Billing.findById(bill._id)
      .populate('patientId', 'name patientId');
    
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT make payment
router.put('/:id/payment', staffOrAdmin, async (req, res) => {
  try {
    const { amountPaid, paymentMethod } = req.body;
    
    const bill = await Billing.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ success: false, error: 'Bill not found' });
    }
    
    bill.amountPaid = (bill.amountPaid || 0) + amountPaid;
    bill.paymentMethod = paymentMethod;
    
    if (bill.amountPaid >= bill.totalAmount) {
      bill.paymentDate = new Date();
    }
    
    await bill.save();
    
    res.json({ success: true, data: bill });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET unpaid bills
router.get('/status/unpaid', staffOrAdmin, async (req, res) => {
  try {
    const bills = await Billing.find({ 
      paymentStatus: { $in: ['Unpaid', 'Partial'] }
    })
      .populate('patientId', 'name patientId phone')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, count: bills.length, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET revenue statistics
router.get('/stats/revenue', adminOnly, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};
    
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const stats = await Billing.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalPaid: { $sum: '$amountPaid' },
          totalDue: { $sum: '$amountDue' },
          billCount: { $sum: 1 },
          paidBillCount: { $sum: { $cond: ['$paid', 1, 0] } }
        }
      }
    ]);
    
    res.json({ success: true, data: stats[0] || {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE bill (Admin only)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const bill = await Billing.findByIdAndDelete(req.params.id);
    if (!bill) {
      return res.status(404).json({ success: false, error: 'Bill not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
