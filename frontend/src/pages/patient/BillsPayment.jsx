import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import billingService from '../../services/billing.service';
import patientService from '../../services/patient.service';

export default function BillsPayment() {
    const { user } = useAuth();
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBill, setSelectedBill] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState('all'); // all, paid, unpaid

    useEffect(() => {
        loadBills();
    }, [user]);

    const loadBills = async () => {
        try {
            setLoading(true);
            // Get patient ID
            const patientResponse = await patientService.getPatientByUserId(user.id);
            const patientId = patientResponse.data._id;

            // Get bills for this patient
            const response = await billingService.getBillsByPatient(patientId);
            setBills(response.data || []);
        } catch (error) {
            console.error('Error loading bills:', error);
        } finally {
            setLoading(false);
        }
    };

    const viewBill = (bill) => {
        setSelectedBill(bill);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedBill(null);
    };

    const filteredBills = bills.filter(bill => {
        if (filter === 'paid') return bill.paid || bill.paymentStatus === 'Paid';
        if (filter === 'unpaid') return !bill.paid && bill.paymentStatus !== 'Paid';
        return true;
    });

    const totalPaid = bills.filter(b => b.paid).reduce((sum, b) => sum + b.totalAmount, 0);
    const totalUnpaid = bills.filter(b => !b.paid).reduce((sum, b) => sum + b.totalAmount, 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading bills...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-gray-600 text-sm font-medium mb-2">Total Bills</h3>
                        <p className="text-3xl font-bold text-gray-900">{bills.length}</p>
                    </div>
                    <div className="bg-green-50 rounded-xl shadow-lg p-6">
                        <h3 className="text-green-700 text-sm font-medium mb-2">Total Paid</h3>
                        <p className="text-3xl font-bold text-green-700">₹{totalPaid.toFixed(2)}</p>
                    </div>
                    <div className="bg-red-50 rounded-xl shadow-lg p-6">
                        <h3 className="text-red-700 text-sm font-medium mb-2">Total Unpaid</h3>
                        <p className="text-3xl font-bold text-red-700">₹{totalUnpaid.toFixed(2)}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Bills & Payments</h1>
                            <p className="text-gray-600 mt-2">View and manage your medical bills</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('paid')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'paid'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                Paid
                            </button>
                            <button
                                onClick={() => setFilter('unpaid')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'unpaid'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                Unpaid
                            </button>
                        </div>
                    </div>

                    {filteredBills.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">💰</div>
                            <p className="text-xl text-gray-600">No bills found</p>
                            <p className="text-gray-500 mt-2">
                                {filter !== 'all'
                                    ? `No ${filter} bills to display`
                                    : 'Your bills and payments will appear here'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredBills.map((bill) => (
                                <div
                                    key={bill._id}
                                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => viewBill(bill)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    Bill #{bill.billId}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${bill.paid || bill.paymentStatus === 'Paid'
                                                        ? 'bg-green-100 text-green-800'
                                                        : bill.paymentStatus === 'Partial'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {bill.paymentStatus}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mb-2">
                                                Date: {new Date(bill.billDate).toLocaleDateString()}
                                            </p>
                                            <div className="flex gap-6">
                                                <p className="text-gray-700">
                                                    <span className="font-medium">Total:</span> ₹{bill.totalAmount.toFixed(2)}
                                                </p>
                                                {bill.amountPaid > 0 && (
                                                    <p className="text-green-600">
                                                        <span className="font-medium">Paid:</span> ₹{bill.amountPaid.toFixed(2)}
                                                    </p>
                                                )}
                                                {bill.amountDue > 0 && (
                                                    <p className="text-red-600">
                                                        <span className="font-medium">Due:</span> ₹{bill.amountDue.toFixed(2)}
                                                    </p>
                                                )}
                                            </div>
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

            {/* Bill Details Modal */}
            {showModal && selectedBill && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
                            <h2 className="text-2xl font-bold text-white">Bill Details</h2>
                            <p className="text-blue-100 mt-1">Bill #{selectedBill.billId}</p>
                            <button
                                onClick={closeModal}
                                className="absolute top-6 right-6 text-white hover:text-gray-200 text-3xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            {/* Bill Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Bill Date</p>
                                    <p className="font-medium">{new Date(selectedBill.billDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Status</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${selectedBill.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {selectedBill.paymentStatus}
                                    </span>
                                </div>
                            </div>

                            {/* Items */}
                            {selectedBill.items && selectedBill.items.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Items</h3>
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="text-left p-3 text-sm font-medium text-gray-700">Description</th>
                                                <th className="text-right p-3 text-sm font-medium text-gray-700">Qty</th>
                                                <th className="text-right p-3 text-sm font-medium text-gray-700">Price</th>
                                                <th className="text-right p-3 text-sm font-medium text-gray-700">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedBill.items.map((item, index) => (
                                                <tr key={index} className="border-b border-gray-200">
                                                    <td className="p-3 text-gray-900">{item.description}</td>
                                                    <td className="p-3 text-right text-gray-900">{item.quantity}</td>
                                                    <td className="p-3 text-right text-gray-900">₹{item.unitPrice.toFixed(2)}</td>
                                                    <td className="p-3 text-right text-gray-900">₹{item.total.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Charges Summary */}
                            <div className="border-t border-gray-200 pt-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Subtotal</span>
                                    <span className="font-medium">₹{selectedBill.subtotal.toFixed(2)}</span>
                                </div>
                                {selectedBill.tax > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Tax</span>
                                        <span className="font-medium">₹{selectedBill.tax.toFixed(2)}</span>
                                    </div>
                                )}
                                {selectedBill.discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span className="font-medium">-₹{selectedBill.discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                                    <span>Total Amount</span>
                                    <span>₹{selectedBill.totalAmount.toFixed(2)}</span>
                                </div>
                                {selectedBill.amountPaid > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Amount Paid</span>
                                        <span className="font-medium">₹{selectedBill.amountPaid.toFixed(2)}</span>
                                    </div>
                                )}
                                {selectedBill.amountDue > 0 && (
                                    <div className="flex justify-between text-red-600 text-lg font-bold">
                                        <span>Amount Due</span>
                                        <span>₹{selectedBill.amountDue.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Payment Info */}
                            {selectedBill.paid && selectedBill.paymentMethod && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h3 className="text-sm font-semibold text-green-900 mb-2">Payment Information</h3>
                                    <p className="text-sm text-green-800">
                                        Paid via {selectedBill.paymentMethod} on{' '}
                                        {new Date(selectedBill.paymentDate).toLocaleDateString()}
                                    </p>
                                </div>
                            )}

                            <div className="mt-8 flex justify-end gap-4">
                                {!selectedBill.paid && (
                                    <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
                                        Pay Now
                                    </button>
                                )}
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
