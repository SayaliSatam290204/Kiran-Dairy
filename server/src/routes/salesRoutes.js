import express from 'express';
import { salesController } from '../controllers/salesController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Sales routes
router.get('/', authMiddleware, (req, res) => {
  res.json({ message: 'Get all sales' });
});
router.post('/', authMiddleware, salesController.create);

export default router;
