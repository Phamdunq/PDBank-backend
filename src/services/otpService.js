const nodemailer = require('nodemailer');
const crypto = require('crypto');
const OTP = require('../models/otpModel');
require("dotenv").config();

// Cấu hình SMTP (dùng Gmail)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Tạo OTP
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// Gửi OTP qua email
const sendOTP = async (email) => {
    const otpCode = generateOTP();

    // Lưu OTP vào database
    await OTP.create({ email, otp: otpCode });

    // Gửi email
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP is: ${otpCode}. It will expire in 5 minutes.`
    };

    await transporter.sendMail(mailOptions);
    return { EC: 0, EM: 'OTP sent successfully' };
};

const verifyOTP = async (email, otp) => {
    const record = await OTP.findOne({ email, otp });
    if (!record) return { EC: 1, EM: 'OTP không hợp lệ' };

    // Xóa OTP sau khi xác minh
    await OTP.deleteOne({ email, otp });
    return { EC: 0, EM: 'OTP xác minh thành công' };
};

module.exports = {
    sendOTP, verifyOTP
};
