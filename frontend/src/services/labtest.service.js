import apiService from './api.service';

class LabTestService {
  // Get all lab tests
  getAllLabTests(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return apiService.get(`/labtests${queryParams ? `?${queryParams}` : ''}`);
  }

  // Get lab test by ID
  getLabTestById(id) {
    return apiService.get(`/labtests/${id}`);
  }

  // Create lab test request
  createLabTest(labTestData) {
    return apiService.post('/labtests', labTestData);
  }

  // Update lab test results
  updateResults(id, resultsData) {
    return apiService.put(`/labtests/${id}/results`, resultsData);
  }

  // Update lab test status
  updateStatus(id, status) {
    return apiService.put(`/labtests/${id}/status`, { status });
  }

  // Get pending lab tests
  getPending() {
    return apiService.get('/labtests/status/pending');
  }

  // Delete lab test
  deleteLabTest(id) {
    return apiService.delete(`/labtests/${id}`);
  }
}

export default new LabTestService();
