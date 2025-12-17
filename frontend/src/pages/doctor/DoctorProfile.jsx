import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import doctorService from '../../services/doctor.service';

export default function DoctorProfile() {
    const { user } = useAuth();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (user?.id) {
            loadDoctorProfile();
        }
    }, [user]);

    const loadDoctorProfile = async () => {
        try {
            // Get all doctors and find the one with matching email
            const response = await doctorService.getAllDoctors();
            const doctors = response.data || response;
            const currentDoctor = doctors.find(doc => doc.email === user.email);

            if (currentDoctor) {
                setDoctor(currentDoctor);
                setFormData(currentDoctor);
            }
        } catch (error) {
            console.error('Failed to load profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await doctorService.updateDoctor(doctor._id, formData);
            setDoctor(formData);
            setEditing(false);
            alert('Profile updated successfully!');
            loadDoctorProfile(); // Reload data
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile');
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-600 mt-2">View and edit your professional information</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    {!editing ? (
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Dr. {doctor?.name}</h2>
                                    <p className="text-gray-600">{doctor?.specialization}</p>
                                </div>
                                <button
                                    onClick={() => setEditing(true)}
                                    className="btn-primary !w-auto px-6"
                                >
                                    Edit Profile
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <p className="text-gray-900">{doctor?.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <p className="text-gray-900">{doctor?.phone}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                    <p className="text-gray-900">{doctor?.department}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                                    <p className="text-gray-900">{doctor?.experience} years</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee</label>
                                    <p className="text-gray-900">${doctor?.consultationFee}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                                    <p className="text-gray-900">{doctor?.qualification || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name || ''}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone || ''}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department || ''}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                                    <input
                                        type="text"
                                        name="qualification"
                                        value={formData.qualification || ''}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button type="submit" className="btn-primary">
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setEditing(false); setFormData(doctor); }}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
