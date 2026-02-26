import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import shopRoutes from './routes/shopRoutes.js';
import dispatchRoutes from './routes/dispatchRoutes.js';
import salesRoutes from './routes/salesRoutes.js';
import returnRoutes from './routes/returnRoutes.js';
import ledgerRoutes from './routes/ledgerRoutes.js';
import { errorMiddleware } from "./middleware/errorMiddleware.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/dispatch', dispatchRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/return', returnRoutes);
app.use('/api/ledger', ledgerRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;
