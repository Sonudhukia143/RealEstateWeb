const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    }
});

async function sendVerificationEmail (email, token) {
    console.log('Inside sendVerificationEmail function');
    console.log('Email:', email);
    console.log('Token:', token);
    if (!email || !token) console.error('Email and token are required');
    const verificationLink = `http://localhost:3000/api/verify-email?token=${token}`;
    console.log('Verification Link:', verificationLink);
    console.log('Sending email to:', email);
    const mailOptions = {
        from: "TEAM MAISEN MONDE",
        to: email,
        subject: 'Email Verification For MaisenMonde',
        html: `
        <h1>Verify Your Email For MaisenMonde.</h1>
        <p>Please verify your email by clicking on the following link: ${verificationLink}<p>
        <p>If you din't create an account , you can safely ignore this user won't be allowed to misuse your email.</p>
        <p>Thanks</p>
        <p>Team MaisenMonde</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully!');
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
}

module.exports = { sendVerificationEmail};