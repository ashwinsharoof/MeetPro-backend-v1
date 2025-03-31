const mongoose = require('mongoose');
const { Schema } = mongoose;

// Booking Schema
const bookingSchema = new Schema({
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expert', // Reference to the Expert (which is a User in this case)
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User who is booking
    required: true,
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed'],
    default: 'upcoming', // Default to 'upcoming'
  },
  service: {
    type: String,
    enum: ['1:1 Call', 'Webinar', 'Doubt Session'],
    required: true,
  },
  bookedAt: {
    type: Date,
    default: Date.now, // Automatically set the current time when the booking is created
  },
}, {
  timestamps: true, // This will add `createdAt` and `updatedAt` fields automatically
});

// Create a Booking model based on the schema
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
