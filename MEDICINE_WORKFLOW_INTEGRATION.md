# Medicine Workflow Integration

## Overview
The medicine prescription workflow has been fully integrated into the Hospital Management System according to the complete hospital workflow requirements.

## Workflow Steps

### 1. Doctor Consultation & Prescription
**Route:** `/doctor/appointment/complete/:id`

When a doctor completes an appointment, they can:
- Record patient symptoms
- Record vital signs (temperature, blood pressure, heart rate, etc.)
- Make a diagnosis
- **Prescribe medicines** from the hospital inventory
  - Select medicine from available stock
  - Specify dosage, frequency, duration
  - Specify quantity needed
  - Add special instructions
- Order lab tests
- Request admission if needed
- Add clinical notes

**Backend Implementation:**
- **File:** `backend/routes/appointments.js`
- **Endpoint:** `PUT /api/appointments/complete/:id` (Doctor only)
- Creates `MedicalRecord` with prescription array containing medicine references
- Each prescription item includes:
  - `medicineId`: Reference to Medicine document
  - `dosage`: e.g., "500mg"
  - `frequency`: e.g., "Twice daily"
  - `duration`: e.g., "7 days"
  - `quantity`: Number of units
  - `instructions`: Special instructions
  - `issued`: Boolean flag (default: false)
  - `issuedDate`: When medicine was dispensed
  - `issuedBy`: Pharmacy staff name

### 2. Pharmacy Management
**Route:** `/staff/pharmacy`

Pharmacy staff can:
- View pending prescriptions (medicines not yet issued)
- See patient details and diagnosis
- Check medicine stock availability
- Issue medicines to patients
- View complete medicine inventory
- Monitor stock levels and expiry dates

**Backend Implementation:**
- **File:** `backend/routes/pharmacy.js`
- **Endpoints:**
  - `GET /api/pharmacy/pending` - Get all pending prescriptions
  - `PUT /api/pharmacy/issue/:recordId` - Issue medicines from prescription
  - `GET /api/pharmacy/prescription/:recordId` - Get prescription details

**Issue Medicines Logic:**
1. Receives array of medicines to issue with quantities
2. Validates medicine exists in inventory
3. Checks stock availability
4. Reduces stock quantity in Medicine collection
5. Marks prescription item as `issued` in MedicalRecord
6. Records issue date and staff name
7. Returns success with issued items and any errors

### 3. Medicine Inventory Management
**Backend Routes:** `backend/routes/medicines.js`

Available operations:
- `GET /api/medicines` - Get all medicines (with filters)
- `GET /api/medicines/:id` - Get single medicine
- `POST /api/medicines` - Create new medicine (Admin only)
- `PUT /api/medicines/:id/stock` - Update stock levels
- `PUT /api/medicines/:id/issue` - Issue medicine (reduces stock)
- `GET /api/medicines/low-stock` - Get medicines below reorder level
- `GET /api/medicines/expired` - Get expired medicines
- `DELETE /api/medicines/:id` - Delete medicine (Admin only)

**Medicine Model Fields:**
- `medicineId`: Unique identifier
- `name`: Medicine name
- `category`: Antibiotic, Painkiller, Vitamin, etc.
- `dosageForm`: Tablet, Capsule, Syrup, Injection, etc.
- `manufacturer`: Company name
- `stockQuantity`: Current stock
- `reorderLevel`: Minimum stock level
- `unitPrice`: Price per unit
- `expiryDate`: Expiration date
- `status`: In Stock / Low Stock / Out of Stock / Expired (auto-updated)

**Auto-Status Update:**
The Medicine model uses a pre-save hook to automatically update status:
- **Expired**: If expiry date has passed
- **Out of Stock**: If stock quantity is 0
- **Low Stock**: If stock is at or below reorder level
- **In Stock**: Otherwise

## Frontend Components

### 1. Complete Appointment Page (Doctor)
**File:** `frontend/src/pages/doctor/CompleteAppointment.jsx`

Features:
- Patient information display
- Symptom tracking (add/remove)
- Vital signs entry
- Diagnosis text area
- **Medicine prescription builder:**
  - Dropdown to select from available medicines
  - Shows current stock for each medicine
  - Fields for dosage, frequency, duration, quantity, instructions
  - Add multiple medicines to prescription
  - View prescription summary table
  - Remove medicines from prescription
