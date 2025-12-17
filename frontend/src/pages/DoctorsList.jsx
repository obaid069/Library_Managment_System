import React, { useState, useEffect } from 'react';
import doctorService from '../services/doctor.service';
import { useNavigate } from 'react-router-dom';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const navigate = useNavigate();

  const specializations = [
    'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 
    'Dermatology', 'Gynecology', 'Psychiatry', 'Radiology',
    'General Surgery', 'Internal Medicine'
  ];

  const departments = [
    'Emergency', 'ICU', 'OPD', 'Surgery', 'Pediatrics',
    'Cardiology', 'Neurology', 'Orthopedics', 'Radiology'
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [doctors, searchTerm, selectedSpecialization, selectedDepartment]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorService.getAllDoctors();
      setDoctors(response.data);
      setFilteredDoctors(response.data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load doctors');
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = [...doctors];

    // Search by name or license number
    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by specialization
    if (selectedSpecialization) {
      filtered = filtered.filter(doctor => doctor.specialization === selectedSpecialization);
    }

    // Filter by department
    if (selectedDepartment) {
      filtered = filtered.filter(doctor => doctor.department === selectedDepartment);
    }

    setFilteredDoctors(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialization('');
    setSelectedDepartment('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading doctors...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Our Doctors</h1>
          <p className="text-gray-400">Browse and find the right specialist for your needs</p>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search Doctor
              </label>
              <input
                type="text"
                placeholder="Name, Email, License..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>

            {/* Specialization Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Specialization
              </label>
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
              >
                <option value="">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-gray-400">
            Showing {filteredDoctors.length} of {doctors.length} doctors
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <p className="text-gray-400 text-lg">No doctors found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor._id}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition border border-gray-700 hover:border-gray-600"
              >
                {/* Doctor Info */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Dr. {doctor.name}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-300">
                      <span className="text-sm font-medium mr-2">Specialization:</span>
                      <span className="text-sm bg-white/10 px-2 py-1 rounded">
                        {doctor.specialization}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <span className="text-sm font-medium mr-2">Department:</span>
                      <span className="text-sm bg-gray-700 px-2 py-1 rounded">
                        {doctor.department}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="border-t border-gray-700 pt-4 mb-4 space-y-2">
                  <div className="flex items-center text-gray-400 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {doctor.email}
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {doctor.phone}
                  </div>
                </div>

                {/* Experience & Fee */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-700/50 rounded p-3 text-center">
                    <div className="text-2xl font-bold text-white">
                      {doctor.experience}
                    </div>
                    <div className="text-xs text-gray-400">Years Exp.</div>
                  </div>
                  <div className="bg-gray-700/50 rounded p-3 text-center">
                    <div className="text-2xl font-bold text-white">
                      ${doctor.consultationFee}
                    </div>
                    <div className="text-xs text-gray-400">Consultation</div>
                  </div>
                </div>

                {/* Availability */}
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-2">Available Days:</p>
                  <div className="flex flex-wrap gap-1">
                    {doctor.availability.map((day, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>

                {/* License Number */}
                <div className="text-xs text-gray-500 mb-4">
                  License: {doctor.licenseNumber}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => navigate('/patient/book-appointment', { state: { selectedDoctor: doctor } })}
                  className="w-full bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;
