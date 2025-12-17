import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import appointmentService from '../../services/appointment.service';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadDoctorStats();
    }
  }, [user]);

  const loadDoctorStats = async () => {
    try {
      const appointments = await appointmentService.getAppointmentsByDoctor(user.id);
      const today = new Date().toDateString();
      const todayAppointments = appointments.data?.filter(apt => 
        new Date(apt.appointmentDate).toDateString() === today
      ) || [];
      
      setStats({
        totalAppointments: todayAppointments.length,
        completedAppointments: todayAppointments.filter(apt => apt.status === 'completed').length,
        pendingAppointments: todayAppointments.filter(apt => apt.status === 'scheduled').length
      });
    } catch (error) {
      console.error('Failed to load doctor stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { title: 'My Appointments', path: '/doctor/appointments', icon: '📅', description: 'View daily schedule' },
    { title: 'Patient Records', path: '/doctor/patients', icon: '👥', description: 'Access patient records' },
    { title: 'Consultations', path: '/doctor/consultations', icon: '🩺', description: 'Record consultations' },
    { title: 'Prescriptions', path: '/doctor/prescriptions', icon: '💊', description: 'Create prescriptions' },
    { title: 'Lab Requests', path: '/doctor/lab-requests', icon: '🔬', description: 'Request lab tests' },
    { title: 'My Profile', path: '/doctor/profile', icon: '👤', description: 'View and edit profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, Dr. {user.name}</h1>
          <p className="text-gray-600 mt-2">Doctor Dashboard</p>
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

        {/* Today's Schedule */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Today's Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-900 text-white rounded-xl shadow-lg p-6">
              <h4 className="text-lg font-semibold">Total Appointments</h4>
              <p className="text-3xl font-bold mt-2">{loading ? '...' : stats.totalAppointments}</p>
            </div>
            <div className="bg-gray-800 text-white rounded-xl shadow-lg p-6">
              <h4 className="text-lg font-semibold">Completed</h4>
              <p className="text-3xl font-bold mt-2">{loading ? '...' : stats.completedAppointments}</p>
            </div>
            <div className="bg-gray-700 text-white rounded-xl shadow-lg p-6">
              <h4 className="text-lg font-semibold">Pending</h4>
              <p className="text-3xl font-bold mt-2">{loading ? '...' : stats.pendingAppointments}</p>
            </div>
            <div className="bg-gray-600 text-white rounded-xl shadow-lg p-6">
              <h4 className="text-lg font-semibold">Total Patients</h4>
              <p className="text-3xl font-bold mt-2">{loading ? '...' : stats.totalAppointments}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
