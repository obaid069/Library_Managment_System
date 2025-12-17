import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function StaffDashboard() {
  const { user } = useAuth();

  const menuItems = [
    { title: 'Register Patient', path: '/staff/register-patient', icon: '➕', description: 'Register new patient' },
    { title: 'Manage Patients', path: '/staff/patients', icon: '👥', description: 'Search and manage patients' },
    { title: 'Appointments', path: '/staff/appointments', icon: '📅', description: 'Schedule appointments' },
    { title: 'Ward Management', path: '/staff/wards', icon: '🛏️', description: 'Manage beds and wards' },
    { title: 'Lab Requests', path: '/staff/lab', icon: '🔬', description: 'Manage lab requests' },
    { title: 'Pharmacy', path: '/staff/pharmacy', icon: '💊', description: 'Manage prescriptions' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}</h1>
          <p className="text-gray-600 mt-2">Staff Dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="card hover:shadow-lg transition-shadow duration-200"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-900">Pending Admissions</h4>
            <p className="text-3xl font-bold text-blue-600 mt-2">5</p>
          </div>
          <div className="bg-green-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-900">Available Beds</h4>
            <p className="text-3xl font-bold text-green-600 mt-2">23</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-purple-900">Lab Reports Pending</h4>
            <p className="text-3xl font-bold text-purple-600 mt-2">12</p>
          </div>
        </div>
      </div>
    </div>
  );
}
