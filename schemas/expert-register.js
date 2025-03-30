const mongoose = require('mongoose');
const { Schema } = mongoose;

const expertSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{10}$/, 'Please enter a valid mobile number']
  },
  category: {
    type: String,
    required: true
  },
  availability: {
    type: String,  // You can define this to be an enum or a more structured object based on your needs
    required: true
  },
  calendar: {
    type: Map,
    of: Date  // You can store the calendar dates and times here, or you may structure it differently depending on your needs
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'expert'], // Allow only 'admin' or 'user'
    default: 'expert', // Default role is 'user'
  },
  services: [
    {
      type: String,
      enum: ['1:1 Call', 'Webinar', 'Doubt Session'],
      required: true
    }
  ]
}, {
  timestamps: true
});

const Expert = mongoose.model('Expert', expertSchema);

module.exports = Expert;
