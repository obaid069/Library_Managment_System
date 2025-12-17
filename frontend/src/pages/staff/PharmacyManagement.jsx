import { useState, useEffect } from 'react';
import pharmacyService from '../../services/pharmacy.service';
import medicineService from '../../services/medicine.service';

export default function PharmacyManagement() {
  const [pendingPrescriptions, setPendingPrescriptions] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('prescriptions'); // prescriptions, inventory

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'prescriptions') {
        const data = await pharmacyService.getPendingPrescriptions();
        setPendingPrescriptions(data.data || []);
      } else {
        const data = await medicineService.getAllMedicines();
        setMedicines(data.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleIssueMedicine = async (record) => {
    try {
      setError('');
      setSuccess('');
      
      // Prepare prescription items to issue (only non-issued ones)
      const itemsToIssue = record.prescription
        .filter(item => !item.issued)
        .map(item => ({
          medicineId: item.medicineId._id,
          quantity: item.quantity
        }));

      if (itemsToIssue.length === 0) {
        setError('All medicines already issued');
        return;
      }

      const result = await pharmacyService.issueMedicines(record._id, itemsToIssue);
      
      if (result.success) {
        setSuccess(`Medicines issued successfully for patient ${record.patientId.name}`);
        fetchData(); // Refresh list
        setSelectedRecord(null);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to issue medicines');
    }
  };

  const getStockStatus = (medicine) => {
    if (medicine.stockQuantity === 0) return 'Out of Stock';
    if (medicine.stockQuantity <= medicine.reorderLevel) return 'Low Stock';
    return 'In Stock';
  };

  const getStockColor = (medicine) => {
    if (medicine.stockQuantity === 0) return 'text-red-600';
    if (medicine.stockQuantity <= medicine.reorderLevel) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pharmacy Management</h1>
        <p className="text-gray-600 mt-2">Manage prescriptions and inventory</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'prescriptions'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending Prescriptions
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'inventory'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Medicine Inventory
          </button>
        </nav>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      ) : activeTab === 'prescriptions' ? (
        <div className="space-y-6">
          {pendingPrescriptions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No pending prescriptions</p>
            </div>
          ) : (
            pendingPrescriptions.map((record) => (
              <div key={record._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {record.patientId?.name}
                    </h3>
                    <p className="text-sm text-gray-600">ID: {record.patientId?.patientId}</p>
                    <p className="text-sm text-gray-600">Doctor: {record.doctorId?.name} ({record.doctorId?.specialization})</p>
                    <p className="text-sm text-gray-600">Date: {new Date(record.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {/* Diagnosis */}
                {record.diagnosis && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700">Diagnosis:</p>
                    <p className="text-sm text-gray-600">{record.diagnosis}</p>
                  </div>
                )}

                {/* Prescription Items */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Prescribed Medicines:</p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Medicine</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Dosage</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Frequency</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {record.prescription?.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {item.medicineId?.name || 'N/A'}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600">{item.dosage}</td>
                            <td className="px-4 py-2 text-sm text-gray-600">{item.frequency}</td>
                            <td className="px-4 py-2 text-sm text-gray-600">{item.duration}</td>
                            <td className="px-4 py-2 text-sm text-gray-600">{item.quantity}</td>
                            <td className="px-4 py-2 text-sm text-gray-600">
                              {item.medicineId?.stockQuantity || 0}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {item.issued ? (
                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                  Issued
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                                  Pending
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Issue Button */}
                {record.prescription?.some(item => !item.issued) && (
                  <button
                    onClick={() => handleIssueMedicine(record)}
                    className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                  >
                    Issue All Medicines
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        /* Inventory Tab */
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medicine ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reorder Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {medicines.map((medicine) => (
                  <tr key={medicine._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {medicine.medicineId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {medicine.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {medicine.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {medicine.stockQuantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {medicine.reorderLevel}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getStockColor(medicine)}`}>
                      {getStockStatus(medicine)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {medicine.expiryDate ? new Date(medicine.expiryDate).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
