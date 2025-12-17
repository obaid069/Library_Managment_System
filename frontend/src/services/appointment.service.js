import apiService from './api.service';

class AppointmentService {
  // Get all appointments
  getAllAppointments() {
    return apiService.get('/appointments');
  }

  // Get appointment by ID
  getAppointmentById(id) {
    return apiService.get(`/appointments/${id}`);
  }

  // Create new appointment
  createAppointment(appointmentData) {
    return apiService.post('/appointments', appointmentData);
  }

  // Update appointment
  updateAppointment(id, appointmentData) {
    return apiService.put(`/appointments/${id}`, appointmentData);
  }

  // Cancel appointment
  cancelAppointment(id) {
    return apiService.put(`/appointments/${id}/cancel`);
  }

  // Get appointments by patient
  getAppointmentsByPatient(patientId) {
    return apiService.get(`/appointments/patient/${patientId}`);
  }

  // Get appointments by doctor
  getAppointmentsByDoctor(doctorId) {
    return apiService.get(`/appointments/doctor/${doctorId}`);
  }

  // Complete appointment
  completeAppointment(id, appointmentData) {
    return apiService.put(`/appointments/complete/${id}`, appointmentData);
  }
}

export default new AppointmentService();
