import express from 'express';

const router = express.Router();

// Ledger routes to be implemented
router.get('/', (req, res) => {
  res.json({ message: 'Get ledger' });
});

export default router;
