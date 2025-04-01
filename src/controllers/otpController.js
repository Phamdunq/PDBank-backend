const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP } = require('../services/otpService');

module.exports = {
    sendOTPController: async (req, res) => {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        try {
            const response = await sendOTP(email);
            return res.status(200).json(response);
        } catch (error) {
            console.error('Error sending OTP:', error);
            return res.status(500).json({ error: 'Failed to send OTP' });
        }
    },
    verifyOTPController: async (req, res) => {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ EC: 1, EM: "Email và OTP là bắt buộc" });
        }
        const response = await verifyOTP(email, otp);
        return res.status(200).json(response);
    }
}