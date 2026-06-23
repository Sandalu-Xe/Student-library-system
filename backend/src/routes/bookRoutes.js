import express from "express";
import {
  createBook,
  deleteBook,
  getBookById,
  getBooks,
  updateBook
} from "../controllers/bookController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const staffOnly = [protect, authorize("admin", "librarian")];

router.route("/").get(protect, getBooks).post(staffOnly, createBook);
router.route("/:id").get(protect, getBookById).put(staffOnly, updateBook).delete(staffOnly, deleteBook);

export default router;

