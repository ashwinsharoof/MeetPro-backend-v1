const express = require('express');
const Booking = require('../schemas/booking'); // Assuming the Booking schema is in the same directory
const router = express.Router();

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
  

module.exports = router;
