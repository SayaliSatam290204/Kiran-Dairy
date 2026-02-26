import mongoose from 'mongoose';
import Inventory from '../models/Inventory.js';
import Sale from '../models/Sale.js';
import Dispatch from '../models/Dispatch.js';
import { responseHelper } from '../utils/responseHelper.js';

export const shopController = {
  getDashboard: async (req, res) => {
    try {
      const shopId = req.user.shopId;

      // Total inventory for this shop
      const totalInventoryResult = await Inventory.aggregate([
        { $match: { shopId: new mongoose.Types.ObjectId(shopId) } },
        {
          $group: {
            _id: null,
            totalInventory: { $sum: '$quantity' }
          }
        }
      ]);
      const totalInventory = totalInventoryResult[0]?.totalInventory || 0;

      // Total sales for today
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const totalSalesResult = await Sale.aggregate([
        {
          $match: {
            shopId: new mongoose.Types.ObjectId(shopId),
            createdAt: { $gte: todayStart, $lte: todayEnd }
          }
        },
        {
          $group: {
            _id: null,
            totalSales: { $sum: 1 }
          }
        }
      ]);
      const totalSales = totalSalesResult[0]?.totalSales || 0;

      // Total received dispatches
      const totalReturns = await Dispatch.countDocuments({
        shopId,
        status: 'received'
      });

      responseHelper.success(res, {
        totalInventory,
        totalSales,
        totalReturns
      }, 'Shop dashboard data fetched successfully');
    } catch (error) {
      console.error('Error fetching shop dashboard:', error);
      responseHelper.error(res, 'Failed to fetch shop dashboard data', 500);
    }
  }
};
