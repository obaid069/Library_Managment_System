import React from 'react';

export default function DoctorConsultations() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Consultations</h1>
                    <p className="text-gray-600 mt-2">Record patient consultations and medical notes</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="text-6xl mb-4">🩺</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Consultations Module</h2>
                    <p className="text-gray-600 mb-6">
                        This module will allow you to record detailed consultation notes, diagnoses, and treatment plans for your patients.
                    </p>
                    <p className="text-sm text-gray-500">Coming soon...</p>
                </div>
            </div>
        </div>
    );
}
