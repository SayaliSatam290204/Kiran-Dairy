import express from 'express';

const router = express.Router();

// Shop routes to be implemented
router.get('/dashboard', (req, res) => {
  res.json({ message: 'Shop dashboard' });
});

export default router;
