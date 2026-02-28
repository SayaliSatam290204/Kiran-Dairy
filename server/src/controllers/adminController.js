import Shop from "../models/Shop.js";
import Inventory from "../models/Inventory.js";
import Dispatch from "../models/Dispatch.js";
import Return from "../models/Return.js";
import Product from "../models/Product.js";
import Staff from "../models/Staff.js";
import Sale from "../models/Sale.js";
import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import { staffPerformanceService } from "../services/staffPerformanceService.js";
import { responseHelper } from "../utils/responseHelper.js";

export const adminController = {
  getDashboard: async (req, res) => {
    try {
      const totalShops = await Shop.countDocuments({ isActive: true });

      const totalStockResult = await Inventory.aggregate([
        { $group: { _id: null, totalStock: { $sum: "$quantity" } } }
      ]);
      const totalStock = totalStockResult[0]?.totalStock || 0;

      const totalDispatches = await Dispatch.countDocuments();

      const dispatchesByStatus = await Dispatch.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]);

      const pendingReturns = await Return.countDocuments({ status: "pending" });

      const totalRevenueResult = await Sale.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
      ]);
      const totalRevenue = totalRevenueResult[0]?.totalRevenue || 0;

      const totalStaff = await Staff.countDocuments();
      const activeStaff = await Staff.countDocuments({ status: "active" });

      const allStaffPerformance = await staffPerformanceService.getAllStaffPerformance();
      const topPerformers = allStaffPerformance.slice(0, 5);

      const activeShops = await Dispatch.aggregate([
        { $group: { _id: "$shopId", dispatchCount: { $sum: 1 } } },
        { $sort: { dispatchCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "shops",
            localField: "_id",
            foreignField: "_id",
            as: "shopDetails"
          }
        }
      ]);

      responseHelper.success(
        res,
        {
          totalShops,
          totalStock,
          totalDispatches,
          dispatchesByStatus,
          pendingReturns,
          totalRevenue,
          totalStaff,
          activeStaff,
          topPerformers,
          activeShops
        },
        "Dashboard data fetched successfully"
      );
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      responseHelper.error(res, "Failed to fetch dashboard data", 500);
    }
  },

  getShops: async (req, res) => {
    try {
      const shops = await Shop.find({ isActive: true })
        .select("_id name location ownerName")
        .limit(100);

      responseHelper.success(res, shops, "Shops fetched successfully");
    } catch (error) {
      console.error("Error fetching shops:", error);
      responseHelper.error(res, "Failed to fetch shops", 500);
    }
  },

  getProducts: async (req, res) => {
    try {
      const products = await Product.find().select("_id name category").limit(100);

      responseHelper.success(res, products, "Products fetched successfully");
    } catch (error) {
      console.error("Error fetching products:", error);
      responseHelper.error(res, "Failed to fetch products", 500);
    }
  },

  getStaffPerformance: async (req, res) => {
    try {
      const staffPerformance = await staffPerformanceService.getAllStaffPerformance();

      responseHelper.success(res, staffPerformance, "Staff performance fetched successfully");
    } catch (error) {
      console.error("Error fetching staff performance:", error);
      responseHelper.error(res, "Failed to fetch staff performance", 500);
    }
  },

  getStaffDetailedPerformance: async (req, res) => {
    try {
      const { staffId } = req.params;
      const year = parseInt(req.query.year) || new Date().getFullYear();
      const month = parseInt(req.query.month) || new Date().getMonth() + 1;

      if (!staffId) return responseHelper.error(res, "Staff ID is required", 400);

      const performance = await staffPerformanceService.getStaffDetailedPerformance(
        staffId,
        year,
        month
      );

      responseHelper.success(res, performance, "Staff detailed performance fetched successfully");
    } catch (error) {
      console.error("Error fetching staff detailed performance:", error);
      responseHelper.error(res, "Failed to fetch staff detailed performance", 500);
    }
  },

  getShopStaffPerformance: async (req, res) => {
    try {
      const { shopId } = req.params;
      const period = req.query.period || "monthly";
      const year = parseInt(req.query.year) || new Date().getFullYear();
      const month = parseInt(req.query.month) || new Date().getMonth() + 1;
      const date = req.query.date ? new Date(req.query.date) : new Date();

      if (!shopId) return responseHelper.error(res, "Shop ID is required", 400);

      let performance;
      if (period === "daily") {
        performance = await staffPerformanceService.getShopDailyPerformanceByShift(shopId, date);
      } else if (period === "yearly") {
        performance = await staffPerformanceService.getShopYearlyPerformanceByShift(shopId, year);
      } else {
        performance = await staffPerformanceService.getShopMonthlyPerformanceByShift(
          shopId,
          year,
          month
        );
      }

      responseHelper.success(res, performance, `Shop staff ${period} performance fetched successfully`);
    } catch (error) {
      console.error("Error fetching shop staff performance:", error);
      responseHelper.error(res, "Failed to fetch shop staff performance", 500);
    }
  },

  getAllShops: async (req, res) => {
    try {
      const shops = await Shop.find()
        .select("_id name location ownerName contactNo email address isActive createdAt")
        .sort("-createdAt");

      responseHelper.success(res, shops, "All shops fetched successfully");
    } catch (error) {
      console.error("Error fetching shops:", error);
      responseHelper.error(res, "Failed to fetch shops", 500);
    }
  },

  // ✅ Create new shop (Shop login: phone = contactNo, password = contactNo)
  createShop: async (req, res) => {
    try {
      const { name, location, ownerName, contactNo, email, address, isActive } = req.body;

      // ✅ Validate required fields (password not required from UI)
      if (!name || !location || !ownerName || !contactNo || !email || !address) {
        return responseHelper.error(res, "All fields are required", 400);
      }

      // ✅ Normalize phone (simple)
      const phone = String(contactNo).trim();

      // ✅ Check if shop email already exists
      const existingShopByEmail = await Shop.findOne({ email });
      if (existingShopByEmail) {
        return responseHelper.error(res, "Shop with this email already exists", 400);
      }

      // ✅ Check if shop contactNo already exists (recommended)
      const existingShopByPhone = await Shop.findOne({ contactNo: phone });
      if (existingShopByPhone) {
        return responseHelper.error(res, "Shop with this contact number already exists", 400);
      }

      // ✅ Check if user with this email already exists
      const existingUserByEmail = await User.findOne({ email });
      if (existingUserByEmail) {
        return responseHelper.error(res, "User account with this email already exists", 400);
      }

      // ✅ Check if user with this phone already exists
      const existingUserByPhone = await User.findOne({ phone });
      if (existingUserByPhone) {
        return responseHelper.error(res, "User account with this phone already exists", 400);
      }

      // ✅ Create shop
      const shop = await Shop.create({
        name,
        location,
        ownerName,
        contactNo: phone,
        email,
        address,
        isActive: isActive ?? true
      });

      // ✅ Password = phone number (hashed)
      const hashedPassword = await bcryptjs.hash(phone, 10);

      // ✅ Create shop user (IMPORTANT: store phone!)
      const user = await User.create({
        name: ownerName,
        email,       // keep it, optional for login
        phone,       // ✅ username = phone
        password: hashedPassword,
        role: "shop",
        shopId: shop._id,
        isActive: true
      });

      responseHelper.success(
        res,
        {
          shop,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            username: user.phone // ✅ phone is username
          }
        },
        "Shop and user account created successfully (Login: phone = password)",
        201
      );
    } catch (error) {
      console.error("Error creating shop:", error);

      if (error.code === 11000) {
        // duplicate key error (email/phone unique)
        return responseHelper.error(res, "Email/Phone already exists", 400);
      }
      return responseHelper.error(res, "Failed to create shop", 500);
    }
  },

  updateShop: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, location, ownerName, contactNo, email, address, isActive } = req.body;

      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return responseHelper.error(res, "Invalid shop ID", 400);
      }

      const shop = await Shop.findById(id);
      if (!shop) return responseHelper.error(res, "Shop not found", 404);

      if (email && email !== shop.email) {
        const existingShop = await Shop.findOne({ email });
        if (existingShop) return responseHelper.error(res, "Email already exists", 400);
      }

      // ✅ also protect contactNo duplicates if changed
      if (contactNo && contactNo !== shop.contactNo) {
        const existingShopPhone = await Shop.findOne({ contactNo });
        if (existingShopPhone) return responseHelper.error(res, "Contact number already exists", 400);
      }

      if (name) shop.name = name;
      if (location) shop.location = location;
      if (ownerName) shop.ownerName = ownerName;
      if (contactNo) shop.contactNo = contactNo;
      if (email) shop.email = email;
      if (address) shop.address = address;
      if (isActive !== undefined) shop.isActive = isActive;

      await shop.save();

      responseHelper.success(res, shop, "Shop updated successfully");
    } catch (error) {
      console.error("Error updating shop:", error);
      responseHelper.error(res, "Failed to update shop", 500);
    }
  },

  deleteShop: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return responseHelper.error(res, "Invalid shop ID", 400);
      }

      const shop = await Shop.findById(id);
      if (!shop) return responseHelper.error(res, "Shop not found", 404);

      const inventoryCount = await Inventory.countDocuments({ shopId: id });
      const saleCount = await Sale.countDocuments({ shopId: id });

      if (inventoryCount > 0 || saleCount > 0) {
        return responseHelper.error(
          res,
          "Cannot delete shop with existing inventory or sales. Deactivate instead.",
          400
        );
      }

      await Shop.findByIdAndDelete(id);
      responseHelper.success(res, null, "Shop deleted successfully");
    } catch (error) {
      console.error("Error deleting shop:", error);
      responseHelper.error(res, "Failed to delete shop", 500);
    }
  }
};