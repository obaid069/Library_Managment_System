import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import doctorRoutes from './routes/doctors.js';
import patientRoutes from './routes/patients.js';
import appointmentRoutes from './routes/appointments.js';
import reportRoutes from './routes/reports.js';
import medicineRoutes from './routes/medicines.js';
import labTestRoutes from './routes/labtests.js';
import wardRoutes from './routes/wards.js';
import billingRoutes from './routes/billing.js';
import pharmacyRoutes from './routes/pharmacy.js';
// Load environment variables
dotenv.config();

await connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/labtests', labTestRoutes);
app.use('/api/wards', wardRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Hospital Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      doctors: '/api/doctors',
      patients: '/api/patients',
      appointments: '/api/appointments',
      reports: '/api/reports',
      medicines: '/api/medicines',
      labTests: '/api/labtests',
      wards: '/api/wards',
      billing: '/api/billing',
      pharmacy: '/api/pharmacy'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🏥 Server running on port ${PORT}`);
  console.log(`🩺 Hospital Management System API`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/reports/dashboard\n`);
});

export default app;
