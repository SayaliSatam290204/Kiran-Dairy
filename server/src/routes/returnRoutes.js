import express from 'express';
import { returnController } from '../controllers/returnController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Middleware to check if user is admin or shop manager
const allowAdminAndShop = [authMiddleware, roleMiddleware(['admin', 'shop'])];

// Get pending returns count (admin only - for notifications)
router.get('/pending/count', authMiddleware, roleMiddleware(['admin']), returnController.getPendingCount);

// Get all returns
router.get('/', allowAdminAndShop, returnController.getAll);

// Get return by ID
router.get('/:id', allowAdminAndShop, returnController.getById);

// Create new return (shop manager creates returns)
router.post('/', allowAdminAndShop, returnController.create);

// Update return status (admin only)
router.put('/:id/status', authMiddleware, roleMiddleware(['admin']), returnController.updateStatus);

// Delete return (only pending returns can be deleted)
router.delete('/:id', allowAdminAndShop, returnController.deleteReturn);

export default router;
