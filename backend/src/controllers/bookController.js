import Book from "../models/Book.js";
import Borrowing from "../models/Borrowing.js";

export const getBooks = async (req, res, next) => {
  try {
    const { search = "", category = "" } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { isbn: { $regex: search, $options: "i" } }
      ];
    }

    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.json({ books });
  } catch (error) {
    next(error);
  }
};

export const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ book });
  } catch (error) {
    next(error);
  }
};

export const createBook = async (req, res, next) => {
  try {
    const { title, author, isbn, category, publishedYear, totalCopies, shelfLocation } = req.body;

    if (!title || !author || !isbn || !category) {
      return res.status(400).json({ message: "Title, author, ISBN, and category are required" });
    }

    const copies = Number(totalCopies) || 1;
    const book = await Book.create({
      title,
      author,
      isbn,
      category,
      publishedYear,
      totalCopies: copies,
      availableCopies: copies,
      shelfLocation
    });

    res.status(201).json({ book });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "ISBN already exists" });
    }
    next(error);
  }
};

export const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const borrowedCopies = book.totalCopies - book.availableCopies;
    const nextTotalCopies =
      req.body.totalCopies === undefined ? book.totalCopies : Number(req.body.totalCopies);

    if (nextTotalCopies < borrowedCopies) {
      return res.status(400).json({
        message: `Total copies cannot be less than currently borrowed copies (${borrowedCopies})`
      });
    }

    book.title = req.body.title ?? book.title;
    book.author = req.body.author ?? book.author;
    book.isbn = req.body.isbn ?? book.isbn;
    book.category = req.body.category ?? book.category;
    book.publishedYear = req.body.publishedYear ?? book.publishedYear;
    book.shelfLocation = req.body.shelfLocation ?? book.shelfLocation;
    book.totalCopies = nextTotalCopies;
    book.availableCopies = nextTotalCopies - borrowedCopies;

    await book.save();
    res.json({ book });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "ISBN already exists" });
    }
    next(error);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const activeBorrowing = await Borrowing.exists({ book: book._id, status: "borrowed" });
    if (activeBorrowing) {
      return res.status(400).json({ message: "Cannot delete a book that is currently borrowed" });
    }

    await book.deleteOne();
    res.json({ message: "Book deleted" });
  } catch (error) {
    next(error);
  }
};

