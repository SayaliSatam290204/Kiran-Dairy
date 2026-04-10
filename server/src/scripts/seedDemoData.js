import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import 'dotenv/config';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Shop from '../models/Shop.js';
import Inventory from '../models/Inventory.js';
import Dispatch from '../models/Dispatch.js';
import connectDB from '../config/db.js';

const seedDemoData = async () => {
  try {
    console.log('🌱 Starting seed data generation...\n');
    await connectDB();
    console.log('✅ Connected to database\n');

    // Clear existing demo data
    console.log('🗑️  Clearing existing demo data...');
    await User.deleteMany({});
    await Shop.deleteMany({});
    await Product.deleteMany({});
    await Inventory.deleteMany({});
    await Dispatch.deleteMany({});
    console.log('✅ Database cleared\n');

    // ==================== CREATE PRODUCTS ====================
    console.log('📦 Creating products...');
    const products = await Product.insertMany([
      {
        name: 'Full Cream Milk',
        sku: 'FCM001',
        description: 'Rich and creamy full cream milk.',
        price: 64,
        unit: 'liter',
        category: 'Liquid Milk',
        imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b',
        isActive: true
      },
      {
        name: 'Toned Milk',
        sku: 'TM001',
        description: 'Balanced fat toned milk.',
        price: 56,
        unit: 'liter',
        category: 'Liquid Milk',
        imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
        isActive: true
      },
      {
        name: 'Paneer (Fresh)',
        sku: 'PNR001',
        description: 'Soft and fresh paneer.',
        price: 320,
        unit: 'kg',
        category: 'Cheese & Paneer',
        imageUrl: 'https://images.unsplash.com/photo-1631515243346-54a1e2a4c0c4',
        isActive: true
      },
      {
        name: 'Curd (Dahi)',
        sku: 'CRD001',
        description: 'Fresh homemade style curd.',
        price: 70,
        unit: 'kg',
        category: 'Fermented Products',
        imageUrl: 'https://images.unsplash.com/photo-1604908177522-432c7c2a1d2d',
        isActive: true
      },
      {
        name: 'Butter (Salted)',
        sku: 'BTR001',
        description: 'Fresh salted butter.',
        price: 55,
        unit: 'piece',
        category: 'Fat-rich Products',
        imageUrl: 'https://images.unsplash.com/photo-1589985270958-b6e3b6c8e7d6',
        isActive: true
      },
      {
        name: 'Ghee (Cow)',
        sku: 'GHI001',
        description: 'Pure cow ghee.',
        price: 650,
        unit: 'kg',
        category: 'Fat-rich Products',
        imageUrl: 'https://images.unsplash.com/photo-1633945274405-1f1c8d7e2b5c',
        isActive: true
      }
    ]);
    console.log(`✅ Created ${products.length} products\n`);

    // ==================== CREATE ADMIN USER ====================
    console.log('👨‍💼 Creating admin user...');
    const adminPassword = await bcryptjs.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@kiran-dairy.com',
      password: adminPassword,
      role: 'admin'
    });
    console.log(`✅ Admin created: ${admin.email}\n`);

    // ==================== CREATE SHOPS ====================
    console.log('🏪 Creating shops...');
    const shops = await Shop.insertMany([
      {
        name: 'Kiran Dairy Kharadi',
        location: 'Kharadi, Pune',
        ownerName: 'Raj Sharma',
        contactNo: '9876543210',
        email: 'kharadi@kirandairy.com',
        address: 'Kharadi Market, Pune 411014',
        isActive: true
      },
      {
        name: 'Kiran Dairy Hadapsar',
        location: 'Hadapsar, Pune',
        ownerName: 'Priya Patel',
        contactNo: '9876543211',
        email: 'hadapsar@kirandairy.com',
        address: 'Hadapsar Junction, Pune 411028',
        isActive: true
      },
      {
        name: 'Kiran Dairy Wagholi',
        location: 'Wagholi, Pune',
        ownerName: 'Suresh Desai',
        contactNo: '9876543212',
        email: 'wagholi@kirandairy.com',
        address: 'Wagholi Market, Pune 412207',
        isActive: true
      }
    ]);
    console.log(`✅ Created ${shops.length} shops\n`);

    // ==================== CREATE SHOP USERS ====================
    console.log('👤 Creating shop users...');
    const shopPassword = await bcryptjs.hash('demo123', 10);
    const shopUsers = await User.insertMany([
      {
        name: 'Raj Sharma',
        phone: 'Kiran Dairy Kharadi', // Shop name as username
        email: 'kharadi@kirandairy.com',
        password: shopPassword,
        role: 'shop',
        shopId: shops[0]._id,
        isActive: true
      },
      {
        name: 'Priya Patel',
        phone: 'Kiran Dairy Hadapsar',
        email: 'hadapsar@kirandairy.com',
        password: shopPassword,
        role: 'shop',
        shopId: shops[1]._id,
        isActive: true
      },
      {
        name: 'Suresh Desai',
        phone: 'Kiran Dairy Wagholi',
        email: 'wagholi@kirandairy.com',
        password: shopPassword,
        role: 'shop',
        shopId: shops[2]._id,
        isActive: true
      }
    ]);
    console.log(`✅ Created ${shopUsers.length} shop users\n`);

    // ==================== CREATE DEMO INVENTORY ====================
    console.log('📊 Creating demo inventory...');
    const inventory = [];
    const inventoryData = {
      [shops[0]._id]: [
        { productId: products[0]._id, quantity: 150 }, // Full Cream Milk
        { productId: products[1]._id, quantity: 120 }, // Toned Milk
        { productId: products[2]._id, quantity: 80 },  // Paneer
        { productId: products[3]._id, quantity: 100 }, // Curd
        { productId: products[4]._id, quantity: 50 },  // Butter
        { productId: products[5]._id, quantity: 30 }   // Ghee
      ],
      [shops[1]._id]: [
        { productId: products[0]._id, quantity: 200 },
        { productId: products[1]._id, quantity: 180 },
        { productId: products[2]._id, quantity: 120 },
        { productId: products[3]._id, quantity: 140 },
        { productId: products[4]._id, quantity: 70 },
        { productId: products[5]._id, quantity: 50 }
      ],
      [shops[2]._id]: [
        { productId: products[0]._id, quantity: 100 },
        { productId: products[1]._id, quantity: 80 },
        { productId: products[2]._id, quantity: 60 },
        { productId: products[3]._id, quantity: 70 },
        { productId: products[4]._id, quantity: 40 },
        { productId: products[5]._id, quantity: 25 }
      ]
    };

    for (const [shopId, items] of Object.entries(inventoryData)) {
      for (const item of items) {
        const inv = await Inventory.create({
          shopId: mongoose.Types.ObjectId(shopId),
          productId: item.productId,
          quantity: item.quantity
        });
        inventory.push(inv);
      }
    }
    console.log(`✅ Created ${inventory.length} inventory records\n`);

    // ==================== CREATE DEMO DISPATCH ====================
    console.log('🚚 Creating demo dispatch...');
    const dispatch = await Dispatch.create({
      dispatchNo: 'DISP/000001',
      shopId: shops[0]._id,
      items: [
        { productId: products[0]._id, quantity: 150, status: 'received' },
        { productId: products[2]._id, quantity: 80, status: 'received' },
        { productId: products[4]._id, quantity: 50, status: 'received' }
      ],
      status: 'received',
      isBatchDispatch: false,
      dispatchDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      receivedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    });
    console.log(`✅ Created demo dispatch: ${dispatch.dispatchNo}\n`);

    // ==================== SUMMARY ====================
    console.log('═'.repeat(60));
    console.log('✅ DEMO DATA SEED COMPLETED SUCCESSFULLY\n');
    console.log('📊 SUMMARY:');
    console.log(`   Products:     ${products.length}`);
    console.log(`   Shops:        ${shops.length}`);
    console.log(`   Users:        1 Admin + ${shopUsers.length} Shop managers`);
    console.log(`   Inventory:    ${inventory.length} records`);
    console.log(`   Dispatches:   1\n`);

    console.log('👤 LOGIN CREDENTIALS:');
    console.log('   Admin:');
    console.log('      Email:    admin@kiran-dairy.com');
    console.log('      Password: admin123\n');
    console.log('   Shop Managers:');
    shops.forEach((shop, idx) => {
      console.log(`      ${idx + 1}. ${shop.name}`);
      console.log(`         Username (Phone): ${shopUsers[idx].phone}`);
      console.log(`         Password: demo123`);
    });

    console.log('\n🚀 NEXT STEPS:');
    console.log('   1. Login as admin at /login');
    console.log('   2. Create a dispatch to any shop');
    console.log('   3. Login as shop manager');
    console.log('   4. View inventory');
    console.log('   5. Create a POS sale');
    console.log('   6. Verify inventory decreases\n');

    console.log('═'.repeat(60) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedDemoData();
