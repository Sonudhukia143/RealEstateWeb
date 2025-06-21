import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const mailAuthMiddleware = async (req, res, next) => {
    const token = req.header("Authorization");
    if  (!token) return res.status(401).json({ message: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JSON_WEB_SECRET);
        if(!decoded) return res.status(401).json({ message: "Token is not valid" });

        const user = await User.findById(decoded.id); // Exclude the password field
        if(!user) res.status(401).json({ message:"User Not Found"});
        if(!user.emailVerified) res.status(401).json({message:"You are not verified user."});

        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

export default mailAuthMiddleware;