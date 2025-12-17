# Hospital Management System - MongoDB (NoSQL)

A comprehensive Hospital Management System built with **MongoDB (NoSQL)** demonstrating document-oriented database design, CRUD operations, aggregation pipelines, indexing strategies, and a complete MERN stack application.

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Database Structure](#database-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Scripts](#scripts)
- [SQL vs NoSQL Comparison](#sql-vs-nosql-comparison)
- [Project Structure](#project-structure)

## 🎯 Project Overview

This project demonstrates:
- ✅ **NoSQL Database Design** using MongoDB
- ✅ **Document-Oriented Schema** with flexible structures
- ✅ **CRUD Operations** (Create, Read, Update, Delete)
- ✅ **Aggregation Pipelines** for complex queries
- ✅ **Indexing Strategies** for performance optimization
- ✅ **RESTful API** with Express.js
- ✅ **Web Interface** for demonstration
- ✅ **Real-world Use Cases** (library operations, analytics)

## ✨ Features

### Core Functionality
- �‍⚕️ **Doctor Management** - Add, update, delete, and search doctors by specialization
- 👥 **Patient Management** - Manage patient records, medical history, blood groups
- 📅 **Appointment System** - Schedule, complete, and cancel appointments
- 📋 **Medical Records** - Track diagnoses, prescriptions, lab tests, vital signs
- 💰 **Billing Management** - Generate invoices, track payments
- 🏥 **Department Management** - Organize hospital departments and services

### Analytics & Reports
- 📊 Doctor workload by appointments
- 📈 Patient demographics and age distribution
- 💉 Blood group statistics
- 📅 Appointment status trends
- 🏥 Department statistics
- 📋 Chronic disease patient tracking

## 🗄️ Database Structure

### Collections

#### 1. Doctors
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  specialization: String,
  licenseNumber: String (unique),
  department: ObjectId (ref: Department),
  experience: Number,
  consultationFee: Number,
  availability: [String],
  createdAt: Date
}
```

#### 2. Patients
```javascript
{
  _id: ObjectId,
  patientId: String (unique),
  name: String,
  email: String,
  dateOfBirth: Date,
  gender: String,
  bloodGroup: String,
  phone: String,
  address: Object,
  medicalHistory: Object,
  emergencyContact: Object,
  status: String,
  createdAt: Date
}
```

#### 3. Appointments
```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: Patient),
  doctorId: ObjectId (ref: Doctor),
  appointmentDate: Date,
  appointmentTime: String,
  duration: Number,
  reason: String,
  status: "Scheduled" | "Completed" | "Cancelled",
  diagnosis: String,
  prescription: String,
  createdAt: Date
}
```

#### 4. MedicalRecords
```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: Patient),
  doctorId: ObjectId (ref: Doctor),
  symptoms: [String],
  diagnosis: String,
  prescription: [Object],
  labTests: [String],
  vitalSigns: Object,
  followUpDate: Date,
  createdAt: Date
}
```

#### 5. Billing
```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: Patient),
  appointmentId: ObjectId (ref: Appointment),
  items: [Object],
  invoiceNumber: String (unique),
  subtotal: Number,
  tax: Number,
  discount: Number,
  total: Number,
  paymentMethod: String,
  paid: Boolean,
  createdAt: Date
}
```

#### 6. Departments
```javascript
{
  _id: ObjectId,
  name: String (unique),
  code: String (unique),
  headOfDepartment: ObjectId (ref: Doctor),
  services: [String],
  operatingHours: String,
  bedCapacity: Number,
  createdAt: Date
}
```

## 🚀 Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (v6 or higher) - Local installation or MongoDB Atlas account
- **npm** or **yarn**

### Step 1: Clone and Install Dependencies

```bash
# Install dependencies
npm install
```

### Step 2: Configure Environment

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/hospital_management
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hospital_management

PORT=5000
NODE_ENV=development
```

### Step 3: Start MongoDB

**Option A: Local MongoDB**
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas**
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get your connection string
- Update `MONGODB_URI` in `.env`

## 📖 Usage

### 1. Seed the Database

Populate the database with sample data:

```bash
npm run seed
```

This creates:
- 8 doctors across various specializations
- 10 patients with different medical histories
- 12 appointments (scheduled and completed)
- 4 medical records
- 4 billing records
- 5 hospital departments

### 2. Create Indexes

Optimize database performance:

```bash
npm run indexes
```

### 3. Test CRUD Operations

Run comprehensive CRUD demonstrations:

```bash
npm run crud
```

### 4. Test Aggregation Queries

Execute aggregation pipeline examples:

```bash
npm run aggregate
```

### 5. Start the API Server

```bash
npm start
# or for development with auto-reload:
npm run dev
```

Server runs at: `http://localhost:5000`

### 6. Access the Web Interface

Open `public/index.html` in a browser or visit:
```
http://localhost:5000
```

## 🔌 API Endpoints

### Doctors
- `GET /api/doctors` - Get all doctors (supports ?specialization= and ?department= filters)
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors` - Create new doctor
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor

### Patients
- `GET /api/patients` - Get all patients (supports ?bloodGroup= filter)
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `GET /api/patients/stats/bloodgroups` - Get blood group statistics

### Appointments
- `GET /api/appointments` - Get all appointments (supports ?status= filter)
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments/schedule` - Schedule new appointment
- `PUT /api/appointments/:id` - Update appointment
- `PUT /api/appointments/complete/:id` - Complete appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Reports
- `GET /api/reports/doctor-workload` - Doctor workload by appointments
- `GET /api/reports/patient-appointments` - Patient appointment counts
- `GET /api/reports/department-stats` - Department statistics
- `GET /api/reports/upcoming-appointments` - Upcoming appointments (7 days)
- `GET /api/reports/dashboard` - Dashboard statistics

