import React, { useEffect, useState } from 'react';
import patientService from '../services/patient.service';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await patientService.getAllPatients();
      setPatients(data.data || data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load patients:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading patients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Patients</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {patients.map((patient) => (
          <div key={patient._id} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">{patient.name}</h2>
            <p className="text-gray-600">ID: {patient.patientId}</p>
            <p className="text-gray-600">Phone: {patient.phone}</p>
            <p className="text-gray-600">Email: {patient.email}</p>
            <p className="text-gray-600">Blood Group: {patient.bloodGroup}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
