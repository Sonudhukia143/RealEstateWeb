import { cloudinary } from '../cloudinary/cloudinaryConfig.js';

export default async function editProfile (req,res) {
    const objBody = req.body;
    const isEmpty = Object.keys(objBody).length === 0;
    if(isEmpty) return res.status(404).json({ message: "Cannot Provide Empty Fields" });

    const {  username , blobImg } = JSON.parse(req.body);
    if(!username || !blobImg) return res.status(404).json({ message: "Input feild cannot be empty."});

    try {
        const user = req.user;
        if (!user) return res.status(404).json({ message: "User not found" });
        if(!user.emailVerified) return res.status(401).json({message: "You need to verify your email"});

        try{
            const pic = await cloudinary.uploader.upload(blobImg, {
                folder: 'profile_pictures',
            });
            
            user.profile[0].url = pic.url;
            user.profile[0].filename = pic.public_id;
            user.username = username;
        }catch(error){
            console.log(error);
            return res.status(404).json({ message: "Unable to upload image." ,});
        }

        const newUser = await user.save();
        const jsonUser = {
            gmail: newUser.gmail,
            username: newUser.username,
            profile: newUser?.profile[0]?.url?newUser?.profile[0]?.url:null,
            emailVerified: newUser?.emailVerified,
        }

        return res.status(200).json({ message: 'Profile updated successfully.' , token: req.token, user: jsonUser });
    }
    catch (err) {
        return res.status(400).json({ message: err.message });
    }
}