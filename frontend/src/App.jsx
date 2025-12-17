import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import ChangePassword from './pages/ChangePassword';
import DoctorsList from './pages/DoctorsList';

// Patient pages
import PatientDashboard from './pages/patient/PatientDashboard';
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';
import MyProfile from './pages/patient/MyProfile';
import MedicalRecords from './pages/patient/MedicalRecords';
import Prescriptions from './pages/patient/Prescriptions';
import BillsPayment from './pages/patient/BillsPayment';

// Doctor pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import CompleteAppointment from './pages/doctor/CompleteAppointment';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorPatients from './pages/doctor/DoctorPatients';
import DoctorConsultations from './pages/doctor/DoctorConsultations';
import DoctorPrescriptions from './pages/doctor/DoctorPrescriptions';
import DoctorLabRequests from './pages/doctor/DoctorLabRequests';
import DoctorProfile from './pages/doctor/DoctorProfile';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagePatients from './pages/admin/ManagePatients';
import ManageDoctors from './pages/admin/ManageDoctors';
import AddPatient from './pages/admin/AddPatient';
import AddDoctor from './pages/admin/AddDoctor';

// Staff pages
import StaffDashboard from './pages/staff/StaffDashboard';
import PharmacyManagement from './pages/staff/PharmacyManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes - No Layout/Sidebar */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Doctors List - Accessible to all authenticated users */}
          <Route
            path="/doctors"
            element={
              <ProtectedRoute allowedRoles={['patient', 'doctor', 'admin', 'staff']}>
                <Layout>
                  <DoctorsList />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Patient Routes */}
          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Layout>
                  <PatientDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/book-appointment"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Layout>
                  <BookAppointment />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/appointments"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Layout>
                  <MyAppointments />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/profile"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Layout>
                  <MyProfile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/medical-records"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Layout>
                  <MedicalRecords />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/prescriptions"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Layout>
                  <Prescriptions />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/bills"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Layout>
                  <BillsPayment />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <Layout>
                  <DoctorDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/appointment/complete/:id"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <Layout>
                  <CompleteAppointment />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/appointments"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <Layout>
                  <DoctorAppointments />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/patients"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <Layout>
                  <DoctorPatients />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/consultations"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <Layout>
                  <DoctorConsultations />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/prescriptions"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <Layout>
                  <DoctorPrescriptions />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/lab-requests"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <Layout>
                  <DoctorLabRequests />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/profile"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <Layout>
                  <DoctorProfile />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/patients"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <ManagePatients />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/patients/add"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <AddPatient />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/doctors"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <ManageDoctors />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/doctors/add"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <AddDoctor />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Staff Routes */}
          <Route
            path="/staff/dashboard"
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <Layout>
                  <StaffDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/pharmacy"
            element={
              <ProtectedRoute allowedRoles={['staff', 'admin']}>
                <Layout>
                  <PharmacyManagement />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 404 */}
          <Route path="*" element={<div className="flex items-center justify-center min-h-screen"><h1 className="text-2xl">404 - Page Not Found</h1></div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

