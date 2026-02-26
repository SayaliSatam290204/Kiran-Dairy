import express from 'express';
import { returnController } from '../controllers/returnController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Return routes
router.get('/', authMiddleware, returnController.getAll || ((req, res) => res.json({ message: 'Get all returns' })));
router.post('/', authMiddleware, returnController.create);

export default router;
