require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    // Delete existing admin if any
    await User.deleteOne({ email: 'admin@pizzaapp.com' });

    const hashedPw = await bcrypt.hash('Admin@123', 10);
    const admin = await User.create({
      name: 'Pizza Admin',
      email: 'admin@pizzaapp.com',
      password: hashedPw,
      role: 'admin',
      isVerified: true
    });
    console.log('✅ Admin created successfully!');
    console.log('📧 Email: admin@pizzaapp.com');
    console.log('🔑 Password: Admin@123');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
});
