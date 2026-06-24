import express from "express";
import {
  createBorrowing,
  getBorrowings,
  returnBorrowing,
  confirmBorrowing,
  deleteBorrowing
} from "../controllers/borrowingController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const staffOnly = [protect, authorize("admin", "librarian")];

router.route("/").get(protect, getBorrowings).post(protect, createBorrowing);
router.route("/:id").delete(protect, deleteBorrowing);
router.patch("/:id/return", protect, returnBorrowing);
router.patch("/:id/confirm", staffOnly, confirmBorrowing);

export default router;

