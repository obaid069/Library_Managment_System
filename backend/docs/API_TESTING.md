# API Testing Guide

This guide shows how to test the Library Management System API using various tools.

## Table of Contents
- [Using cURL](#using-curl)
- [Using Postman](#using-postman)
- [Using VS Code REST Client](#using-vs-code-rest-client)
- [Common API Workflows](#common-api-workflows)

---

## Using cURL

### Books API

#### Get all books
```bash
curl http://localhost:5000/api/books
```

#### Get available books only
```bash
curl http://localhost:5000/api/books?available=true
```

#### Get books by category
```bash
curl "http://localhost:5000/api/books?category=Computer%20Science"
```

#### Create a new book
```bash
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "MongoDB in Action",
    "isbn": "978-1-617-29103-6",
    "authors": ["Kyle Banker", "Peter Bakkum"],
    "category": "Database",
    "publisher": "Manning",
    "copiesTotal": 5,
    "copiesAvailable": 5
  }'
```

#### Update a book
```bash
curl -X PUT http://localhost:5000/api/books/BOOK_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "copiesTotal": 10,
    "copiesAvailable": 8
  }'
```

#### Delete a book
```bash
curl -X DELETE http://localhost:5000/api/books/BOOK_ID_HERE
```

### Users API

#### Get all users
```bash
curl http://localhost:5000/api/users
```

#### Create a new user
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "role": "member"
  }'
```

### Loans API

#### Get active loans
```bash
curl http://localhost:5000/api/loans?active=true
```

#### Issue a book
```bash
curl -X POST http://localhost:5000/api/loans/issue \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_HERE",
    "bookId": "BOOK_ID_HERE",
    "daysToReturn": 14
  }'
```

#### Return a book
```bash
curl -X PUT http://localhost:5000/api/loans/return/LOAN_ID_HERE
```

### Reports API

#### Get most borrowed books
```bash
curl http://localhost:5000/api/reports/most-borrowed
```

#### Get dashboard statistics
```bash
curl http://localhost:5000/api/reports/dashboard
```

#### Get overdue loans
```bash
curl http://localhost:5000/api/reports/overdue-loans
```

---

## Using Postman

### Setup

1. **Install Postman**: Download from [postman.com](https://www.postman.com/)
2. **Create Collection**: "Library Management API"
3. **Set Base URL**: Create environment variable `baseUrl = http://localhost:5000/api`

### Sample Requests

#### 1. Get All Books
- **Method**: GET
- **URL**: `{{baseUrl}}/books`
- **Headers**: None
- **Body**: None

#### 2. Create Book
- **Method**: POST
- **URL**: `{{baseUrl}}/books`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "title": "Learning MongoDB",
  "isbn": "978-1-449-34166-5",
  "authors": ["Kristina Chodorow"],
  "category": "Database",
  "publisher": "O'Reilly Media",
  "copiesTotal": 3,
  "copiesAvailable": 3
}
```

#### 3. Issue Book (Loan)
- **Method**: POST
- **URL**: `{{baseUrl}}/loans/issue`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "userId": "675b1234567890abcdef1234",
  "bookId": "675b1234567890abcdef5678",
  "daysToReturn": 14
}
```

---

## Using VS Code REST Client

### Install Extension
Install "REST Client" extension by Huachao Mao

### Create Test File

Create `api-tests.http`:

```http
### Variables
@baseUrl = http://localhost:5000/api

### Get all books
GET {{baseUrl}}/books

### Get available books
GET {{baseUrl}}/books?available=true

### Get Computer Science books
GET {{baseUrl}}/books?category=Computer Science

### Create a new book
POST {{baseUrl}}/books
Content-Type: application/json

{
  "title": "Node.js Design Patterns",
  "isbn": "978-1-785-88572-4",
  "authors": ["Mario Casciaro", "Luciano Mammino"],
  "category": "Programming",
  "publisher": "Packt",
  "copiesTotal": 4,
  "copiesAvailable": 4
}

### Get all users
GET {{baseUrl}}/users

### Create a new user
POST {{baseUrl}}/users
Content-Type: application/json

{
  "name": "Test User",
  "email": "test.user@example.com",
  "role": "member"
}

### Get active loans
GET {{baseUrl}}/loans?active=true

### Issue a book (replace IDs)
POST {{baseUrl}}/loans/issue
Content-Type: application/json

{
  "userId": "675b1234567890abcdef1234",
  "bookId": "675b1234567890abcdef5678",
  "daysToReturn": 14
}

### Get most borrowed books
GET {{baseUrl}}/reports/most-borrowed

### Get dashboard stats
GET {{baseUrl}}/reports/dashboard

### Get average ratings
GET {{baseUrl}}/reports/average-ratings

### Get overdue loans
GET {{baseUrl}}/reports/overdue-loans
```

Click "Send Request" above any request to execute it.

---

## Common API Workflows

### Workflow 1: Complete Book Borrowing Process

```bash
# Step 1: Find an available book
curl http://localhost:5000/api/books?available=true

# Step 2: Get user ID
curl http://localhost:5000/api/users

# Step 3: Issue the book (use actual IDs from above)
curl -X POST http://localhost:5000/api/loans/issue \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "675b...",
    "bookId": "675c...",
    "daysToReturn": 14
  }'

# Step 4: Verify the loan was created
curl http://localhost:5000/api/loans?active=true

# Step 5: Return the book (use loan ID from step 3)
curl -X PUT http://localhost:5000/api/loans/return/LOAN_ID
```

### Workflow 2: Add and Review a Book

```bash
# Step 1: Create a new book
BOOK_RESPONSE=$(curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Book",
    "isbn": "978-0-000-00000-0",
    "authors": ["Test Author"],
    "category": "Test",
    "publisher": "Test Pub",
    "copiesTotal": 3,
    "copiesAvailable": 3
  }')

# Step 2: Extract book ID (requires jq)
BOOK_ID=$(echo $BOOK_RESPONSE | jq -r '.data._id')

# Step 3: Get book details
curl http://localhost:5000/api/books/$BOOK_ID

# Step 4: Update book availability
curl -X PUT http://localhost:5000/api/books/$BOOK_ID \
  -H "Content-Type: application/json" \
  -d '{"copiesAvailable": 2}'
```

### Workflow 3: Generate Reports

```bash
# Get all reports at once
curl http://localhost:5000/api/reports/dashboard
curl http://localhost:5000/api/reports/most-borrowed
curl http://localhost:5000/api/reports/active-loans
curl http://localhost:5000/api/reports/average-ratings
curl http://localhost:5000/api/reports/overdue-loans
```

---

## Response Examples

### Success Response
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "_id": "675b1234567890abcdef1234",
      "title": "Database Systems",
      "isbn": "978-1-111-11111-1",
      "authors": ["Author A"],
      "category": "Computer Science",
      "publisher": "Publisher A",
      "copiesTotal": 5,
      "copiesAvailable": 3
    }
  ]
}
```

### Error Response
```json
{
  "success": false,
  "error": "Book not found"
}
```

---

## Testing Tips

1. **Seed Database First**: Run `npm run seed` before testing
2. **Get Real IDs**: Use GET requests to obtain valid ObjectIds
3. **Check Availability**: Verify book availability before issuing loans
4. **Monitor Logs**: Check server console for detailed error messages
5. **Use Valid Data**: Follow schema validation rules

---

## MongoDB Direct Queries

You can also test directly in MongoDB shell:

```javascript
// Connect to database
mongosh "mongodb://localhost:27017/library_management"

// Get all books
db.books.find()

// Get available books
db.books.find({ copiesAvailable: { $gt: 0 } })

// Get most borrowed books
db.loans.aggregate([
  { $group: { _id: "$bookId", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 5 }
])
```
