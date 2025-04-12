const mongoose = require('mongoose');
const { Schema } = mongoose;

const verificationSchema = new Schema({
  // ✅ Verification-related fields
  expert: {
    type: Schema.Types.ObjectId,
    ref: 'Expert',
    required: true,
    unique: true // One verification record per expert
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verification: {
    aadhaarImage: {
      type: String, // URL or file path
      required: true
    },
    certificate: {
      type: String, // URL or file path
      required: true
    },
    verifiedAt: {
      type: Date
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User' // Admin who verified
    }
  },

  // ✅ Bank Details
  bankDetails: {
    accountHolderName: {
      type: String,
      required: true
    },
    accountNumber: {
      type: String,
      required: true
    },
    ifscCode: {
      type: String,
      required: true
    },
    bankName: {
      type: String,
      required: true
    },
    upiId: {
      type: String
    }
  }

}, {
  timestamps: true
});

const Expert = mongoose.model('Verification', verificationSchema);
module.exports = Expert;
