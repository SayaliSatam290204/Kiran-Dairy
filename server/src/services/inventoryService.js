import Inventory from "../models/Inventory.js";
import StockLedger from "../models/StockLedger.js";

export const inventoryService = {
  async updateInventory(shopId, productId, quantity, transactionType, referenceId = null) {
    try {
      const inventory = await Inventory.findOneAndUpdate(
        { shopId, productId },
        {
          $inc: { quantity },
          $set: { lastUpdated: new Date() }
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true
        }
      );

      let referenceType = null;

      if (["dispatch_in", "received"].includes(transactionType)) {
        referenceType = "dispatch";
      } else if (transactionType === "sale_out") {
        referenceType = "sale";
      } else if (["return_in", "return_out", "return_reversal"].includes(transactionType)) {
        referenceType = "return";
      } else if (transactionType === "adjustment") {
        referenceType = "adjustment";
      }

      await StockLedger.create({
        shopId,
        productId,
        transactionType,
        quantity,
        referenceId,
        referenceType
      });

      return inventory;
    } catch (error) {
      throw error;
    }
  },

  async getInventory(shopId) {
    try {
      return await Inventory.find({ shopId })
        .populate("productId")
        .populate("shopId");
    } catch (error) {
      throw error;
    }
  }
};