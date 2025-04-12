const express = require('express');
const Booking = require('../schemas/booking');
const router = express.Router();
//const razorpay = require('../config/payment');
const crypto = require('crypto');

// Create a new booking
router.post('/create', async (req, res) => {
  try {
    const { expertId, userId, service } = req.body;

    const newBooking = new Booking({
      expertId,
      userId,
      service,
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating booking' });
  }
});

router.get('/', async (req, res) => {
    try {
      const bookings = await Booking.find();
      res.status(200).json(bookings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error retrieving bookings' });
    }
  });

// Get all bookings for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).populate('expertId', 'email mobileNumber role');
    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving bookings' });
  }
});

// Get all bookings for a specific expert
router.get('/expert/:expertId', async (req, res) => {
  try {
    const bookings = await Booking.find({ expertId: req.params.expertId }).populate('userId', 'email mobileNumber');
    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving bookings' });
  }
});

// Update the status of a booking
router.put('/:bookingId/status', async (req, res) => {
  try {
    const { status } = req.body;

    // Ensure status is valid
    if (!['upcoming', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();
    res.status(200).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating booking status' });
  }
});

// Delete a booking
router.delete('/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting booking' });
  }
});

// Get all upcoming bookings for a specific user
router.get('/user/:userId/upcoming', async (req, res) => {
    try {
      const bookings = await Booking.find({ 
        userId: req.params.userId,
        status: 'upcoming'  // Filter by 'upcoming' status
      }).populate('expertId', 'email mobileNumber role');  // Populate expert details
  
      if (!bookings) {
        return res.status(404).json({ message: 'No upcoming bookings found for this user' });
      }
  
      res.status(200).json(bookings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error retrieving upcoming bookings for user' });
    }
  });
  
  // Get all completed bookings for a specific user
  router.get('/user/:userId/completed', async (req, res) => {
    try {
      const bookings = await Booking.find({ 
        userId: req.params.userId,
        status: 'completed'  // Filter by 'completed' status
      }).populate('expertId', 'email mobileNumber role');  // Populate expert details
  
      if (!bookings) {
        return res.status(404).json({ message: 'No completed bookings found for this user' });
      }
  
      res.status(200).json(bookings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error retrieving completed bookings for user' });
    }
  });

  // Get all upcoming bookings for a specific expert
router.get('/expert/:expertId/upcoming', async (req, res) => {
    try {
      const bookings = await Booking.find({ 
        expertId: req.params.expertId,
        status: 'upcoming'  // Filter by 'upcoming' status
      }).populate('userId', 'email mobileNumber');  // Populate user details
  
      if (!bookings) {
        return res.status(404).json({ message: 'No upcoming bookings found for this expert' });
      }
  
      res.status(200).json(bookings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error retrieving upcoming bookings for expert' });
    }
  });
  
  // Get all completed bookings for a specific expert
  router.get('/expert/:expertId/completed', async (req, res) => {
    try {
      const bookings = await Booking.find({ 
        expertId: req.params.expertId,
        status: 'completed'  // Filter by 'completed' status
      }).populate('userId', 'email mobileNumber');  // Populate user details
  
      if (!bookings) {
        return res.status(404).json({ message: 'No completed bookings found for this expert' });
      }
  
      res.status(200).json(bookings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error retrieving completed bookings for expert' });
    }
  });

 /* router.post('/create-payment-order', async (req, res) => {
    try {
      const { bookingId } = req.body;
  
      // Find the booking
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found.' });
      }
  
      const options = {
        amount: booking.paymentAmount * 100,  // Amount in paise
        currency: 'INR',
        receipt: bookingId,
        payment_capture: 1,  // Automatically capture the payment
      };
  
      // Create the payment order on Razorpay
      const order = await razorpay.orders.create(options);
  
      // Save the Razorpay Order ID to the booking
      booking.paymentOrderId = order.id;
      await booking.save();
  
      // Send the order details to the frontend
      res.json({
        orderId: order.id,
        amount: booking.paymentAmount,
        currency: 'INR',
        keyId: process.env.RAZORPAY_KEY_ID,  // Razorpay Key ID
      });
    } catch (error) {
      console.error('Error creating payment order:', error);
      res.status(500).json({ message: 'Failed to create payment order.' });
    }
  });

  // Verify Razorpay payment
router.post('/verify-payment', async (req, res) => {
    const { paymentOrderId, paymentId, signature } = req.body;
  
    try {
      const booking = await Booking.findOne({ paymentOrderId });
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found.' });
      }
  
      // Razorpay signature verification
      const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(paymentOrderId + '|' + paymentId)
        .digest('hex');
  
      if (generatedSignature !== signature) {
        return res.status(400).json({ message: 'Payment signature mismatch' });
      }
  
      // Update booking payment status
      booking.paymentStatus = 'paid';
      await booking.save();
  
      // Respond with success
      res.json({ message: 'Payment verified and booking updated successfully' });
    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ message: 'Payment verification failed.' });
    }
  }); */
  

module.exports = router;
