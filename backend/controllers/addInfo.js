import { User } from "../models/User.js";
import { Detail } from "../models/UserDetails.js";
import jwt from "jsonwebtoken";

export default async function addInfo (req,res) {
    const data = JSON.parse(req.body);
    if(!data) return res.status(400).json({message: "No data provided"});
    if(!data.token) return res.status(400).json({message: "No token provided"});

    try{
        const decodedToken = jwt.verify(data.token, process.env.JSON_WEB_SECRET);
        if(!decodedToken) return res.status(401).json({message: "Invalid token"});
        if(decodedToken.exp && decodedToken.exp < Date.now() / 1000) return res.status(401).json({message: "Token has expired"});

        const userId = decodedToken.id;
        if(!userId) return res.status(401).json({message: "No userID found in token."});
        
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message: "User not found"});

        const detailsWithTypes = data.additionalInfo.map(item => ({
            fieldName: item.type,
            value: item.content,
            valueType: typeof item.content === 'string' ? 'string' : 'number'
        }));

        console.log(detailsWithTypes);

        let userDetails = await Detail.findOne({ userId });

        console.log(userDetails);

        if (userDetails) {
            userDetails.details.push(...detailsWithTypes);
        } else {
            userDetails = new Detail({
                userId,
                details: detailsWithTypes
            });
        }

        const userDetailsqw12 = await userDetails.save();
        console.log(userDetailsqw12);

        return res.status(200).json({message: "Details added successfully",details: userDetails});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
}