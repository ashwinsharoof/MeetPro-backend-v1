const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'], // Basic email validation
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimum length for password
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number'], // Basic mobile number validation
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'expert'], // Allow only 'admin' or 'user'
    default: 'user', // Default role is 'user'
  },
  timestamps: true, // Automatically adds createdAt and updatedAt timestamps
});

const User = mongoose.model('User', userSchema);

module.exports = User;