## 📜 Scripts

All scripts are located in the `scripts/` directory:

| Script | Command | Description |
|--------|---------|-------------|
| **seedData.js** | `npm run seed` | Populate database with sample data |
| **crudOperations.js** | `npm run crud` | Demonstrate all CRUD operations |
| **aggregationQueries.js** | `npm run aggregate` | Run aggregation pipeline examples |
| **createIndexes.js** | `npm run indexes` | Create database indexes |

## 🆚 SQL vs NoSQL Comparison

| Aspect | SQL (Oracle/MySQL) | NoSQL (MongoDB) |
|--------|-------------------|-----------------|
| **Schema** | Fixed, predefined structure | Flexible, dynamic schema |
| **Data Model** | Tables with rows and columns | Documents (JSON-like) |
| **Relationships** | Foreign keys, JOIN operations | Embedded documents or references |
| **Scaling** | Vertical (more powerful servers) | Horizontal (distributed servers) |
| **Transactions** | Strong ACID guarantees | Limited ACID (document level) |
| **Query Language** | SQL | MongoDB Query Language (MQL) |
| **Use Cases** | Banking, finance, strict schemas | Content management, real-time analytics |
| **Flexibility** | Schema changes require migrations | Add fields without schema changes |
| **Performance** | Better for complex joins | Better for read-heavy workloads |
| **Data Integrity** | Enforced by constraints | Application-level enforcement |

### When to Use NoSQL (MongoDB)?

✅ **Good Fit:**
- Rapidly changing requirements
- Semi-structured or unstructured data
- Need for horizontal scalability
- Document-oriented data (books, articles, products)
- Real-time analytics
- High-volume read operations

❌ **Not Ideal:**
- Complex multi-table transactions
- Strict data integrity requirements
- Heavy relational queries
- Financial transactions requiring ACID

### Hospital System Context

**Why MongoDB Works Well:**
1. **Flexible Patient Data** - Patients can have varying medical histories, allergies, chronic diseases
2. **Embedded Medical Records** - Medical records naturally belong to patients
3. **Denormalization** - Doctor info can be embedded in appointments for faster queries
4. **Scalability** - Easy to handle growing patient base and appointment volume
5. **Document Model** - Matches real-world hospital entities

## 📁 Project Structure

```
hospital-management-nosql/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── Doctor.js            # Doctor schema
│   ├── Patient.js           # Patient schema
│   ├── Appointment.js       # Appointment schema
│   ├── MedicalRecord.js     # Medical record schema
│   ├── Billing.js           # Billing schema
│   └── Department.js        # Department schema
├── routes/
│   ├── doctors.js           # Doctor API routes
│   ├── patients.js          # Patient API routes
│   ├── appointments.js      # Appointment API routes
│   └── reports.js           # Reports & analytics routes
├── scripts/
│   ├── seedData.js          # Database seeding
│   ├── crudOperations.js    # CRUD demonstrations
│   ├── aggregationQueries.js # Aggregation examples
│   └── createIndexes.js     # Index creation
├── frontend/
│   ├── src/
│   │   ├── pages/           # React pages (Patients, Doctors, Appointments, Reports)
│   │   ├── components/      # React components (Layout, Dashboard)
│   │   └── services/        # API service layer
│   └── public/              # Static files
├── server.js                # Express server
├── package.json             # Dependencies
├── .env                     # Environment variables
├── .env.example             # Environment template
└── README.md                # This file
```

## 🔍 Key Features Demonstrated

### 1. CRUD Operations
- **Create**: `insertOne()`, `insertMany()`
- **Read**: `find()`, `findOne()`, `findById()`
- **Update**: `updateOne()`, `updateMany()`, `findOneAndUpdate()`
- **Delete**: `deleteOne()`, `deleteMany()`, `findByIdAndDelete()`

### 2. Aggregation Pipelines
- `$group` - Grouping data
- `$match` - Filtering documents
- `$sort` - Sorting results
- `$lookup` - Join-like operations
- `$project` - Field selection
- `$unwind` - Array deconstruction
- `$dateDiff` - Date calculations

### 3. Indexing
- Single field indexes
- Compound indexes
- Unique indexes
- Text indexes
- Performance optimization

### 4. Mongoose Features
- Schema validation
- Virtuals and methods
- Population (references)
- Middleware (hooks)
- Custom validators

## 🎓 Learning Outcomes

After exploring this project, you will understand:

1. ✅ NoSQL database design principles
2. ✅ Document-oriented data modeling
3. ✅ MongoDB aggregation framework
4. ✅ Index strategies for query optimization
5. ✅ RESTful API design with Express
6. ✅ Mongoose ODM usage
7. ✅ When to use NoSQL vs SQL
8. ✅ Real-world application development

## 📝 License

This project is created for educational purposes.

## 👤 Author

Database Administration Project - Hospital Management System

## 🙏 Acknowledgments

- MongoDB Documentation
- Mongoose Documentation
- Express.js Documentation
- React Documentation

---

**Happy Coding! 🏥**
