import { Detail } from "../models/UserDetails.js";

export default async function fetchInfo(req, res) {
    const user = req?.user;
    if(!user) return res.status(404).json({message:"No user info provided."});

    try {
        const userId = user._id;
        if (!userId) return res.status(401).json({ message: "No userID found." });

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
