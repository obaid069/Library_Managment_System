import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import medicalRecordService from '../../services/medicalRecord.service';
import patientService from '../../services/patient.service';

export default function Prescriptions() {
    const { user } = useAuth();
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPrescriptions();
    }, [user]);

    const loadPrescriptions = async () => {
        try {
            setLoading(true);
            // Get patient ID
            const patientResponse = await patientService.getPatientByUserId(user.id);
            const patientId = patientResponse.data._id;

            // Get medical records
            const response = await medicalRecordService.getMedicalRecordsByPatient(patientId);
            const records = response.data || [];

            // Extract prescriptions from all records
            const allPrescriptions = [];
            records.forEach(record => {
                if (record.prescriptions && record.prescriptions.length > 0) {
                    record.prescriptions.forEach(prescription => {
                        allPrescriptions.push({
                            ...prescription,
                            visitDate: record.visitDate,
                            doctor: record.doctorId?.name,
                            diagnosis: record.diagnosis
                        });
                    });
                }
            });

            setPrescriptions(allPrescriptions);
        } catch (error) {
            console.error('Error loading prescriptions:', error);
        } finally {
            setLoading(false);
        }
    };

    const printPrescription = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading prescriptions...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Prescriptions</h1>
                            <p className="text-gray-600 mt-2">All your prescribed medications</p>
                        </div>
                        {prescriptions.length > 0 && (
                            <button
                                onClick={printPrescription}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold print:hidden"
                            >
                                🖨️ Print All
                            </button>
                        )}
                    </div>

                    {prescriptions.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">💊</div>
                            <p className="text-xl text-gray-600">No prescriptions found</p>
                            <p className="text-gray-500 mt-2">Your prescribed medications will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {prescriptions.map((prescription, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                                {prescription.medicine}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Prescribed on {new Date(prescription.visitDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                            Active
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Dosage</p>
                                            <p className="font-medium text-gray-900">{prescription.dosage}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Duration</p>
                                            <p className="font-medium text-gray-900">{prescription.duration}</p>
                                        </div>
                                        {prescription.doctor && (
                                            <div>
                                                <p className="text-sm text-gray-600">Prescribed by</p>
                                                <p className="font-medium text-gray-900">Dr. {prescription.doctor}</p>
                                            </div>
                                        )}
                                        {prescription.diagnosis && (
                                            <div>
                                                <p className="text-sm text-gray-600">For</p>
                                                <p className="font-medium text-gray-900">{prescription.diagnosis}</p>
                                            </div>
                                        )}
                                    </div>

                                    {prescription.instructions && (
                                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
                                            <p className="text-sm font-medium text-blue-900 mb-1">Instructions</p>
                                            <p className="text-sm text-blue-800">{prescription.instructions}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
