# MongoDB Query Reference Guide

Quick reference for common MongoDB queries used in the Library Management System.

## Table of Contents
- [Basic Queries](#basic-queries)
- [Advanced Queries](#advanced-queries)
- [Aggregation Pipelines](#aggregation-pipelines)
- [Update Operations](#update-operations)
- [Index Operations](#index-operations)

---

## Basic Queries

### Find All Documents
```javascript
// Get all books
db.books.find()

// Get all books (formatted)
db.books.find().pretty()

// Count all books
db.books.countDocuments()
```

### Find with Conditions
```javascript
// Find books by category
db.books.find({ category: "Computer Science" })

// Find available books
db.books.find({ copiesAvailable: { $gt: 0 } })

// Find books with specific ISBN
db.books.find({ isbn: "978-0-13-815504-9" })

// Find users by role
db.users.find({ role: "member" })
```

### Find with Multiple Conditions
```javascript
// Find available Computer Science books
db.books.find({
  category: "Computer Science",
  copiesAvailable: { $gt: 0 }
})

// Find books with more than 5 copies
db.books.find({
  copiesTotal: { $gte: 5 }
})

// Find active loans (not returned)
db.loans.find({
  returnDate: null
})
```

### Find with OR Conditions
```javascript
// Find books in Computer Science OR Programming
db.books.find({
  $or: [
    { category: "Computer Science" },
    { category: "Programming" }
  ]
})

// Find admin OR staff users
db.users.find({
  role: { $in: ["admin", "staff"] }
})
```

### Projection (Select Specific Fields)
```javascript
// Get only title and authors
db.books.find({}, { title: 1, authors: 1, _id: 0 })

// Exclude certain fields
db.users.find({}, { password: 0, __v: 0 })
```

### Sorting
```javascript
// Sort books by title (ascending)
db.books.find().sort({ title: 1 })

// Sort books by copiesAvailable (descending)
db.books.find().sort({ copiesAvailable: -1 })

// Sort by multiple fields
db.loans.find().sort({ issueDate: -1, userId: 1 })
```

### Limit and Skip
```javascript
// Get first 10 books
db.books.find().limit(10)

// Skip first 10, get next 10 (pagination)
db.books.find().skip(10).limit(10)

// Top 5 most available books
db.books.find().sort({ copiesAvailable: -1 }).limit(5)
```

---

## Advanced Queries

### Array Operations
```javascript
// Find books by specific author
db.books.find({ authors: "Robert C. Martin" })

// Find books with multiple authors
db.books.find({ authors: { $size: 2 } })

// Find books where authors array has more than 1 element
db.books.find({
  $expr: { $gt: [{ $size: "$authors" }, 1] }
})
```

### Text Search
```javascript
// Create text index (if not exists)
db.books.createIndex({ title: "text", authors: "text" })

// Search for books containing "database"
db.books.find({ $text: { $search: "database" } })

// Search with multiple terms
db.books.find({ $text: { $search: "database systems" } })
```

### Date Queries
```javascript
// Find loans issued in December 2024
db.loans.find({
  issueDate: {
    $gte: ISODate("2024-12-01"),
    $lt: ISODate("2025-01-01")
  }
})

// Find overdue loans
db.loans.find({
  returnDate: null,
  dueDate: { $lt: new Date() }
})

// Find recent reviews (last 7 days)
db.reviews.find({
  createdAt: {
    $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  }
})
```

### Regular Expressions
```javascript
// Find books with title starting with "Database"
db.books.find({ title: /^Database/ })

// Case-insensitive search
db.books.find({ title: /database/i })

// Find emails ending with @example.com
db.users.find({ email: /@example\.com$/ })
```

---

## Aggregation Pipelines

### Most Borrowed Books
```javascript
db.loans.aggregate([
  {
    $group: {
      _id: "$bookId",
      borrowCount: { $sum: 1 }
    }
  },
  { $sort: { borrowCount: -1 } },
  { $limit: 10 },
  {
    $lookup: {
      from: "books",
      localField: "_id",
      foreignField: "_id",
      as: "book"
    }
  },
  { $unwind: "$book" },
  {
    $project: {
      _id: 0,
      title: "$book.title",
      category: "$book.category",
      borrowCount: 1
    }
  }
])
```

### Active Loans Per User
```javascript
db.loans.aggregate([
  { $match: { returnDate: null } },
  {
    $group: {
      _id: "$userId",
      activeLoans: { $sum: 1 }
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  {
    $project: {
      userName: "$user.name",
      activeLoans: 1,
      _id: 0
    }
  },
  { $sort: { activeLoans: -1 } }
])
```

### Average Rating Per Book
```javascript
db.reviews.aggregate([
  {
    $group: {
      _id: "$bookId",
      avgRating: { $avg: "$rating" },
      totalReviews: { $sum: 1 }
    }
  },
  { $sort: { avgRating: -1 } },
  {
    $lookup: {
      from: "books",
      localField: "_id",
      foreignField: "_id",
      as: "book"
    }
  },
  { $unwind: "$book" },
  {
    $project: {
      title: "$book.title",
      avgRating: { $round: ["$avgRating", 2] },
      totalReviews: 1,
      _id: 0
    }
  }
])
```

### Books by Category Statistics
```javascript
db.books.aggregate([
  {
    $group: {
      _id: "$category",
      totalBooks: { $sum: 1 },
      totalCopies: { $sum: "$copiesTotal" },
      availableCopies: { $sum: "$copiesAvailable" }
    }
  },
  {
    $project: {
      category: "$_id",
      totalBooks: 1,
      totalCopies: 1,
      availableCopies: 1,
      borrowedCopies: {
        $subtract: ["$totalCopies", "$availableCopies"]
      },
      _id: 0
    }
  },
  { $sort: { totalBooks: -1 } }
])
```

### Monthly Loan Trends
```javascript
db.loans.aggregate([
  {
    $group: {
      _id: {
        year: { $year: "$issueDate" },
        month: { $month: "$issueDate" }
      },
      totalLoans: { $sum: 1 }
    }
  },
  { $sort: { "_id.year": 1, "_id.month": 1 } }
])
```

### Overdue Loans
```javascript
db.loans.aggregate([
  {
    $match: {
      returnDate: null,
      dueDate: { $lt: new Date() }
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
    }
  },
  {
    $lookup: {
      from: "books",
      localField: "bookId",
      foreignField: "_id",
      as: "book"
    }
  },
  { $unwind: "$user" },
  { $unwind: "$book" },
  {
    $project: {
      userName: "$user.name",
      bookTitle: "$book.title",
      dueDate: 1,
      daysOverdue: {
        $dateDiff: {
          startDate: "$dueDate",
          endDate: new Date(),
          unit: "day"
        }
      }
    }
  },
  { $sort: { daysOverdue: -1 } }
])
```

---

## Update Operations

### Update Single Document
```javascript
// Update book availability
db.books.updateOne(
  { _id: ObjectId("...") },
  { $set: { copiesAvailable: 5 } }
)

// Increment copies available
db.books.updateOne(
  { isbn: "978-0-13-815504-9" },
  { $inc: { copiesAvailable: 1 } }
)

// Decrement copies available
db.books.updateOne(
  { isbn: "978-0-13-815504-9" },
  { $inc: { copiesAvailable: -1 } }
)
```

### Update Multiple Documents
```javascript
// Update all Computer Science books
db.books.updateMany(
  { category: "Computer Science" },
  { $set: { publisher: "Pearson Education" } }
)

// Mark all overdue loans
db.loans.updateMany(
  { returnDate: null, dueDate: { $lt: new Date() } },
  { $set: { status: "overdue" } }
)
```

### Array Updates
```javascript
// Add author to book
db.books.updateOne(
  { _id: ObjectId("...") },
  { $push: { authors: "New Author" } }
)

// Remove author from book
db.books.updateOne(
  { _id: ObjectId("...") },
  { $pull: { authors: "Old Author" } }
)

// Add unique author (won't add duplicates)
db.books.updateOne(
  { _id: ObjectId("...") },
  { $addToSet: { authors: "Unique Author" } }
)
```

### Upsert (Update or Insert)
```javascript
// Update if exists, insert if not
db.users.updateOne(
  { email: "new@example.com" },
  {
    $set: {
      name: "New User",
      email: "new@example.com",
      role: "member"
    }
  },
  { upsert: true }
)
```

### Find and Modify
```javascript
// Find and update, return updated document
db.books.findOneAndUpdate(
  { isbn: "978-0-13-815504-9" },
  { $inc: { copiesAvailable: -1 } },
  { returnDocument: "after" }
)
```

---

## Index Operations

### Create Indexes
```javascript
// Single field index
db.books.createIndex({ title: 1 })

// Compound index
db.loans.createIndex({ userId: 1, returnDate: 1 })

// Unique index
db.users.createIndex({ email: 1 }, { unique: true })

// Text index
db.books.createIndex({ title: "text", authors: "text" })

// Descending index
db.loans.createIndex({ issueDate: -1 })
```

### List Indexes
```javascript
// Show all indexes on a collection
db.books.getIndexes()

// Show index names only
db.books.getIndexes().map(i => i.name)
```

### Drop Indexes
```javascript
// Drop specific index
db.books.dropIndex("title_1")

// Drop all indexes except _id
db.books.dropIndexes()
```

### Explain Query
```javascript
// See query execution plan
db.books.find({ title: "Database Systems" }).explain("executionStats")

// Check if index is used
db.books.find({ category: "Computer Science" }).explain()
```

---

## Useful Administrative Commands

### Database Operations
```javascript
// Show all databases
show dbs

// Switch to database
use library_management

// Show current database
db.getName()

// Drop database
db.dropDatabase()
```

### Collection Operations
```javascript
// Show all collections
show collections

// Create collection explicitly
db.createCollection("books")

// Drop collection
db.books.drop()

// Rename collection
db.books.renameCollection("library_books")

// Get collection stats
db.books.stats()
```

### Data Operations
```javascript
// Delete all documents in collection
db.loans.deleteMany({})

// Count documents
db.books.countDocuments()

// Distinct values
db.books.distinct("category")

// Find one and delete
db.users.findOneAndDelete({ email: "test@example.com" })
```

---

## Tips and Best Practices

### 1. Always Use Indexes for Frequently Queried Fields
```javascript
// Bad: No index on category
db.books.find({ category: "Computer Science" })

// Good: Index on category
db.books.createIndex({ category: 1 })
db.books.find({ category: "Computer Science" })
```

### 2. Use Projection to Limit Data Transfer
```javascript
// Bad: Returns all fields
db.books.find()

// Good: Returns only needed fields
db.books.find({}, { title: 1, authors: 1, _id: 0 })
```

### 3. Use Explain to Optimize Queries
```javascript
// Check query performance
db.books.find({ category: "Computer Science" }).explain("executionStats")
```

### 4. Limit Results for Large Datasets
```javascript
// Bad: Returns all documents
db.loans.find()

// Good: Paginate results
db.loans.find().limit(20).skip(0)
```

### 5. Use Aggregation for Complex Queries
```javascript
// Bad: Multiple queries
const users = db.users.find()
const loans = db.loans.find()

// Good: Single aggregation
db.users.aggregate([
  {
    $lookup: {
      from: "loans",
      localField: "_id",
      foreignField: "userId",
      as: "userLoans"
    }
  }
])
```

---

**Remember:** Always test queries on a development database before running on production!
