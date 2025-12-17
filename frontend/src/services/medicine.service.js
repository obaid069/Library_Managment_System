import apiService from './api.service';

class MedicineService {
  // Get all medicines
  getAllMedicines(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return apiService.get(`/medicines${queryParams ? `?${queryParams}` : ''}`);
  }

  // Get medicine by ID
  getMedicineById(id) {
    return apiService.get(`/medicines/${id}`);
  }

  // Create new medicine
  createMedicine(medicineData) {
    return apiService.post('/medicines', medicineData);
  }

  // Update medicine stock
  updateStock(id, quantity, operation) {
    return apiService.put(`/medicines/${id}/stock`, { quantity, operation });
  }

  // Issue medicine
  issueMedicine(id, quantity, patientId) {
    return apiService.put(`/medicines/${id}/issue`, { quantity, patientId });
  }

  // Delete medicine
  deleteMedicine(id) {
    return apiService.delete(`/medicines/${id}`);
  }

  // Get low stock medicines
  getLowStock() {
    return apiService.get('/medicines/status/low-stock');
  }

  // Get expired medicines
  getExpired() {
    return apiService.get('/medicines/status/expired');
  }
}

export default new MedicineService();
