import express from 'express';

const router = express.Router();

// Sales routes to be implemented
router.get('/', (req, res) => {
  res.json({ message: 'Get all sales' });
});

export default router;
