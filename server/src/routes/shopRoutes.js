import express from 'express';
import { shopController } from '../controllers/shopController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Shop routes
router.get('/dashboard', authMiddleware, shopController.getDashboard);

export default router;
