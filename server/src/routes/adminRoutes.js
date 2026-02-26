import express from 'express';
import { adminController } from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Admin routes
router.get('/dashboard', authMiddleware, roleMiddleware('admin'), adminController.getDashboard);

export default router;
