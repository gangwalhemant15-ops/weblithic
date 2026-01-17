const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create transporter using environment variables
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        // Send email
        await transporter.sendMail({
            from: `"${name}" <${process.env.SMTP_USER}>`, // Best practice: Use your own domain in from
            to: 'support@weblithic.com',
            replyTo: email,
            subject: `Weblithic Contact: ${subject}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `
        <h3>New Message from Weblithic Contact Form</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
        });

        return res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('SMTP Error:', error);
        return res.status(500).json({ message: 'Error sending message', error: error.message });
    }
}
