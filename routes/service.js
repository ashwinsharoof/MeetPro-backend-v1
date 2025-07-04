const express = require('express');
const router = express.Router();
const Service = require('../schemas/service'); // Adjust path as needed
//const { upload } = require('../config/gridfs');




router.post('/create', async (req, res) => {
  try {
    const {
      expertId,
      ServiceType,
      Title,
      Description,
      Amount,
      UploadCoverPhoto // this is base64 string
    } = req.body;

    if (!UploadCoverPhoto || !UploadCoverPhoto.startsWith('data:image')) {
      return res.status(400).json({ message: 'Invalid or missing image (Base64 format required)' });
    }

    const newService = new Service({
      expertId,
      ServiceType,
      Title,
      Description,
      Amount,
      UploadCoverPhoto
    });

    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    console.error('Service creation failed:', err);
    res.status(500).json({ message: 'Service creation error' });
  }
});
  
  

// GET: Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET: Get services by expertId
router.get('/expert/:expertId', async (req, res) => {
  try {
    const services = await Service.find({ expertId: req.params.expertId });
    res.status(200).json(services);
  } catch (err) {
    console.error('Error fetching services by expertId:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT: Update service by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating service:', err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Delete service by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (err) {
    console.error('Error deleting service:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
