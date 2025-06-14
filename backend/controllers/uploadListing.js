import { cloudinary } from '../cloudinary/cloudinaryConfig.js';
import { Listing, validateListing } from '../models/Listing.js';

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

        const savedListing = await newListing.save();
        if (!savedListing) return res.status(404).json({ message: "Unable to save listing." });

        return res.status(200).json({ message: "Listing added successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export { uploadImg, addListing };