import express from "express";
import { getMe, login, register, socialLogin } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/social-login", socialLogin);
router.get("/me", protect, getMe);

export default router;


