import User from "../models/User.js";
import Book from "../models/Book.js";

const seedDatabase = async () => {
  try {
    // 1. Seed Users if table is empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("Seeding default users...");
      await User.create([
        {
          name: "Library Admin",
          email: "admin@library.com",
          password: "password123",
          role: "admin"
        },
        {
          name: "Sarah Librarian",
          email: "librarian@library.com",
          password: "password123",
          role: "librarian"
        },
        {
          name: "John Student",
          email: "student@library.com",
          password: "password123",
          role: "student",
          studentId: "STU001"
        }
      ]);
      console.log("Default users seeded (Passwords: password123):");
      console.log("  - Admin: admin@library.com");
      console.log("  - Librarian: librarian@library.com");
      console.log("  - Student: student@library.com");
    }

    // 2. Seed Books if table is empty
    const bookCount = await Book.countDocuments();
    if (bookCount === 0) {
      console.log("Seeding default books...");
      await Book.create([
        {
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          isbn: "9780743273565",
          category: "Fiction",
          publishedYear: 1925,
          totalCopies: 5,
          availableCopies: 5,
          shelfLocation: "A-12"
        },
        {
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          isbn: "9780446310789",
          category: "Fiction",
          publishedYear: 1960,
          totalCopies: 3,
          availableCopies: 3,
          shelfLocation: "A-15"
        },
        {
          title: "A Brief History of Time",
          author: "Stephen Hawking",
          isbn: "9780553380163",
          category: "Science",
          publishedYear: 1988,
          totalCopies: 2,
          availableCopies: 2,
          shelfLocation: "S-04"
        },
        {
          title: "Introduction to Algorithms",
          author: "Thomas H. Cormen",
          isbn: "9780262033848",
          category: "Computer Science",
          publishedYear: 2009,
          totalCopies: 4,
          availableCopies: 4,
          shelfLocation: "CS-01"
        }
      ]);
      console.log("Default books successfully seeded!");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

export default seedDatabase;
