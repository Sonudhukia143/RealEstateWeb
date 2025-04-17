import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import generateToken from '../utils/webToken.js';
import admin from '../utils/firebase-admin.js';

const loginUser = async (req, res) => {
    const objBody = req?.body;
    const isEmpty = Object.keys(objBody).length === 0;
    if(isEmpty) return res.status(404).json({ message: "Cannot Provide Empty Fields" });

    const { gmail, password, token } = JSON.parse(req.body);
    if ((!gmail || !password) && !token) return res.status(400).json({ message: 'Input feilds cannot be empty' });

    try {
        let decodedToken;
        let user;
        if (token) {
            try{
                decodedToken = await admin.auth().verifyIdToken(token);
                if (!decodedToken) return res.status(404).json({ message: "Unable to decode token." });

                user = await User.findOne({ gmail:decodedToken.email });
            }catch(error){
                if(error) return res.status(404).json({message:error});
            }

            if (!user) return res.status(404).json({ message: 'User not found' });
        }else if(gmail && password){
            user = await User.findOne({ gmail });
            if (!user) return res.status(404).json({ message: 'User not found' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });    
        }

        const jwtToken = generateToken(user._id);
        res.cookie('token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/',
        });

        const newUser = {
            username: user.username,
            gmail: user.gmail,
            profile: user?.profile[0]?.url ? user.profile[0].url : null,
            emailVerified: user?.emailVerified,
        }

        return res.status(200).json({ message: 'Login successful', token: jwtToken, user: newUser });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

export default loginUser;