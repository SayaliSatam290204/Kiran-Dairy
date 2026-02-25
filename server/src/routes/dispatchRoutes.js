import express from 'express';

const router = express.Router();

// Dispatch routes to be implemented
router.get('/', (req, res) => {
  res.json({ message: 'Get all dispatches' });
});

export default router;
