const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    }
});

async function sendVerificationEmail (email, token) {
    if (!email || !token) console.error('Email and token are required');
    const verificationLink = `https://bank-website-23d3.vercel.app/api/verify-email?token=${token}`;

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
};

async function sendVerificationOtp (email,otp) {
    if (!email) console.error('Email is required');

    const mailOptions = {
        from: "TEAM MAISEN MONDE",
        to: email,
        subject: 'Email Verification OTP From MaisenMonde',
        html:`
        <div style="font-family: Arial, sans-serif; padding: 10px;">
            <h1 style="color: #333;">Verify It's You for MaisenMonde</h1>
            <p>Please verify yourself by entering the OTP below:</p>
            <p>Your OTP is <b style="color: blue; font-size: 40px;">${otp}</b>. It will expire in <b>5 minutes</b>.</p>
            <p>Thanks,</p>
            <p><strong>Team MaisenMonde</strong></p>
        </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully!');
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
};

module.exports = { sendVerificationEmail,sendVerificationOtp};