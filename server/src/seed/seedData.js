import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import User from '../models/User.js';
import Shop from '../models/Shop.js';
import Product from '../models/Product.js';
import connectDB from '../config/db.js';

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Shop.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    const hashedPassword = await bcryptjs.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@kiran-dairy.com',
      password: hashedPassword,
      role: 'admin'
    });

    // Create shops
    const shop1 = await Shop.create({
      name: 'Kiran Dairy - Branch 1',
      location: 'Mumbai',
      ownerName: 'John Doe',
      contactNo: '9876543210',
      email: 'branch1@kiran-dairy.com',
      address: '123 Main Street, Mumbai'
    });

    const shop2 = await Shop.create({
      name: 'Kiran Dairy - Branch 2',
      location: 'Delhi',
      ownerName: 'Jane Smith',
      contactNo: '9876543211',
      email: 'branch2@kiran-dairy.com',
      address: '456 Church Lane, Delhi'
    });

    // Create shop users
    const shop1User = await User.create({
      name: 'Shop Manager 1',
      email: 'shop1@kiran-dairy.com',
      password: hashedPassword,
      role: 'shop',
      shopId: shop1._id
    });

    const shop2User = await User.create({
      name: 'Shop Manager 2',
      email: 'shop2@kiran-dairy.com',
      password: hashedPassword,
      role: 'shop',
      shopId: shop2._id
    });

    // Create products
    const products = await Product.insertMany([
      {
        name: 'Fresh Milk',
        sku: 'MILK-001',
        description: 'Pure fresh cow milk',
        price: 60,
        unit: 'liter',
        category: 'Dairy'
      },
      {
        name: 'Yogurt',
        sku: 'YOGURT-001',
        description: 'Plain yogurt',
        price: 40,
        unit: 'kg',
        category: 'Dairy'
      },
      {
        name: 'Butter',
        sku: 'BUTTER-001',
        description: 'Fresh butter',
        price: 450,
        unit: 'kg',
        category: 'Dairy'
      },
      {
        name: 'Paneer',
        sku: 'PANEER-001',
        description: 'Indian cottage cheese',
        price: 250,
        unit: 'kg',
        category: 'Dairy'
      },
      {
        name: 'Ghee',
        sku: 'GHEE-001',
        description: 'Pure clarified butter',
        price: 800,
        unit: 'liter',
        category: 'Dairy'
      }
    ]);

    console.log('✅ Seed data created successfully');
    console.log(`📝 Admin created: admin@kiran-dairy.com`);
    console.log(`🏪 Shops created: ${shop1.name}, ${shop2.name}`);
    console.log(`📦 Products created: ${products.length} items`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
