import express from "express";
import { authController } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ NEW: Admin Registration
router.post("/admin/register", authController.registerAdmin);

// ✅ Check if admin exists (for registration flow)
router.get("/admin/exists", authController.adminExists);

// ✅ Login (Admin/Shop)
router.post("/login", authController.login);

// ✅ Get Profile (Protected)
router.get("/profile", authMiddleware, authController.getProfile);

// ✅ Update Profile (Protected)
router.put("/profile", authMiddleware, authController.updateProfile);

// ✅ Change Password (Protected)
router.post("/change-password", authMiddleware, authController.changePassword);

export default router;