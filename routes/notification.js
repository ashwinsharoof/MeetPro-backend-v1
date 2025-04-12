const express = require('express');
const router = express.Router();
const User = require('../schemas/user-register'); // Assuming you have a User schema
const Expert = require('../schemas/expert-register'); // Assuming you have an Expert schema
const sendEmail = require('../middleware/sendEmail'); // A custom email utility
const dayjs = require('dayjs');

// 📬 Send manual notification for a session (testing purpose)
router.post('/send-reminder', async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await Session.findById(sessionId)
      .populate('user', 'email')
      .populate('expert', 'email');

    if (!session) return res.status(404).json({ message: 'Session not found.' });

    const userEmail = session.user.email;
    const expertEmail = session.expert.email;

    const message = `Reminder: Your session starts at ${dayjs(session.startTime).format('hh:mm A')} today!`;

    await sendEmail(userEmail, 'Session Reminder', message);
    await sendEmail(expertEmail, 'Session Reminder', message);

    res.json({ message: 'Reminder emails sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send emails.' });
  }
});

module.exports = router;
