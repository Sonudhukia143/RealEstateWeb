import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    gmail: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
});

const OTP = mongoose.model("OTP", otpSchema);

export { OTP };