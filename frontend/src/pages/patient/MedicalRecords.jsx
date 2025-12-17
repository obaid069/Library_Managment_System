import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import medicalRecordService from '../../services/medicalRecord.service';
import patientService from '../../services/patient.service';

export default function MedicalRecords() {
    const { user } = useAuth();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadMedicalRecords();
    }, [user]);

    const loadMedicalRecords = async () => {
        try {
            setLoading(true);
            // First get patient ID from user ID
            const patientResponse = await patientService.getPatientByUserId(user.id);
            const patientId = patientResponse.data._id;

            // Then fetch medical records
            const response = await medicalRecordService.getMedicalRecordsByPatient(patientId);
            setRecords(response.data || []);
        } catch (error) {
            console.error('Error loading medical records:', error);
        } finally {
            setLoading(false);
        }
    };

    const viewRecord = (record) => {
        setSelectedRecord(record);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedRecord(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading medical records...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
                        <p className="text-gray-600 mt-2">View your complete medical history</p>
                    </div>

                    {records.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📋</div>
                            <p className="text-xl text-gray-600">No medical records found</p>
                            <p className="text-gray-500 mt-2">Your medical records will appear here after doctor visits</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {records.map((record) => (
                                <div
                                    key={record._id}
                                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => viewRecord(record)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    {new Date(record.visitDate).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </h3>
                                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                    {record.visitType || 'Consultation'}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 mb-2">
                                                <span className="font-medium">Doctor:</span> {record.doctorId?.name || 'N/A'}
                                                {record.doctorId?.specialization && ` - ${record.doctorId.specialization}`}
                                            </p>
                                            <p className="text-gray-700">
                                                <span className="font-medium">Diagnosis:</span> {record.diagnosis || 'N/A'}
                                            </p>
                                        </div>
                                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                                            View Details →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal for detailed view */}
            {showModal && selectedRecord && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
                            <h2 className="text-2xl font-bold text-white">Medical Record Details</h2>
                            <button
                                onClick={closeModal}
                                className="absolute top-6 right-6 text-white hover:text-gray-200 text-3xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            {/* Visit Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Visit Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Visit Date</p>
                                        <p className="font-medium">
                                            {new Date(selectedRecord.visitDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Doctor</p>
                                        <p className="font-medium">{selectedRecord.doctorId?.name}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Symptoms */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Symptoms</h3>
                                <p className="text-gray-700">{selectedRecord.symptoms || 'N/A'}</p>
                            </div>

                            {/* Diagnosis */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Diagnosis</h3>
                                <p className="text-gray-700">{selectedRecord.diagnosis || 'N/A'}</p>
                            </div>

                            {/* Prescriptions */}
                            {selectedRecord.prescriptions && selectedRecord.prescriptions.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Prescriptions</h3>
                                    <div className="space-y-3">
                                        {selectedRecord.prescriptions.map((prescription, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                                <p className="font-medium text-gray-900">{prescription.medicine}</p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Dosage: {prescription.dosage} | Duration: {prescription.duration}
                                                </p>
                                                {prescription.instructions && (
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Instructions: {prescription.instructions}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Lab Tests */}
                            {selectedRecord.labTests && selectedRecord.labTests.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Lab Tests</h3>
                                    <div className="space-y-2">
                                        {selectedRecord.labTests.map((test, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg p-3">
                                                <p className="font-medium">{test.testName}</p>
                                                {test.result && <p className="text-sm text-gray-600">Result: {test.result}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Notes */}
                            {selectedRecord.notes && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Notes</h3>
                                    <p className="text-gray-700">{selectedRecord.notes}</p>
                                </div>
                            )}

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
