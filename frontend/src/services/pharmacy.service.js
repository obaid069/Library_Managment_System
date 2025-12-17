import api from './api.service';

const pharmacyService = {
  // Get pending prescriptions
  getPendingPrescriptions: async () => {
    const response = await api.get('/pharmacy/pending');
    return response.data;
  },

  // Issue medicines from prescription
  issueMedicines: async (recordId, prescriptionItems) => {
    const response = await api.put(`/pharmacy/issue/${recordId}`, {
      prescriptionItems
    });
    return response.data;
  },

  // Get prescription by medical record ID
  getPrescription: async (recordId) => {
    const response = await api.get(`/pharmacy/prescription/${recordId}`);
    return response.data;
  }
};

export default pharmacyService;
