const mongoose = require('mongoose');
const { Schema } = mongoose;

// Service Schema
const serviceSchema = new Schema({
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expert', // Reference to the Expert (which is a User in this case)
    required: true,
  },
  ServiceType: {
    type: String,
    required: true,
  },
  Title: {
    type: String,
    required: true,
    trim: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Amount: {
    type: Number,
    required: true,
    min: 0,
  },
  UploadCoverPhoto: {
    type: String, // This will store the filename or URL of the uploaded photo
    required: true,
  },
}, {
  timestamps: true, // This will add `createdAt` and `updatedAt` fields automatically
});

// Create a Service model based on the schema
const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
