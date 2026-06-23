import Book from "../models/Book.js";
import Borrowing from "../models/Borrowing.js";

const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

export const getBorrowings = async (req, res, next) => {
  try {
    const filter =
      req.user.role === "admin" || req.user.role === "librarian" ? {} : { user: req.user._id };

    const borrowings = await Borrowing.find(filter)
      .populate("user", "name email role")
      .populate("book", "title author isbn")
      .sort({ createdAt: -1 });

    res.json({ borrowings });
  } catch (error) {
    next(error);
  }
};

export const createBorrowing = async (req, res, next) => {
  try {
    const { bookId } = req.body;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.availableCopies < 1) {
      return res.status(400).json({ message: "No copies are available for this book" });
    }

    const existingBorrowing = await Borrowing.exists({
      user: req.user._id,
      book: book._id,
      status: "borrowed"
    });

    if (existingBorrowing) {
      return res.status(400).json({ message: "You already borrowed this book" });
    }

    book.availableCopies -= 1;
    await book.save();

    const borrowing = await Borrowing.create({
      user: req.user._id,
      book: book._id,
      dueDate: addDays(new Date(), 14)
    });

    const populatedBorrowing = await Borrowing.findById(borrowing._id)
      .populate("user", "name email role")
      .populate("book", "title author isbn");

    res.status(201).json({ borrowing: populatedBorrowing });
  } catch (error) {
    next(error);
  }
};

export const returnBorrowing = async (req, res, next) => {
  try {
    const borrowing = await Borrowing.findById(req.params.id);
    if (!borrowing) {
      return res.status(404).json({ message: "Borrowing record not found" });
    }

    const isOwner = borrowing.user.toString() === req.user._id.toString();
    const isStaff = req.user.role === "admin" || req.user.role === "librarian";

    if (!isOwner && !isStaff) {
      return res.status(403).json({ message: "You cannot update this borrowing record" });
    }

    if (borrowing.status === "returned") {
      return res.status(400).json({ message: "Book is already returned" });
    }

    borrowing.status = "returned";
    borrowing.returnedAt = new Date();
    await borrowing.save();

    await Book.findByIdAndUpdate(borrowing.book, { $inc: { availableCopies: 1 } });

    const populatedBorrowing = await Borrowing.findById(borrowing._id)
      .populate("user", "name email role")
      .populate("book", "title author isbn");

    res.json({ borrowing: populatedBorrowing });
  } catch (error) {
    next(error);
  }
};

