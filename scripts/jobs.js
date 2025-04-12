const cron = require('node-cron');
const Booking = require('../schemas/booking');
const User = require('../schemas/user'); // Assuming you have a User schema
const Expert = require('../schemas/expert-register'); // Assuming you have an Expert schema
const sendEmail = require('../middleware/sendEmail');  // A custom email utility
const dayjs = require('dayjs');

// Scheduler for sending reminders 30 minutes before and at the time of booking
cron.schedule('* * * * *', async () => {  // Run every minute
  const now = dayjs();

  try {
    // Find bookings scheduled for the next 30 minutes and not yet notified
    const upcomingBookings = await Booking.find({
      bookedAt: { $gte: now.toDate() },
      bookedAt: { $lte: now.add(30, 'minute').toDate() },
      status: 'upcoming',  // Only upcoming bookings
      notification30Sent: { $ne: true }, // Avoid duplicate reminders
    }).populate('userId', 'email').populate('expertId', 'email');

    // Send 30-minute reminders
    for (const booking of upcomingBookings) {
      const userEmail = booking.userId.email;
      const expertEmail = booking.expertId.email;
      const bookingTime = dayjs(booking.bookedAt).format('hh:mm A');

      const reminderMessage = `Reminder: Your session with expert is scheduled at ${bookingTime}.`;

      // Send the email
      await sendEmail(userEmail, 'Booking Reminder (30 minutes)', reminderMessage);
      await sendEmail(expertEmail, 'Booking Reminder (30 minutes)', reminderMessage);

      // Mark 30-minute reminder as sent
      booking.notification30Sent = true;
      await booking.save();
    }

    // Send on-time reminder (at the bookedAt time)
    const onTimeBookings = await Booking.find({
      bookedAt: { $lte: now.toDate() },
      bookedAt: { $gte: now.subtract(1, 'minute').toDate() },
      status: 'upcoming',
      notificationNowSent: { $ne: true }, // Avoid duplicate reminders
    }).populate('userId', 'email').populate('expertId', 'email');

    for (const booking of onTimeBookings) {
      const userEmail = booking.userId.email;
      const expertEmail = booking.expertId.email;
      const bookingTime = dayjs(booking.bookedAt).format('hh:mm A');

      const onTimeMessage = `Your session with the expert is starting now at ${bookingTime}!`;

      // Send the email
      await sendEmail(userEmail, 'Booking Reminder (Now)', onTimeMessage);
      await sendEmail(expertEmail, 'Booking Reminder (Now)', onTimeMessage);

      // Mark on-time notification as sent
      booking.notificationNowSent = true;
      await booking.save();
    }
  } catch (err) {
    console.error('Error sending notifications:', err);
  }
});
