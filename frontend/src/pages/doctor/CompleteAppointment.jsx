import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import appointmentService from '../../services/appointment.service';
import medicineService from '../../services/medicine.service';

export default function CompleteAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    diagnosis: '',
    symptoms: [],
    symptomInput: '',
    vitalSigns: {
      temperature: '',
      bloodPressure: '',
      heartRate: '',
      respiratoryRate: '',
      oxygenSaturation: ''
    },
    prescription: [],
    labTests: [],
    notes: '',
    admissionRequired: false,
    admissionDetails: {
      reason: '',
      ward: '',
      estimatedDuration: ''
    }
  });

  const [prescriptionItem, setPrescriptionItem] = useState({
    medicineId: '',
    dosage: '',
    frequency: '',
    duration: '',
    quantity: '',
    instructions: ''
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [apptData, medData] = await Promise.all([
        appointmentService.getAppointmentById(id),
        medicineService.getAllMedicines()
      ]);
      
      setAppointment(apptData.data);
      setMedicines(medData.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('vitalSigns.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        vitalSigns: {
          ...prev.vitalSigns,
          [field]: value
        }
      }));
    } else if (name.startsWith('admissionDetails.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        admissionDetails: {
          ...prev.admissionDetails,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const addSymptom = () => {
    if (formData.symptomInput.trim()) {
      setFormData(prev => ({
        ...prev,
        symptoms: [...prev.symptoms, prev.symptomInput.trim()],
        symptomInput: ''
      }));
    }
  };

  const removeSymptom = (index) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter((_, i) => i !== index)
    }));
  };

  const addPrescriptionItem = () => {
    if (!prescriptionItem.medicineId || !prescriptionItem.dosage || !prescriptionItem.quantity) {
      setError('Medicine, dosage, and quantity are required');
      return;
    }

    const medicine = medicines.find(m => m._id === prescriptionItem.medicineId);
    
    setFormData(prev => ({
      ...prev,
      prescription: [
        ...prev.prescription,
        {
          ...prescriptionItem,
          medicineName: medicine?.name || 'Unknown'
        }
      ]
    }));

    setPrescriptionItem({
      medicineId: '',
      dosage: '',
      frequency: '',
      duration: '',
      quantity: '',
      instructions: ''
    });
    setError('');
  };

  const removePrescriptionItem = (index) => {
    setFormData(prev => ({
      ...prev,
      prescription: prev.prescription.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await appointmentService.completeAppointment(id, formData);
      navigate('/doctor/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to complete appointment');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          Appointment not found
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Complete Appointment</h1>
        <p className="text-gray-600 mt-2">Patient: {appointment.patientId?.name}</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{appointment.patientId?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Patient ID</p>
              <p className="font-medium">{appointment.patientId?.patientId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium">{appointment.patientId?.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{appointment.patientId?.email}</p>
            </div>
          </div>
        </div>

        {/* Symptoms */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Symptoms</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={formData.symptomInput}
              onChange={(e) => setFormData({ ...formData, symptomInput: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Enter symptom"
            />
            <button
              type="button"
              onClick={addSymptom}
              className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.symptoms.map((symptom, index) => (
              <span
                key={index}
                className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {symptom}
                <button
                  type="button"
                  onClick={() => removeSymptom(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Vital Signs */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Vital Signs</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature (°F)
              </label>
              <input
                type="text"
                name="vitalSigns.temperature"
                value={formData.vitalSigns.temperature}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Pressure
              </label>
              <input
                type="text"
                name="vitalSigns.bloodPressure"
                value={formData.vitalSigns.bloodPressure}
                onChange={handleChange}
                placeholder="120/80"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heart Rate (bpm)
              </label>
              <input
                type="text"
                name="vitalSigns.heartRate"
                value={formData.vitalSigns.heartRate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Respiratory Rate
              </label>
              <input
                type="text"
                name="vitalSigns.respiratoryRate"
                value={formData.vitalSigns.respiratoryRate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Oxygen Saturation (%)
              </label>
              <input
                type="text"
                name="vitalSigns.oxygenSaturation"
                value={formData.vitalSigns.oxygenSaturation}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Diagnosis</h2>
          <textarea
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Enter diagnosis"
          />
        </div>

        {/* Prescription */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Prescription</h2>
          
          {/* Add Medicine Form */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medicine *
              </label>
              <select
                value={prescriptionItem.medicineId}
                onChange={(e) => setPrescriptionItem({ ...prescriptionItem, medicineId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="">Select Medicine</option>
                {medicines.map((med) => (
                  <option key={med._id} value={med._id}>
                    {med.name} (Stock: {med.stockQuantity})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dosage *
              </label>
              <input
                type="text"
                value={prescriptionItem.dosage}
                onChange={(e) => setPrescriptionItem({ ...prescriptionItem, dosage: e.target.value })}
                placeholder="e.g., 500mg"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency
              </label>
              <input
                type="text"
                value={prescriptionItem.frequency}
                onChange={(e) => setPrescriptionItem({ ...prescriptionItem, frequency: e.target.value })}
                placeholder="e.g., Twice daily"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <input
                type="text"
                value={prescriptionItem.duration}
                onChange={(e) => setPrescriptionItem({ ...prescriptionItem, duration: e.target.value })}
                placeholder="e.g., 7 days"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                value={prescriptionItem.quantity}
                onChange={(e) => setPrescriptionItem({ ...prescriptionItem, quantity: e.target.value })}
                placeholder="e.g., 14"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructions
              </label>
              <input
                type="text"
                value={prescriptionItem.instructions}
                onChange={(e) => setPrescriptionItem({ ...prescriptionItem, instructions: e.target.value })}
                placeholder="e.g., After meals"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={addPrescriptionItem}
            className="mb-4 px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
          >
            Add Medicine to Prescription
          </button>

          {/* Prescription List */}
          {formData.prescription.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Medicine</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Dosage</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Frequency</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.prescription.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 text-sm text-gray-900">{item.medicineName}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{item.dosage}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{item.frequency}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{item.duration}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{item.quantity}</td>
                      <td className="px-4 py-2">
                        <button
                          type="button"
                          onClick={() => removePrescriptionItem(idx)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Admission */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="admissionRequired"
              checked={formData.admissionRequired}
              onChange={handleChange}
              className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
            />
            <label className="ml-2 text-sm font-medium text-gray-900">
              Admission Required
            </label>
          </div>

          {formData.admissionRequired && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <input
                  type="text"
                  name="admissionDetails.reason"
                  value={formData.admissionDetails.reason}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ward
                </label>
                <input
                  type="text"
                  name="admissionDetails.ward"
                  value={formData.admissionDetails.ward}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Duration
                </label>
                <input
                  type="text"
                  name="admissionDetails.estimatedDuration"
                  value={formData.admissionDetails.estimatedDuration}
                  onChange={handleChange}
                  placeholder="e.g., 3 days"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Additional Notes</h2>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Any additional notes or observations"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-gray-900 text-white px-6 py-3 rounded font-medium hover:bg-gray-800 transition"
          >
            Complete Appointment
          </button>
          <button
            type="button"
            onClick={() => navigate('/doctor/dashboard')}
            className="px-6 py-3 border border-gray-300 rounded font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
