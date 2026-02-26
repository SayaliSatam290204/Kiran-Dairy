import Shop from '../models/Shop.js';
import Inventory from '../models/Inventory.js';
import Dispatch from '../models/Dispatch.js';
import { responseHelper } from '../utils/responseHelper.js';

export const adminController = {
  getDashboard: async (req, res) => {
    try {
      const totalShops = await Shop.countDocuments({ isActive: true });
      
      const totalStockResult = await Inventory.aggregate([
        {
          $group: {
            _id: null,
            totalStock: { $sum: '$quantity' }
          }
        }
      ]);
      const totalStock = totalStockResult[0]?.totalStock || 0;
      
      const totalDispatches = await Dispatch.countDocuments({ status: 'dispatched' });
      
      responseHelper.success(res, {
        totalShops,
        totalStock,
        totalDispatches
      }, 'Dashboard data fetched successfully');
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      responseHelper.error(res, 'Failed to fetch dashboard data', 500);
    }
  }
};
