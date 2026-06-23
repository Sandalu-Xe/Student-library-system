import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: true,
      trim: true
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    publishedYear: {
      type: Number,
      min: 1000,
      max: 2100
    },
    totalCopies: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    availableCopies: {
      type: Number,
      required: true,
      min: 0,
      default: 1
    },
    shelfLocation: {
      type: String,
      trim: true,
      default: "General"
    }
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;

