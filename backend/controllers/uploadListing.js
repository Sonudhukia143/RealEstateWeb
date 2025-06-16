import { cloudinary } from '../cloudinary/cloudinaryConfig.js';
import { Listing, validateListing } from '../models/Listing.js';
import { User } from '../models/User.js';

const uploadImg = async function (req, res) {
    try {
        const objBody = req.body;
        const isEmpty = Object.keys(objBody).length === 0;
        if (isEmpty) return res.status(404).json({ message: "Cannot Provide Empty Fields" });

        const { blobImg } = JSON.parse(req.body);
        if (!blobImg) return res.status(400).json({ message: "Image is required" });

        const pic = await cloudinary.uploader.upload(blobImg, {
            folder: 'listing_pictures',
        });

        return res.status(200).json({
            message: "Image uploaded successfully",
            url: pic.secure_url,
            public_id: pic.public_id,
        });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

const addListing = async (req, res) => {
    try {
        const listingData = { ...JSON.parse(req.body), owner: req.user._id, ownerName: req.user.username, ownerGmail: req.user.gmail };
        const { error } = validateListing(listingData);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const newListing = await Listing.create(listingData);
        if (!newListing) return res.status(404).json({ message: "Unable to save listing." });

        const newUser = await User.findById(req.user._id);
        newUser.listings.push(newListing._id);
        const updatedUser = await newUser.save();
        console.log(updatedUser);
        if(!updatedUser) return res.status(404).json({message:"Unable to update user."});

        const savedListing = await newListing.save();
        if (!savedListing) return res.status(404).json({ message: "Unable to save listing." });

        return res.status(200).json({ message: "Listing added successfully" });
    } catch (error) {
        console.error("Error adding listing:", error);
        return res.status(500).json({ message: error.message });
    }
}

const viewOneListing = async (req, res) => {
    try {
        const listingId = req.params.id;
        console.log("Listing ID:", listingId);

        if (!listingId) return res.status(400).json({ message: "Listing ID is required" });
        const listing = await Listing.findById({_id: listingId});

        console.log("Listing found:", listing);
        if (!listing) return res.status(404).json({ message: "Listing not found" });

        return res.status(200).json(listing);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const viewListingAdmin = async (req,res) => {
    try{
        const listing = await Listing.findById(req.user.listings[0]);
        console.log(listing);

    }catch(err){
        console.log(err);
    }
}

export { uploadImg, addListing , viewOneListing , viewListingAdmin};