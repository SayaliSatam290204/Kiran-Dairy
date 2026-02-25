import express from 'express';

const router = express.Router();

// Admin routes to be implemented
router.get('/dashboard', (req, res) => {
  res.json({ message: 'Admin dashboard' });
});

export default router;
