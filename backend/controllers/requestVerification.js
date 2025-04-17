import { User } from "../models/User.js";
import {sendVerificationEmail} from "../utils/nodeMailer.cjs";
import jwt from "jsonwebtoken";

export default async function requestVerification (req,res) {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token is required' });

    try {
        const decodedToken = jwt.verify(token, process.env.JSON_WEB_SECRET);
        if(decodedToken.exp && decodedToken.exp < Date.now() / 1000) return res.status(401).json({ message: 'Token has expired' });
        if (!decodedToken) return res.status(401).json({ message: 'Invalid token' });

        const userId = decodedToken.id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.emailVerified) {
            const jsonUser = {
                gmail: user.gmail,
                username: user.username,
                profile: user?.profile[0]?.url?user?.profile[0]?.url:null,
                emailVerified: user?.emailVerified,
            }
            return res.status(201).json({ message: 'Email Verified Successfully', user:jsonUser , token:token});
        }

        await sendVerificationEmail(user.gmail,token);
        return res.status(200).json({ message: 'Verification email sent successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
    }
}