- Lab test orders
- Admission request
- Clinical notes
- Complete/Cancel buttons

### 2. Pharmacy Management Page (Staff/Admin)
**File:** `frontend/src/pages/staff/PharmacyManagement.jsx`

**Two Tabs:**

**Tab 1: Pending Prescriptions**
- Lists all medical records with pending prescriptions
- Shows patient name, ID, phone
- Shows doctor name and specialization
- Shows diagnosis
- Displays prescription table with:
  - Medicine name
  - Dosage, frequency, duration, quantity
  - Current stock availability
  - Issue status (Pending/Issued)
- **"Issue All Medicines" button:**
  - Checks stock for all medicines
  - Issues available medicines
  - Shows success/error messages
  - Updates stock automatically
  - Marks items as issued

**Tab 2: Medicine Inventory**
- Complete inventory view
- Shows medicine ID, name, category
- Stock quantity and reorder level
- Status with color coding:
  - Green: In Stock
  - Yellow: Low Stock
  - Red: Out of Stock
- Expiry dates

### 3. Navigation Integration
**File:** `frontend/src/components/Sidebar.jsx`

Added "Pharmacy" menu item for:
- Staff role users
- Admin users (to access pharmacy operations)

Links to `/staff/pharmacy` route

## Frontend Services

### Pharmacy Service
**File:** `frontend/src/services/pharmacy.service.js`

Methods:
- `getPendingPrescriptions()` - Fetch prescriptions awaiting fulfillment
- `issueMedicines(recordId, prescriptionItems)` - Issue medicines to patient
- `getPrescription(recordId)` - Get prescription by medical record ID

### Medicine Service
**File:** `frontend/src/services/medicine.service.js`

Methods:
- `getAllMedicines(filters)` - Get all medicines with optional filters
- `getMedicineById(id)` - Get single medicine
- `createMedicine(medicineData)` - Add new medicine
- `updateStock(id, operation, quantity)` - Update stock (add/subtract)
- `issueMedicine(id, quantity, patientId)` - Issue medicine
- `deleteMedicine(id)` - Delete medicine
- `getLowStock()` - Get medicines below reorder level
- `getExpired()` - Get expired medicines

### Appointment Service (Updated)
**File:** `frontend/src/services/appointment.service.js`

Added method:
- `completeAppointment(id, appointmentData)` - Complete appointment with full medical record

## Database Models

### MedicalRecord Model (Enhanced)
**File:** `backend/models/MedicalRecord.js`

**Prescription Schema:**
```javascript
prescription: [{
  medicineId: ObjectId (ref: 'Medicine'),
  medication: String,
  dosage: String,
  frequency: String,
  duration: String,
  instructions: String,
  quantity: Number,
  issued: Boolean (default: false),
  issuedDate: Date,
  issuedBy: String
}]
```

**Key Features:**
- Each prescription item references a Medicine document
- Tracks issue status for pharmacy workflow
- Records when and by whom medicine was issued
- Supports partial issuance (some medicines issued, others pending)

### Medicine Model
**File:** `backend/models/Medicine.js`

Complete inventory management with:
- Unique medicine ID
- Category and dosage form enums
- Stock tracking with reorder level
- Auto-status updates based on expiry and stock
- Price tracking
- Manufacturer information

## Complete Workflow Example

### Step 1: Doctor Prescribes Medicine
1. Doctor completes patient appointment
2. Enters diagnosis and symptoms
3. Adds medicines to prescription:
   - Selects "Paracetamol 500mg Tablet"
   - Dosage: "500mg"
   - Frequency: "Twice daily"
   - Duration: "7 days"
   - Quantity: 14 tablets
4. Submits appointment completion
5. System creates MedicalRecord with prescription

### Step 2: Pharmacy Receives Prescription
1. Pharmacy staff opens Pharmacy Management page
2. Sees pending prescription in list
3. Views patient details and prescribed medicines
4. Checks stock availability (shows current stock for each medicine)
5. Clicks "Issue All Medicines"

### Step 3: Medicine Issuance
1. System validates stock for all medicines
2. Reduces stock quantity for each medicine:
   - Paracetamol: 100 → 86 (issued 14 tablets)
3. Marks prescription items as issued
4. Records issue date and staff name
5. Updates Medicine status if stock falls below reorder level
6. Shows success message to pharmacy staff

