import { Detail } from "../models/UserDetails.js";

export default async function addInfo(req, res) {
    const data = req.body;
    if (!data) return res.status(400).json({ message: "No data provided" });

    try {
        const user = req.user;
        if (!user) return res.status(404).json({ message: "User not found" });
        if(!user.emailVerified) return res.status(401).json({message: "You need to verify your email"});

        const { pincode, city, state, country,UserType } = data.additionalInfo;
        if (!pincode || !city || !state || !country || !UserType) return res.status(400).json({ message: "Please provide all the details" });

        const userId = user._id;
        if(!userId) return res.status(404).json({message:"No userId found."});

        let userDetails = await Detail.findOne({ userId });
        if (userDetails) {
            userDetails.pincode = pincode;
            userDetails.city = city;
            userDetails.state = state;
            userDetails.country = country;
            userDetails.UserType = UserType;
        } else {
            userDetails = new Detail({
                userId,
                pincode,
                city,
                state,
                country,
                UserType
            });
        }

        const userDetailsxyz = await userDetails.save();
        if(!userDetailsxyz) return res.status(404).json({message:"Unable to save to database."})

        return res.status(200).json({ message: "Details added successfully", details: {
            pincode:userDetailsxyz.pincode,
            city:userDetailsxyz.city,
            state:userDetailsxyz.state,
            country:userDetailsxyz.country,
            UserType:userDetailsxyz.UserType
        } 
    });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}