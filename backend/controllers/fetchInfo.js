import { Detail } from "../models/UserDetails.js";
import jwt from "jsonwebtoken";

export default async function fetchInfo(req, res) {
    const token = req.params.id;
    if (!token) return res.status(400).json({ message: "User ID is required" });

    try {
        const decodedToken = jwt.verify(token, process.env.JSON_WEB_SECRET);
        if (!decodedToken) return res.status(401).json({ message: "Invalid token" });
        if (decodedToken.exp && decodedToken.exp < Date.now() / 1000) return res.status(401).json({ message: "Token has expired" });

        const userId = decodedToken.id;
        if (!userId) return res.status(401).json({ message: "No userID found in token." });


        const userDetails = await Detail.findOne({ userId });
        if (!userDetails) return res.status(404).json({ message: "No details found! Add details. ➕" });

        return res.status(200).json({
            message: "Details Fetched Succesfully", details: {
                pincode: userDetails.pincode,
                city: userDetails.city,
                state: userDetails.state,
                country: userDetails.country,
                UserType: userDetails.UserType
            }
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}
