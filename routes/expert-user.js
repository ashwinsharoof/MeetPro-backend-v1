const express = require('express');
const bcrypt = require('bcrypt');
const Expert = require('../schemas/expert-register');
const router = express.Router();

// Register a new expert
router.post('/register', async (req, res) => {
  try {
    const { email, password, username, mobileNumber, category, availability, services, role  } = req.body;

    // Check if the expert already exists
    const existingExpert = await Expert.findOne({ email });
    if (existingExpert) {
      return res.status(400).json({ message: 'Expert already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new expert
    const newExpert = new Expert({
      email,
      password: hashedPassword,
      username,
      mobileNumber,
      category,
      availability,
      services,
      role : role || 'expert',
    });

    // Save expert to the database
    await newExpert.save();
    res.status(201).json(newExpert);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all experts
router.get('/', async (req, res) => {
  try {
    const experts = await Expert.find();
    res.status(200).json(experts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get one expert by ID
router.get('/:id', async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) {
      return res.status(404).json({ message: 'Expert not found' });
    }
    res.status(200).json(expert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an expert by ID
router.put('/:id', async (req, res) => {
  try {
    const { email, password, username, mobileNumber, category, availability, services } = req.body;

    // Find the expert and update
    const expert = await Expert.findById(req.params.id);
    if (!expert) {
      return res.status(404).json({ message: 'Expert not found' });
    }

    // Optionally hash the new password if provided
    if (password) {
      expert.password = await bcrypt.hash(password, 10);
    }

    // Update expert fields
    expert.email = email || expert.email;
    expert.username = username || expert.username;
    expert.mobileNumber = mobileNumber || expert.mobileNumber;
    expert.category = category || expert.category;
    expert.availability = availability || expert.availability;
    expert.services = services || expert.services;

    // Save the updated expert
    await expert.save();
    res.status(200).json(expert);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an expert by ID
router.delete('/:id', async (req, res) => {
  try {
    const expert = await Expert.findByIdAndDelete(req.params.id);
    if (!expert) {
      return res.status(404).json({ message: 'Expert not found' });
    }
    res.status(200).json({ message: 'Expert deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
