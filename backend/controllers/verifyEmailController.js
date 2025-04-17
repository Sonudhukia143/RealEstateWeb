import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

export default async function verifyEmail(req, res) {
    const { token } = req.query;
    if (!token || typeof token !== 'string') return res.status(400).json({ message: 'Valid token is required' });

    try {
        const decodedToken = jwt.verify(token, process.env.JSON_WEB_SECRET);
        if (!decodedToken) return res.status(401).json({ message: 'Invalid token' });
        if (decodedToken.exp && decodedToken.exp < Date.now() / 1000) return res.status(401).json({ message: 'Token has expired' });

        const userId = decodedToken.id;
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({ message: 'User not found' });

        if (user.emailVerified) return res.status(404).json({ message: 'User already verified with email.' });
        user.emailVerified = true;
        await user.save();

        return res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
    }
}