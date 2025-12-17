import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to={`/${user.role}/dashboard`}>
              <h1 className="text-xl font-bold text-white">🏥 Hospital Management</h1>
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/doctors" 
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Browse Doctors
              </Link>
              {user.role === 'patient' && (
                <>
                  <Link 
                    to="/patient/book-appointment" 
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    Book Appointment
                  </Link>
                  <Link 
                    to="/patient/appointments" 
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    My Appointments
                  </Link>
                </>
              )}
              {user.role === 'admin' && (
                <>
                  <Link 
                    to="/admin/patients" 
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    Patients
                  </Link>
                  <Link 
                    to="/admin/doctors" 
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    Doctors
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-gray-300">
              {user.name} ({user.role})
            </span>
            <button 
              onClick={handleLogout} 
              className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded-lg border border-gray-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
