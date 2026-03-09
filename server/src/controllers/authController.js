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
  // ✅ LOGIN (Admin: email + password) | (Shop: phone + password)
  login: async (req, res) => {
    try {
      const { email, phone, password } = req.body;

      if (!password || (!email && !phone)) {
        return res
          .status(400)
          .json({ message: "Email/Phone and password are required" });
      }

      const query = email ? { email } : { phone };

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
            role: user.role,
            shopId: user.shopId,
            isActive: user.isActive,
          },
          token,
        },
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
        exists: count > 0,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * ✅ ADMIN REGISTER ONLY
   */
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
        password: hashedPassword,
        role: "admin",
        shopId: null,
        isActive: true,
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
            role: user.role,
            shopId: null,
            isActive: user.isActive,
          },
          token,
        },
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: "Email already exists" });
      }
      res.status(500).json({ message: error.message });
    }
  },

  // ✅ GET USER PROFILE
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "Profile retrieved successfully",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ✅ UPDATE USER PROFILE
  updateProfile: async (req, res) => {
    try {
      const { name, email, password, newPassword } = req.body;

      const user = await User.findById(req.user.id).select("+password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // If updating password, verify old password
      if (newPassword) {
        if (!password) {
          return res
            .status(400)
            .json({ message: "Current password is required" });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: "Incorrect current password" });
        }

        user.password = await bcryptjs.hash(newPassword, 10);
      }

      // Update name if provided
      if (name) user.name = name;

      // Update email if provided and not already in use
      if (email && email !== user.email) {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
          return res.status(409).json({ message: "Email already in use" });
        }
        user.email = email;
      }

      await user.save();

      res.json({
        message: "Profile updated successfully",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ✅ CHANGE PASSWORD
  changePassword: async (req, res) => {
    try {
      const { password, newPassword } = req.body;

      if (!password || !newPassword) {
        return res
          .status(400)
          .json({ message: "Current password and new password are required" });
      }

      const user = await User.findById(req.user.id).select("+password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordValid = await bcryptjs.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Incorrect current password" });
      }

      user.password = await bcryptjs.hash(newPassword, 10);
      await user.save();

      res.json({
        message: "Password changed successfully",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};