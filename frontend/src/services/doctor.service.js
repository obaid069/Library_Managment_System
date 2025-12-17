import apiService from './api.service';

class DoctorService {
  // Get all doctors
  getAllDoctors() {
    return apiService.get('/doctors');
  }

  // Get doctor by ID
  getDoctorById(id) {
    return apiService.get(`/doctors/${id}`);
  }

  // Create new doctor
  createDoctor(doctorData) {
    return apiService.post('/doctors', doctorData);
  }

  // Update doctor
  updateDoctor(id, doctorData) {
    return apiService.put(`/doctors/${id}`, doctorData);
  }

  // Delete doctor
  deleteDoctor(id) {
    return apiService.delete(`/doctors/${id}`);
  }

  // Get doctors by specialization
  getDoctorsBySpecialization(specialization) {
    return apiService.get(`/doctors/specialization/${specialization}`);
  }
}

export default new DoctorService();
