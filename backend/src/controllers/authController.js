import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

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
    const user = await User.create({
      name,
      email,
      password,
      role: userCount === 0 ? "admin" : "student"
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

export const socialLogin = async (req, res, next) => {
  try {
    const { email, name, provider, providerId } = req.body;

    if (!email || !name || !provider || !providerId) {
      return res.status(400).json({ message: "Email, name, provider, and providerId are required" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const userCount = await User.countDocuments();
      // Generate a long random password for passwordless/social accounts
      const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      user = await User.create({
        name,
        email,
        password: randomPassword,
        role: userCount === 0 ? "admin" : "student"
      });
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


