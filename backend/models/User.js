const mongoose = require('mongoose');

// This defines what a User document looks like in MongoDB
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,  // Name is mandatory
    trim: true       // Remove extra spaces
  },
  email: {
    type: String,
    required: true,
    unique: true,    // No two users can have same email
    lowercase: true  // Always store email in lowercase
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],  // Only these two values allowed
    default: 'user'           // New accounts are regular users
  },
  isVerified: {
    type: Boolean,
    default: false  // Email not verified yet when account created
  },
  verificationToken: String,  // Token sent in verification email
  resetPasswordToken: String, // Token for forgot password
  resetPasswordExpires: Date  // When the reset token expires
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('User', userSchema);