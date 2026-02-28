import express from 'express';
import { adminController } from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Admin routes
router.get('/dashboard', authMiddleware, roleMiddleware('admin'), adminController.getDashboard);
router.get('/shops', authMiddleware, roleMiddleware('admin'), adminController.getShops);
router.get('/all-shops', authMiddleware, roleMiddleware('admin'), adminController.getAllShops);
router.post('/shops', authMiddleware, roleMiddleware('admin'), adminController.createShop);
router.put('/shops/:id', authMiddleware, roleMiddleware('admin'), adminController.updateShop);
router.delete('/shops/:id', authMiddleware, roleMiddleware('admin'), adminController.deleteShop);
router.get('/products', authMiddleware, roleMiddleware('admin'), adminController.getProducts);
router.get('/staff-performance', authMiddleware, roleMiddleware('admin'), adminController.getStaffPerformance);
router.get('/staff-performance/:staffId', authMiddleware, roleMiddleware('admin'), adminController.getStaffDetailedPerformance);
router.get('/shop-staff-performance/:shopId', authMiddleware, roleMiddleware('admin'), adminController.getShopStaffPerformance);

export default router;
