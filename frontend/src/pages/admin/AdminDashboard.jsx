import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import reportService from '../../services/report.service';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    todayAppointments: 0,
    scheduledAppointments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const response = await reportService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const adminMenuItems = [
    { 
      title: 'Manage Patients', 
      path: '/admin/patients', 
      icon: '👥', 
      description: 'Add, Edit, Delete Patients',
      color: 'bg-gray-900'
    },
    { 
      title: 'Manage Doctors', 
      path: '/admin/doctors', 
      icon: '⚕️', 
      description: 'Add, Edit, Delete Doctors',
      color: 'bg-gray-800'
    },
    { 
      title: 'Manage Appointments', 
      path: '/admin/appointments', 
      icon: '📅', 
      description: 'View & Manage All Appointments',
      color: 'bg-gray-700'
    },
    { 
      title: 'Medical Records', 
      path: '/admin/medical-records', 
      icon: '📋', 
      description: 'View All Medical Records',
      color: 'bg-gray-900'
    },
    { 
      title: 'Billing & Payments', 
      path: '/admin/billing', 
      icon: '💰', 
      description: 'Manage All Bills',
      color: 'bg-gray-800'
    },
    { 
      title: 'Reports & Analytics', 
      path: '/admin/reports', 
      icon: '📊', 
      description: 'System Reports & Statistics',
      color: 'bg-gray-700'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name || 'Administrator'}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : stats.totalPatients}
                </p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Doctors</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : stats.totalDoctors}
                </p>
              </div>
              <div className="text-4xl">⚕️</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Appointments</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : stats.todayAppointments}
                </p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-black">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled Appointments</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : stats.scheduledAppointments}
                </p>
              </div>
              <div className="text-4xl">📋</div>
            </div>
          </div>
        </div>

        {/* Admin Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${item.color} text-white rounded-xl shadow-lg p-8 hover:scale-105 hover:shadow-2xl transition-all duration-200`}
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-200">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
