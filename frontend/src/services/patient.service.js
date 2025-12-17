import apiService from './api.service';

class PatientService {
  // Get all patients
  getAllPatients() {
    return apiService.get('/patients');
  }

  // Get patient by ID
  getPatientById(id) {
    return apiService.get(`/patients/${id}`);
  }

  // Create new patient
  createPatient(patientData) {
    return apiService.post('/patients', patientData);
  }

  // Update patient
  updatePatient(id, patientData) {
    return apiService.put(`/patients/${id}`, patientData);
  }

  // Delete patient
  deletePatient(id) {
    return apiService.delete(`/patients/${id}`);
  }

  // Search patients
  searchPatients(query) {
    return apiService.get(`/patients/search?q=${query}`);
  }
}

export default new PatientService();
