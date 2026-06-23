import express from "express";
import {
  createBorrowing,
  getBorrowings,
  returnBorrowing
} from "../controllers/borrowingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getBorrowings).post(protect, createBorrowing);
router.patch("/:id/return", protect, returnBorrowing);

export default router;

