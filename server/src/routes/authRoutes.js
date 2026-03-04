import express from "express";
import { authController } from "../controllers/authController.js";

const router = express.Router();

// ✅ NEW: Admin Registration
router.post("/admin/register", authController.registerAdmin);

// ✅ Check if admin exists (for registration flow)
router.get("/admin/exists", authController.adminExists);

// ✅ Login (Admin/Shop)
router.post("/login", authController.login);

export default router;