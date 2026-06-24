# Student Library System ER Diagram

```mermaid
erDiagram
    USER ||--o{ BORROWING : makes
    BOOK ||--o{ BORROWING : is_borrowed_in

    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        string role
        string studentId UK
        date createdAt
        date updatedAt
    }

    BOOK {
        ObjectId _id PK
        string title
        string author
        string isbn UK
        string category
        number publishedYear
        number totalCopies
        number availableCopies
        string shelfLocation
        date createdAt
        date updatedAt
    }

    BORROWING {
        ObjectId _id PK
        ObjectId user FK
        ObjectId book FK
        date borrowedAt
        date dueDate
        date returnedAt
        string status
        date createdAt
        date updatedAt
    }
```

## Relationships

- One `User` can have many `Borrowing` records.
- One `Book` can appear in many `Borrowing` records.
- Each `Borrowing` record belongs to exactly one `User` and one `Book`.
- `Borrowing.status` can be `booked`, `borrowed`, or `returned`.
