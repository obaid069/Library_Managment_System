import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import appointmentService from '../../services/appointment.service';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    totalAppointments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadPatientStats();
    }
  }, [user]);

  const loadPatientStats = async () => {
    try {
      const appointments = await appointmentService.getAppointmentsByPatient(user.id);
      const upcoming = appointments.data?.filter(apt => 
        apt.status === 'scheduled' && new Date(apt.appointmentDate) >= new Date()
      ).length || 0;
      
      setStats({
        upcomingAppointments: upcoming,
        totalAppointments: appointments.data?.length || 0
      });
    } catch (error) {
      console.error('Failed to load patient stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { title: 'My Profile', path: '/patient/profile', icon: '👤', description: 'View and edit your profile' },
    { title: 'Book Appointment', path: '/patient/book-appointment', icon: '📅', description: 'Schedule a new appointment' },
    { title: 'My Appointments', path: '/patient/appointments', icon: '🗓️', description: 'View your appointments' },
    { title: 'Medical Records', path: '/patient/medical-records', icon: '📋', description: 'Access your medical history' },
    { title: 'Prescriptions', path: '/patient/prescriptions', icon: '💊', description: 'View your prescriptions' },
    { title: 'Bills & Payments', path: '/patient/bills', icon: '💰', description: 'View and pay bills' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}</h1>
          <p className="text-gray-600 mt-2">Patient Dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl hover:scale-105 transition-all duration-200 border border-gray-200"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 text-white rounded-xl shadow-lg p-6">
            <h4 className="text-lg font-semibold">Upcoming Appointments</h4>
            <p className="text-3xl font-bold mt-2">
              {loading ? '...' : stats.upcomingAppointments}
            </p>
          </div>
          <div className="bg-gray-800 text-white rounded-xl shadow-lg p-6">
            <h4 className="text-lg font-semibold">Total Appointments</h4>
            <p className="text-3xl font-bold mt-2">
              {loading ? '...' : stats.totalAppointments}
            </p>
          </div>
          <div className="bg-gray-700 text-white rounded-xl shadow-lg p-6">
            <h4 className="text-lg font-semibold">Active Prescriptions</h4>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
