import mongoose from "mongoose";

const borrowingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true
    },
    borrowedAt: {
      type: Date,
      default: Date.now
    },
    dueDate: {
      type: Date,
      required: true
    },
    returnedAt: {
      type: Date
    },
    status: {
      type: String,
      enum: ["booked", "borrowed", "returned"],
      default: "booked"
    }
  },
  { timestamps: true }
);

const Borrowing = mongoose.model("Borrowing", borrowingSchema);

export default Borrowing;

