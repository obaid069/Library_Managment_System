import apiService from './api.service';

class MedicalRecordService {
    // Get medical records by patient ID
    getMedicalRecordsByPatient(patientId) {
        return apiService.get(`/medical-records/patient/${patientId}`);
    }

    // Get single medical record by ID
    getMedicalRecordById(id) {
        return apiService.get(`/medical-records/${id}`);
    }
}

export default new MedicalRecordService();
