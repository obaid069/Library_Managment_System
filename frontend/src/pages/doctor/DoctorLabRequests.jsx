import React from 'react';

export default function DoctorLabRequests() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Lab Requests</h1>
                    <p className="text-gray-600 mt-2">Request and track laboratory tests</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="text-6xl mb-4">🔬</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Lab Requests Module</h2>
                    <p className="text-gray-600 mb-6">
                        This module will allow you to order laboratory tests, track results, and review patient lab history.
                    </p>
                    <p className="text-sm text-gray-500">Coming soon...</p>
                </div>
            </div>
        </div>
    );
}
