import { OTP } from "../models/Otp.js";
import { User } from "../models/User.js";
import { sendVerificationOtp } from "../utils/nodeMailer.cjs";
import generateToken from "../utils/webToken.js";

const sendOtp = async function (req, res) {
    try{
        const { gmail } = JSON.parse(req.body);

        const isOtpSent = await OTP.findOne({ gmail });
        if (isOtpSent) {
            if (isOtpSent.expiresAt < new Date(Date.now())) {
                await OTP.deleteOne({ gmail: gmail });
            } else if (isOtpSent.expiresAt > new Date(Date.now())) {
                return res.status(401).json({ message: "OTP Already to your email wait to send again." });
            }
    
        }
    
        const otpVal = Math.floor(1000 + Math.random() * 9000).toString();
        if(!otpVal) return res.status(404).json({message:"Unable to generate OTP value."});
    
        const otpStrucure = new OTP({
            gmail: gmail,
            otp: otpVal,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });
        if(!otpStrucure) return res.status(404).json({message:"Unable to generate OTP structure."}); 
    
        const savedData = await otpStrucure.save();
        if(!savedData) return res.status(404).json({message:"Unable to save OTP."});
    
        await sendVerificationOtp(gmail, otpVal);
        return res.status(200).json({ message: "Successfully sent otp to your gmail." });
    }catch(error){
        return res.status(404).json({message:error.message});
    }
}

const verifyOtp = async function verifyOtp(req, res) {
    try{
        const { gmail, otpVal } = JSON.parse(req.body);
        if (isNaN(otpVal.join(''))) return res.status(400).json({ message: "OTP is not in valid format" });

        if (!Array.isArray(otpVal) || otpVal.length !== 4) 
        return res.status(400).json({ message: "OTP must be an array of 4 numbers." });  
        
        const isOtpSent = await OTP.findOne({ gmail });
        if (isOtpSent && isOtpSent?.expiresAt < new Date(Date.now())) return res.status(401).json({ message: "OTP Already Expired Resend It." });
        if (!isOtpSent) return res.status(404).json({ message: "There has been no otp request please send it." });
    
        if (isOtpSent?.attempts >= 5) {
            await OTP.findOneAndDelete({gmail});
            return res.status(404).json({message: "Limits of attempts reached resend OTP."});
        }
    
        if (otpVal.join('') == isOtpSent.otp) {
            await OTP.findOneAndDelete({gmail});
            const user = await User.findOne({ gmail });
            const jwtToken = generateToken(user._id);
            return res.status(200).json({ message: "Verification succesfully done.", token: jwtToken, user: user });
        }else {
            await isOtpSent.save();
            return res.status(404).json({ message: "Invalid Otp try again."});
        }
    }catch(error){
        return res.status(404).json({message:error.message});
    }
}

export { sendOtp, verifyOtp };