import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import bcrypt from 'bcrypt';

export default async function changePassword (req,res) {
    const { password, confirmPassword,token } = JSON.parse(req.body);
    console.log(password, confirmPassword,token);
    if(!password || !confirmPassword || !token) return res.status(400).json({ message: 'Please fill all fields' });
    if(password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });

    try{
        const decodedToken = jwt.verify(token, process.env.JSON_WEB_SECRET);
        if(!decodedToken) return res.status(401).json({ message: 'Invalid token' });
        if(decodedToken.exp && decodedToken.exp < Date.now() / 1000) return res.status(401).json({ message: 'Token has expired' });

        const userId = decodedToken.id;
        if(!userId) return res.status(401).json({ message: 'No userID found in token.' });
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({ message: 'User not found' });

        const hashedPassword = await bcrypt.hash(password, 10);
        if(!hashedPassword) return res.status(404).json({message:"Unable to hash password."});

        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: 'Password changed successfully.' });
    }catch(err){
        return res.status(400).json({ message: 'Invalid or expired token.' });
    }
}