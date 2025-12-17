import React, { useState, useEffect } from 'react';
import appointmentService from '../../services/appointment.service';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await appointmentService.getAllAppointments();
      setAppointments(data.data || data);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentService.cancelAppointment(id);
        loadAppointments();
      } catch (err) {
        alert('Failed to cancel appointment');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Appointments</h1>

        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="card text-center text-gray-600">
              No appointments found
            </div>
          ) : (
            appointments.map((appointment) => (
              <div key={appointment._id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Dr. {appointment.doctorId?.name || 'Unknown'}
                    </h3>
                    <p className="text-gray-600">
                      {appointment.doctorId?.specialization}
                    </p>
                    <div className="mt-4 space-y-2">
                      <p className="text-gray-700">
                        <span className="font-medium">Date:</span>{' '}
                        {new Date(appointment.appointmentDate).toLocaleDateString()}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Time:</span>{' '}
                        {appointment.appointmentTime}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Reason:</span>{' '}
                        {appointment.reason}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                    {appointment.status === 'scheduled' && (
                      <button
                        onClick={() => handleCancel(appointment._id)}
                        className="btn-danger"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
