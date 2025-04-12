const express = require('express');
const router = express.Router();
const Verification = require('../schemas/verification');
const Expert = require('../schemas/expert-register');
const mongoose = require('mongoose');

// ============================
// 1️⃣ Expert submits verification
// ============================

router.post('/submit', async (req, res) => {
  try {
    const expertId = req.user._id; // Auth middleware must attach expert user
    const {
      aadhaarImage,
      certificate,
      bankDetails
    } = req.body;

    // Prevent duplicate submission
    const existing = await Verification.findOne({ expert: expertId });
    if (existing) {
      return res.status(400).json({ message: 'Verification already submitted.' });
    }

    const verification = new Verification({
      expert: expertId,
      aadhaarImage,
      certificate,
      bankDetails
    });

    await verification.save();

    // Optionally link to Expert
    await Expert.findByIdAndUpdate(expertId, {
      verification: verification._id,
      isVerified: false
    });

    res.status(201).json({ message: 'Verification submitted successfully.', verification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Submission failed.' });
  }
});

// ============================
// 2️⃣ Admin approves/rejects verification
// ============================

router.patch('/admin/:verificationId', async (req, res) => {
  try {
    const adminUser = req.user;
    if (adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const { verificationId } = req.params;
    const { status, remarks } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const verification = await Verification.findByIdAndUpdate(
      verificationId,
      {
        status,
        verifiedAt: new Date(),
        verifiedBy: adminUser._id,
        remarks
      },
      { new: true }
    );

    if (!verification) {
      return res.status(404).json({ message: 'Verification not found.' });
    }

    // Update Expert's isVerified
    await Expert.findByIdAndUpdate(verification.expert, {
      isVerified: status === 'approved'
    });

    res.json({ message: `Verification ${status}.`, verification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to process verification.' });
  }
});

// ============================
// 3️⃣ Get expert's own verification status
// ============================

router.get('/status', async (req, res) => {
  try {
    const expertId = req.user._id;

    const verification = await Verification.findOne({ expert: expertId }).populate('verifiedBy', 'email role');

    if (!verification) {
      return res.status(404).json({ message: 'No verification record found.' });
    }

    res.json(verification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not fetch status.' });
  }
});

// ============================
// 4️⃣ (Optional) Admin fetch all verifications
// ============================

router.get('/admin/all', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const verifications = await Verification.find().populate('expert', 'email username').sort({ createdAt: -1 });
    res.json(verifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to fetch verifications.' });
  }
});

module.exports = router;
