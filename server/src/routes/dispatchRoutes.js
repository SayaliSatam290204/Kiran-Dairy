import express from 'express';
import { dispatchController } from '../controllers/dispatchController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Dispatch routes
router.get('/', authMiddleware, dispatchController.getAll || ((req, res) => res.json({ message: 'Get all dispatches' })));
router.post('/', authMiddleware, dispatchController.create);

export default router;
