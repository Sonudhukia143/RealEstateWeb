import bcrypt from 'bcrypt';
import { User, validateUser } from '../models/User.js';
import generateToken from '../utils/webToken.js';
import { cloudinary } from '../cloudinary/cloudinaryConfig.js';
import admin from '../utils/firebase-admin.js';

export default async function signinuser(req, res) {
    const { username, gmail, password, blobImg, token } = JSON.parse(req.body);

    const { error } = validateUser({ username, gmail, password });
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { gmail }] });
        if (existingUser) return res.status(404).json({ message: "Username or email already exists try logging in." });

        let decodedToken;
        if(token){
            decodedToken = await admin.auth().verifyIdToken(token);
            if (!decodedToken) return res.status(404).json({ message: "Unable to decode token." });
            if (decodedToken.email != gmail) return res.status(401).json({ message: "Email doesnot match the token" });
        }

        let profile = null;
        if(!token){
            const pic = await cloudinary.uploader.upload(blobImg, {
                folder: 'profile_pictures',
            });
            profile = {
                url: pic.url,
                filename: pic.public_id,
            };
        }else if(token){
            profile = {
                url: decodedToken.picture,
                filename: decodedToken.user_id
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, gmail, password: hashedPassword, profile: [profile] });

        const saveUser = await newUser.save();
        if (!saveUser) return res.status(404).json({ message: "Unable to save user." });

        const Jwttoken = generateToken(newUser._id);
        res.cookie('token', Jwttoken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/',
        });
        const jsonUser = {
            gmail: newUser.gmail,
            username: newUser.username,
            profile: newUser?.profile[0]?.url?newUser?.profile[0]?.url:null
        }

        return res.status(200).json({ message: 'Creation successful', token: Jwttoken, user: jsonUser });
    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: "Internal server error" });
    }
}