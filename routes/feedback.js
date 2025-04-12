const express = require('express');
const router = express.Router();
const Feedback = require('../schemas/feedback'); // Adjust path as needed
const Expert = require('../schemas/expert-register');
const User = require('../schemas/user-register'); // Assuming you have a User schema

// ✅ POST Feedback and Rating
router.post('/', async (req, res) => {
  try {
    const { expertId, rating, comment } = req.body;
    const userId = req.user._id; // Assume this comes from authentication middleware

    // Prevent duplicate feedback from same user to same expert
    const existingFeedback = await Feedback.findOne({ expert: expertId, user: userId });
    if (existingFeedback) {
      return res.status(400).json({ message: 'You have already submitted feedback for this expert.' });
    }

    const feedback = new Feedback({
      expert: expertId,
      user: userId,
      rating,
      comment
    });

    await feedback.save();

    // Optional: Recalculate average rating
    const stats = await Feedback.aggregate([
      { $match: { expert: feedback.expert } },
      { $group: { _id: '$expert', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    if (stats.length > 0) {
      await Expert.findByIdAndUpdate(feedback.expert, {
        averageRating: stats[0].avgRating,
        feedbackCount: stats[0].count
      });
    }

    res.status(201).json({ message: 'Feedback submitted successfully.', feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

// ✅ GET all Feedback for a specific Expert (with average rating)
router.get('/expert/:expertId', async (req, res) => {
  try {
    const { expertId } = req.params;

    const feedbackList = await Feedback.find({ expert: expertId })
      .populate('user', 'email') // Include email or username if needed
      .sort({ createdAt: -1 });

    const stats = await Feedback.aggregate([
      { $match: { expert: new mongoose.Types.ObjectId(expertId) } },
      { $group: { _id: '$expert', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    res.json({
      feedback: feedbackList,
      averageRating: stats[0]?.avgRating || 0,
      totalFeedback: stats[0]?.count || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to fetch feedback.' });
  }
});

// 🗑 DELETE feedback (admin only)
router.delete('/:feedbackId', async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const userRole = req.user.role;

    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized. Admin access required.' });
    }

    const deleted = await Feedback.findByIdAndDelete(feedbackId);

    if (!deleted) {
      return res.status(404).json({ message: 'Feedback not found.' });
    }

    res.json({ message: 'Feedback deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});


module.exports = router;
