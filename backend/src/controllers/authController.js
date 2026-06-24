import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, studentId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const userCount = await User.countDocuments();
    const assignedRole = role || (userCount === 0 ? "admin" : "student");

    if (assignedRole === "student") {
      if (!studentId) {
        return res.status(400).json({ message: "Student ID is required for student registration" });
      }
      const existingStudentId = await User.findOne({ studentId });
      if (existingStudentId) {
        return res.status(409).json({ message: "Student ID is already registered" });
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      studentId: assignedRole === "student" ? studentId : undefined
    });

    res.status(201).json({
      user,
      token: generateToken(user)
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      user,
      token: generateToken(user)
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  res.json({ user: req.user });
};
