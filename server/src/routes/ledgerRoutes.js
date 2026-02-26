import express from 'express';
import { ledgerController } from '../controllers/ledgerController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ledger routes
router.get('/', authMiddleware, ledgerController.getLedger);

export default router;