### Step 4: Inventory Update
1. Medicine stock automatically updated
2. If stock falls below reorder level, status changes to "Low Stock"
3. Low stock medicines appear in alerts
4. Inventory view reflects current stock

## Security & Access Control

All routes protected with JWT authentication and role-based middleware:

- **Doctor Routes:**
  - Complete appointment: `doctorOnly`
  
- **Pharmacy Routes:**
  - View pending prescriptions: `staffOrAdmin`
  - Issue medicines: `staffOrAdmin`
  
- **Medicine Management:**
  - View medicines: `authenticated`
  - Create/Delete medicines: `adminOnly`
  - Update stock: `staffOrAdmin`

## Integration Points

### With Billing System
- Medicine prescriptions can be referenced in billing
- Billing.charges.medicines array can reference prescribed medicines
- Track medicine costs for patient bills

### With Lab Tests
- Medical records include both prescriptions and lab test orders
- Complete patient treatment tracking in single record

### With Ward Management
- If admission required, prescription travels with patient
- Pharmacy can issue medicines to admitted patients
- Medicine costs included in ward charges

## API Route Summary

| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/api/appointments/complete/:id` | PUT | Doctor | Complete appointment with prescription |
| `/api/pharmacy/pending` | GET | Staff/Admin | Get pending prescriptions |
| `/api/pharmacy/issue/:recordId` | PUT | Staff/Admin | Issue medicines from prescription |
| `/api/pharmacy/prescription/:recordId` | GET | Authenticated | Get prescription details |
| `/api/medicines` | GET | Authenticated | Get all medicines |
| `/api/medicines` | POST | Admin | Create medicine |
| `/api/medicines/:id` | GET | Authenticated | Get medicine by ID |
| `/api/medicines/:id/stock` | PUT | Staff/Admin | Update stock |
| `/api/medicines/:id/issue` | PUT | Staff/Admin | Issue medicine |
| `/api/medicines/low-stock` | GET | Staff/Admin | Get low stock medicines |
| `/api/medicines/expired` | GET | Staff/Admin | Get expired medicines |

## Configuration

### Server Registration
**File:** `backend/server.js`

Added routes:
```javascript
import pharmacyRoutes from './routes/pharmacy.js';
app.use('/api/pharmacy', pharmacyRoutes);
```

### Frontend Routing
**File:** `frontend/src/App.jsx`

Added routes:
```jsx
// Doctor: Complete appointment with prescription
<Route path="/doctor/appointment/complete/:id" element={<CompleteAppointment />} />

// Staff/Admin: Pharmacy management
<Route path="/staff/pharmacy" element={<PharmacyManagement />} />
```

## Testing the Workflow

### Prerequisites
1. At least one medicine in inventory
2. At least one patient and doctor registered
3. An appointment booked and confirmed

### Test Steps
1. **Login as Doctor**
   - Go to doctor dashboard
   - Find pending appointment
   - Click "Complete Appointment"
   - Fill in diagnosis and prescription
   - Select medicine from dropdown
   - Add dosage, quantity, frequency
   - Submit completion

2. **Login as Staff/Pharmacy**
   - Navigate to Pharmacy Management
   - View pending prescriptions
   - Verify medicine stock availability
   - Click "Issue All Medicines"
   - Verify success message

3. **Verify Results**
   - Check Medicine inventory - stock should be reduced
   - Check Medical Record - prescription should be marked as issued
   - No longer appears in pending prescriptions

## Future Enhancements

Possible additions:
- Print prescription PDF
- Medicine interaction warnings
- Dosage calculator based on patient weight/age
- Prescription history for patients
- Medicine usage analytics
- Automatic reorder alerts
- Batch number tracking
- Generic medicine substitution
- Medicine cost estimation before issuance
- Patient medicine pickup notification

## Summary

The medicine workflow integration provides:
✅ Complete prescription workflow from doctor to pharmacy
✅ Medicine inventory management with auto-status updates
✅ Stock tracking and low stock alerts
✅ Pharmacy interface for medicine issuance
✅ Prescription tracking (pending vs issued)
✅ Integration with medical records and appointments
✅ Role-based access control
✅ Real-time stock updates
✅ Expiry date tracking

The system now supports the complete medicine lifecycle from prescription to dispensing to inventory management.
