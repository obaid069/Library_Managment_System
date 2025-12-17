import apiService from './api.service';

class WardService {
  // Get all wards
  getAllWards(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return apiService.get(`/wards/wards${queryParams ? `?${queryParams}` : ''}`);
  }

  // Create ward
  createWard(wardData) {
    return apiService.post('/wards/wards', wardData);
  }

  // Update ward
  updateWard(id, wardData) {
    return apiService.put(`/wards/wards/${id}`, wardData);
  }

  // Get all bed allocations
  getAllAllocations(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return apiService.get(`/wards/allocations${queryParams ? `?${queryParams}` : ''}`);
  }

  // Get allocation by ID
  getAllocationById(id) {
    return apiService.get(`/wards/allocations/${id}`);
  }

  // Admit patient
  admitPatient(admissionData) {
    return apiService.post('/wards/allocations', admissionData);
  }

  // Discharge patient
  dischargePatient(id) {
    return apiService.put(`/wards/allocations/${id}/discharge`);
  }

  // Add daily note
  addDailyNote(id, note, recordedBy) {
    return apiService.put(`/wards/allocations/${id}/notes`, { note, recordedBy });
  }

  // Get currently admitted patients
  getAdmittedPatients() {
    return apiService.get('/wards/allocations/status/admitted');
  }
}

export default new WardService();
