import express from 'express';

const router = express.Router();

// Return routes to be implemented
router.get('/', (req, res) => {
  res.json({ message: 'Get all returns' });
});

export default router;
