import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, shopId: user.shopId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const authController = {
  // ✅ LOGIN (Admin: email + password) | (Shop: username + password)
  login: async (req, res) => {
    try {
      const { email, username, password } = req.body;

      if (!password || (!email && !username)) {
        return res
          .status(400)
          .json({ message: "Email/Username and password are required" });
      }

      const query = email ? { email } : { username };

      const user = await User.findOne(query).select("+password");

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (user.isActive === false) {
        return res.status(403).json({ message: "Account is inactive" });
      }

      const isPasswordValid = await bcryptjs.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = signToken(user);

      res.json({
        message: "Login successful",
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email || null,
            phone: user.phone || null,
            username: user.username || null,
            role: user.role,
            shopId: user.shopId,
            isActive: user.isActive,
            createdAt: user.createdAt
          },
          token
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ✅ CHECK IF ADMIN EXISTS
  adminExists: async (req, res) => {
    try {
      const count = await User.countDocuments({ role: "admin" });

      return res.json({
        exists: count > 0
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ✅ ADMIN REGISTER ONLY
  registerAdmin: async (req, res) => {
    try {
      const { name, email, password, adminKey } = req.body;

      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ message: "Name, email and password are required" });
      }

      const adminCount = await User.countDocuments({ role: "admin" });

      if (adminCount > 0) {
        const requiredKey = process.env.ADMIN_REGISTER_KEY;

        if (requiredKey && adminKey !== requiredKey) {
          return res
            .status(403)
            .json({ message: "Admin registration is disabled" });
        }
      }

      const existingEmail = await User.findOne({ email });

      if (existingEmail) {
        return res.status(409).json({ message: "Email already registered" });
      }

      const hashedPassword = await bcryptjs.hash(password, 10);

      const user = await User.create({
        name,
        email,
        phone: null,
        username: null,
        password: hashedPassword,
        role: "admin",
        shopId: null,
        isActive: true
      });

      const token = signToken(user);

      res.status(201).json({
        message: "Admin registration successful",
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: null,
            username: null,
            role: user.role,
            shopId: null,
            isActive: user.isActive
          },
          token
        }
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: "Email already exists" });
      }
      res.status(500).json({ message: error.message });
    }
  }
};