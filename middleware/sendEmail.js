const nodemailer = require('nodemailer');

// Create a transport object using your email service provider
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Replace with your email service (Gmail used here)
  auth: {
    user: 'your-email@gmail.com',  // Replace with your email address
    pass: 'your-email-password'    // Replace with your email password or an app-specific password
  }
});

// Function to send the email
const sendBookingEmail = async (userEmail, meetingLink, userName) => {
  const mailOptions = {
    from: 'your-email@gmail.com',  // Sender's email address
    to: userEmail,  // Receiver's email address
    subject: 'Your Booking Confirmation - Google Meet Link',
    html: `
      <p>Hello ${userName},</p>
      <p>Your booking has been confirmed!</p>
      <p>You can join the session using the following Google Meet link:</p>
      <p><a href="${meetingLink}" target="_blank">Join the session</a></p>
      <p>We look forward to seeing you!</p>
      <p>Best regards,</p>
      <p>Your Team</p>
    `,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendBookingEmail;
