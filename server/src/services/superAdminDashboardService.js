import Sale from "../models/Sale.js";
import Shop from "../models/Shop.js";
import Product from "../models/Product.js";
import Inventory from "../models/Inventory.js";
import Staff from "../models/Staff.js";
import Dispatch from "../models/Dispatch.js";
import Return from "../models/Return.js";

export const getSuperAdminDashboard = async () => {
  try {
    console.log("=== Starting Dashboard Data Fetch ===");

    // Get all shops
    console.log("Fetching shops...");
    const shops = await Shop.find({ isActive: true }).lean();
    console.log(`Found ${shops.length} shops`);
    
    if (shops.length === 0) {
      console.log("No shops found, returning empty dashboard");
      return {
        summary: {
          totalBranches: 0,
          totalProducts: 0,
          totalProductsStocked: 0,
          totalStockValue: 0,
          totalSalesTransactions: 0,
          totalReturns: 0,
          totalRevenue: 0,
          totalExpectedRevenue: 0,
          totalStaff: 0,
          topBranches: []
        },
        branchAnalytics: [],
        productDistribution: [],
        shops: []
      };
    }

    const shopIds = shops.map(s => s._id);

    // Get basic stats
    console.log("Fetching sales...");
    const allSales = await Sale.find({ shopId: { $in: shopIds } }).lean();
    const totalRevenue = allSales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);

    console.log("Fetching returns...");
    const allReturns = await Return.find({ shopId: { $in: shopIds } }).lean();
    const totalReturns = allReturns.length;

    console.log("Fetching staff...");
    const allStaff = await Staff.find({ shopId: { $in: shopIds }, isActive: true }).lean();

    console.log("Fetching products...");
    const allProducts = await Product.find().lean();

    console.log("Fetching inventory...");
    const allInventory = await Inventory.find({ shopId: { $in: shopIds } }).lean();
    const totalStock = allInventory.reduce((sum, inv) => sum + (inv.quantity || 0), 0);

    // Build branch analytics
    console.log("Building branch analytics...");
    const branchAnalytics = shops.map(shop => {
      const shopSales = allSales.filter(s => s.shopId.toString() === shop._id.toString());
      const shopRevenue = shopSales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
      const shopInventory = allInventory.filter(inv => inv.shopId.toString() === shop._id.toString());
      const shopStaff = allStaff.filter(s => s.shopId.toString() === shop._id.toString());
      const shopReturns = allReturns.filter(r => r.shopId.toString() === shop._id.toString());

      return {
        shopId: shop._id,
        shopName: shop.name,
        location: shop.location,
        ownerName: shop.ownerName,
        contactNo: shop.contactNo,
        email: shop.email,
        actualRevenue: shopRevenue,
        expectedRevenue: 0,
        revenueDifference: 0,
        totalTransactions: shopSales.length,
        avgTransactionValue: shopSales.length > 0 ? shopRevenue / shopSales.length : 0,
        productsCount: shopInventory.length,
        totalStockValue: shopInventory.reduce((sum, inv) => sum + (inv.quantity || 0), 0),
        productDetails: [],
        staffCount: shopStaff.length,
        dispatchesReceived: 0,
        dispatchesPending: 0,
        returnsCount: shopReturns.length,
        returnValue: shopReturns.reduce((sum, ret) => sum + (ret.totalRefund || 0), 0)
      };
    });

    // Build product distribution
    console.log("Building product distribution...");
    const productDistribution = allProducts.map(product => {
      const productInventory = allInventory.filter(inv => inv.productId.toString() === product._id.toString());
      const productSales = allSales.filter(sale =>
        sale.items && sale.items.some(item => item.productId.toString() === product._id.toString())
      );
      const productRevenue = productSales.reduce((sum, sale) => {
        const item = sale.items.find(i => i.productId.toString() === product._id.toString());
        return sum + (item?.subtotal || 0);
      }, 0);

      return {
        productId: product._id,
        productName: product.name,
        category: product.category || 'N/A',
        price: product.price || 0,
        totalQuantity: productInventory.reduce((sum, inv) => sum + (inv.quantity || 0), 0),
        branchesStocking: productInventory.length,
        branchDistribution: productInventory.map(inv => ({
          shopName: shops.find(s => s._id.toString() === inv.shopId.toString())?.name || 'Unknown',
          quantity: inv.quantity
        })),
        totalRevenue: productRevenue
      };
    });

    // Build summary
    const summary = {
      totalBranches: shops.length,
      totalProducts: allProducts.length,
      totalProductsStocked: allInventory.length,
      totalStockValue: totalStock,
      totalSalesTransactions: allSales.length,
      totalReturns: totalReturns,
      totalRevenue: totalRevenue,
      totalExpectedRevenue: 0,
      totalStaff: allStaff.length,
      topBranches: branchAnalytics
        .sort((a, b) => b.actualRevenue - a.actualRevenue)
        .slice(0, 5)
        .map(({ shopName, actualRevenue, expectedRevenue, totalTransactions }) => ({
          shopName,
          actualRevenue,
          expectedRevenue,
          totalTransactions
        }))
    };

    console.log("=== Dashboard Data Fetch Complete ===");
    console.log("Summary:", summary);

    return {
      summary,
      branchAnalytics,
      productDistribution,
      shops: shops.map(s => ({
        id: s._id,
        name: s.name,
        location: s.location,
        ownerName: s.ownerName
      }))
    };
  } catch (error) {
    console.error("=== ERROR in getSuperAdminDashboard ===");
    console.error("Error details:", error);
    console.error("Error stack:", error.stack);
    throw error;
  }
};

export const getBranchReport = async (shopId) => {
  try {
    const shop = await Shop.findById(shopId);
    if (!shop) throw new Error("Shop not found");

    const sales = await Sale.find({ shopId }).lean();
    const inventory = await Inventory.find({ shopId }).lean();
    const staff = await Staff.find({ shopId, isActive: true }).lean();
    const returns = await Return.find({ shopId }).lean();

    const totalRevenue = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
    const expectedRevenue = 0;

    return {
      branch: shop,
      salesCount: sales.length,
      totalRevenue,
      expectedRevenue,
      revenueDifference: expectedRevenue - totalRevenue,
      inventory,
      staff,
      dispatches: [],
      returns: returns.length,
      returnValue: returns.reduce((sum, r) => sum + (r.totalRefund || 0), 0)
    };
  } catch (error) {
    console.error("Error in getBranchReport:", error);
    throw error;
  }
};

export const getRevenueTrends = async (startDate, endDate) => {
  try {
    const sales = await Sale.find({
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
    })
      .lean();

    const shops = await Shop.find({ isActive: true }).lean();

    const trends = shops.map(shop => {
      const shopSales = sales.filter(s => s.shopId.toString() === shop._id.toString());
      const revenue = shopSales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
      return {
        shopName: shop.name,
        revenue,
        transactions: shopSales.length
      };
    });

    return trends.sort((a, b) => b.revenue - a.revenue);
  } catch (error) {
    console.error("Error in getRevenueTrends:", error);
    throw error;
  }
};
