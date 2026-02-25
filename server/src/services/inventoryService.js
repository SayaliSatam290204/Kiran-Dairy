import Inventory from '../models/Inventory.js';
import StockLedger from '../models/StockLedger.js';

export const inventoryService = {
  async updateInventory(shopId, productId, quantity, transactionType, referenceId = null) {
    try {
      const inventory = await Inventory.findOneAndUpdate(
        { shopId, productId },
        { $inc: { quantity } },
        { new: true, upsert: true }
      );

      await StockLedger.create({
        shopId,
        productId,
        transactionType,
        quantity,
        referenceId,
        referenceType: transactionType === 'dispatch_in' ? 'dispatch' : transactionType === 'sale_out' ? 'sale' : 'return'
      });

      return inventory;
    } catch (error) {
      throw error;
    }
  },

  async getInventory(shopId) {
    try {
      return await Inventory.find({ shopId })
        .populate('productId')
        .populate('shopId');
    } catch (error) {
      throw error;
    }
  }
};
