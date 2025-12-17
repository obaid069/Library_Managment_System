import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import appointmentService from '../../services/appointment.service';
import { Link } from 'react-router-dom';

export default function DoctorAppointments() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, today, upcoming

    useEffect(() => {
        if (user?.id) {
            loadAppointments();
        }
    }, [user, filter]);

    const loadAppointments = async () => {
        try {
            const response = await appointmentService.getAppointmentsByDoctor(user.id);
            let filtered = response.data || [];

            const today = new Date().toDateString();
            if (filter === 'today') {
                filtered = filtered.filter(apt => new Date(apt.appointmentDate).toDateString() === today);
            } else if (filter === 'upcoming') {
                filtered = filtered.filter(apt => new Date(apt.appointmentDate) >= new Date());
            }

            setAppointments(filtered);
        } catch (error) {
            console.error('Failed to load appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
                    <p className="text-gray-600 mt-2">Manage your appointments</p>
                </div>

                <div className="mb-6 flex gap-4">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-6 py-2 rounded-lg font-medium ${filter === 'all' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('today')}
                        className={`px-6 py-2 rounded-lg font-medium ${filter === 'today' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}
                    >
                        Today
                    </button>
                    <button
                        onClick={() => setFilter('upcoming')}
                        className={`px-6 py-2 rounded-lg font-medium ${filter === 'upcoming' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}
                    >
                        Upcoming
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {appointments.map((apt) => (
                                <tr key={apt._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(apt.appointmentDate).toLocaleDateString()} {apt.appointmentTime}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {apt.patientId?.name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{apt.reason}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(apt.status)}`}>
                                            {apt.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {apt.status === 'scheduled' && (
                                            <Link
                                                to={`/doctor/appointment/complete/${apt._id}`}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Complete
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {appointments.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No appointments found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
