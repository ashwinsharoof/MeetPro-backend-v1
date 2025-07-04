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
  // availability: {
  //   type: String,  // You can define this to be an enum or a more structured object based on your needs
  //   required: true
  // },

  availability: {
    type: Object,
    required: false,
    default: {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    }
  },
  
  calendar: {
    type: Map,
    of: Date, // Automatically cast strings to Date
    required: false,
  },
  
  timeZone: {
    type: String,
    required: false,
  },
  preBooking: {
    type: String,
    required: false,
  },
  meetingLocation: {
    type: String,
    required: false,
  },
  // monday: {
  //   type: Array,
  //   required: false,
  // },
  // tuesday: {
  //   type: Array,
  //   required: false,
  // },
  // wednesday: {
  //   type: Array,
  //   required: false,
  // },
  // thursday: {
  //   type: Array,
  //   required: false,
  // },
  // friday: {
  //   type: Array,
  //   required: false,
  // },
  // saturday: {
  //   type: Array,
  //   required: false,
  // },
  // sunday: {
  //   type: Array,
  //   required: false,
  // },
  role: {
    type: String,
    enum: ['admin', 'user', 'expert'], // Allow only 'admin' or 'user'
    default: 'expert', // Default role is 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
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
