import apiService from './api.service';

class ReportService {
  // Get dashboard statistics
  getDashboardStats() {
    return apiService.get('/reports/dashboard');
  }

  // Get patient statistics
  getPatientStats() {
    return apiService.get('/reports/patient-stats');
  }

  // Get doctor statistics
  getDoctorStats() {
    return apiService.get('/reports/doctor-stats');
  }

  // Get appointment statistics
  getAppointmentStats() {
    return apiService.get('/reports/appointment-stats');
  }

  // Get revenue statistics
  getRevenueStats() {
    return apiService.get('/reports/revenue-stats');
  }
}

export default new ReportService();
