import StockLedger from '../models/StockLedger.js';
import Inventory from '../models/Inventory.js';
import Product from '../models/Product.js';
import Shop from '../models/Shop.js';
import { responseHelper } from '../utils/responseHelper.js';

const STOCK_ALERT_THRESHOLD = 15; // ⚠️ Alert when stock falls to or below 15 units

export const ledgerController = {
  // ✅ Get all ledger entries (admin view)
  getLedger: async (req, res) => {
    try {
      const ledger = await StockLedger.find()
        .populate('shopId', 'name location')
        .populate('productId', 'name sku category price')
        .sort('-transactionDate')
        .limit(500);

      responseHelper.success(res, ledger, 'Ledger fetched successfully');
    } catch (error) {
      console.error('Error fetching ledger:', error);
      responseHelper.error(res, 'Failed to fetch ledger', 500);
    }
  },

  // ✅ Get ledger by shop (shop view)
  getLedgerByShop: async (req, res) => {
    try {
      const { shopId } = req.params;

      const ledger = await StockLedger.find({ shopId })
        .populate('shopId', 'name location')
        .populate('productId', 'name sku category price')
        .sort('-transactionDate')
        .limit(300);

      responseHelper.success(res, ledger, 'Shop ledger fetched successfully');
    } catch (error) {
      console.error('Error fetching shop ledger:', error);
      responseHelper.error(res, 'Failed to fetch shop ledger', 500);
    }
  },

  // ✅ Get ledger by product
  getLedgerByProduct: async (req, res) => {
    try {
      const { productId } = req.params;

      const ledger = await StockLedger.find({ productId })
        .populate('shopId', 'name location')
        .populate('productId', 'name sku category price')
        .sort('-transactionDate')
        .limit(200);

      responseHelper.success(res, ledger, 'Product ledger fetched successfully');
    } catch (error) {
      console.error('Error fetching product ledger:', error);
      responseHelper.error(res, 'Failed to fetch product ledger', 500);
    }
  },

  // ✅ Get stock alerts (products with stock <= 20)
  getStockAlerts: async (req, res) => {
    try {
      const { shopId } = req.query;

      let query = {};
      if (shopId) {
        query.shopId = shopId;
      }

      // Find all inventory items where quantity <= STOCK_ALERT_THRESHOLD
      const lowStockItems = await Inventory.find({
        ...query,
        quantity: { $lte: STOCK_ALERT_THRESHOLD }
      })
        .populate('shopId', '_id name location ownerName')
        .populate('productId', '_id name sku category price unit imageUrl')
        .sort('quantity'); // Sort by lowest stock first

      // Enrich with ledger history
      const enhancedAlerts = await Promise.all(
        lowStockItems.map(async (item) => {
          const recentTransactions = await StockLedger.find({
            shopId: item.shopId._id,
            productId: item.productId._id
          })
            .sort('-transactionDate')
            .limit(5);

          return {
            ...item.toObject(),
            alertStatus:
              item.quantity === 0
                ? 'OUT_OF_STOCK'
                : item.quantity <= 5
                ? 'CRITICAL'
                : 'LOW',
            recentTransactions
          };
        })
      );

      responseHelper.success(
        res,
        enhancedAlerts,
        `Found ${enhancedAlerts.length} products with low stock (≤ ${STOCK_ALERT_THRESHOLD} units)`
      );
    } catch (error) {
      console.error('Error fetching stock alerts:', error);
      responseHelper.error(res, 'Failed to fetch stock alerts', 500);
    }
  },

  // ✅ Get stock alert count (for badge/notification in UI)
  getAlertCount: async (req, res) => {
    try {
      const { shopId } = req.query;

      let query = { quantity: { $lte: STOCK_ALERT_THRESHOLD } };
      if (shopId) {
        query.shopId = shopId;
      }

      const criticalCount = await Inventory.countDocuments({
        quantity: { $lte: 5 }
      }); // OUT or CRITICAL

      const lowCount = await Inventory.countDocuments({
        quantity: { $gt: 5, $lte: STOCK_ALERT_THRESHOLD }
      }); // LOW

      const totalAlerts = await Inventory.countDocuments(query);

      responseHelper.success(
        res,
        {
          totalAlerts,
          criticalCount,
          lowCount,
          threshold: STOCK_ALERT_THRESHOLD
        },
        'Alert counts fetched successfully'
      );
    } catch (error) {
      console.error('Error fetching alert count:', error);
      responseHelper.error(res, 'Failed to fetch alert count', 500);
    }
  },

  // ✅ Get comprehensive stock report (all shops, all products)
  getStockReport: async (req, res) => {
    try {
      const shops = await Shop.find({ isActive: true }).select('_id name location ownerName');

      const report = await Promise.all(
        shops.map(async (shop) => {
          const inventory = await Inventory.find({ shopId: shop._id })
            .populate('productId', 'name sku category price unit')
            .sort('-quantity');

          const lowStockProducts = inventory.filter(
            (item) => item.quantity <= STOCK_ALERT_THRESHOLD
          );

          const totalValue = inventory.reduce(
            (sum, item) =>
              sum + ((item.productId?.price || 0) * (item.quantity || 0)),
            0
          );

          const lowStockValue = lowStockProducts.reduce(
            (sum, item) =>
              sum + ((item.productId?.price || 0) * (item.quantity || 0)),
            0
          );

          return {
            shop: {
              _id: shop._id,
              name: shop.name,
              location: shop.location,
              ownerName: shop.ownerName
            },
            totalProducts: inventory.length,
            totalStock: inventory.reduce((sum, item) => sum + item.quantity, 0),
            totalValue,
            lowStockProducts: lowStockProducts.length,
            lowStockValue,
            alertPercentage: (
              (lowStockProducts.length / inventory.length) *
              100
            ).toFixed(2),
            products: inventory
          };
        })
      );

      responseHelper.success(res, report, 'Stock report generated successfully');
    } catch (error) {
      console.error('Error generating stock report:', error);
      responseHelper.error(res, 'Failed to generate stock report', 500);
    }
  },

  // ✅ Create ledger entry (when stock movement happens)
  createLedgerEntry: async (req, res) => {
    try {
      const {
        shopId,
        productId,
        transactionType,
        quantity,
        referenceId,
        referenceType,
        notes
      } = req.body;

      if (!shopId || !productId || !transactionType || !quantity) {
        return responseHelper.error(
          res,
          'ShopId, ProductId, TransactionType, and Quantity are required',
          400
        );
      }

      // Verify shop and product exist
      const shop = await Shop.findById(shopId);
      const product = await Product.findById(productId);

      if (!shop || !product) {
        return responseHelper.error(res, 'Shop or Product not found', 404);
      }

      // Create ledger entry
      const ledgerEntry = new StockLedger({
        shopId,
        productId,
        transactionType,
        quantity,
        referenceId: referenceId || null,
        referenceType: referenceType || null,
        notes: notes || ''
      });

      await ledgerEntry.save();

      // Check if stock is now low and return alert status
      const inventory = await Inventory.findOne({ shopId, productId });
      const isLowStock =
        inventory && inventory.quantity <= STOCK_ALERT_THRESHOLD;

      responseHelper.success(
        res,
        {
          ledgerEntry,
          isLowStock,
          currentStock: inventory?.quantity || 0,
          alertThreshold: STOCK_ALERT_THRESHOLD
        },
        'Ledger entry created successfully',
        201
      );
    } catch (error) {
      console.error('Error creating ledger entry:', error);
      responseHelper.error(res, 'Failed to create ledger entry', 500);
    }
  }
};
