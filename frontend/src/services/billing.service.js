import apiService from './api.service';

class BillingService {
  // Get all bills
  getAllBills(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return apiService.get(`/billing${queryParams ? `?${queryParams}` : ''}`);
  }

  // Get bill by ID
  getBillById(id) {
    return apiService.get(`/billing/${id}`);
  }

  // Get bills by patient ID
  getBillsByPatient(patientId) {
    return apiService.get(`/billing/patient/${patientId}`);
  }

  // Generate bill
  generateBill(billData) {
    return apiService.post('/billing', billData);
  }

  // Make payment
  makePayment(id, amountPaid, paymentMethod) {
    return apiService.put(`/billing/${id}/payment`, { amountPaid, paymentMethod });
  }

  // Get unpaid bills
  getUnpaidBills() {
    return apiService.get('/billing/status/unpaid');
  }

  // Get revenue statistics
  getRevenueStats(startDate, endDate) {
    const params = new URLSearchParams({ startDate, endDate }).toString();
    return apiService.get(`/billing/stats/revenue?${params}`);
  }

  // Delete bill
  deleteBill(id) {
    return apiService.delete(`/billing/${id}`);
  }
}

export default new BillingService();
