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
        const listingData = { ...JSON.parse(req.body), owner: req.user._id, ownerName: req.user.username, ownerGmail: req.user.gmail ,  createdAt: new Date() };
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

        return res.status(200).json({ message: "Listing added successfully" ,listingId: savedListing._id.toString()});
    } catch (error) {
        console.error("Error adding listing:", error);
        return res.status(500).json({ message: error.message });
    }
}

const viewOneListing = async (req, res) => {
    try {
        const listingId = req.params.id;

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
        const listing = await Listing.find({
            _id:{ $in: req.user.listings }
        });
        if(!listing || listing.length === 0) return res.status(404).json({message: "No listings found"});

        return res.status(200).json({message: "Listings fetched successfully", listings: listing });
    }catch(err){
        return res.status(500).json({ message: err.message });
    }
}

const deleteListing = async (req, res) => {
    try {
        const listingId = req.params.id;
        if (!listingId) return res.status(400).json({ message: 'Listing ID is required' });

        const listing = await Listing.findById({ _id: listingId });
        if (!listing) return res.status(404).json({ message: 'Listing not found' });

        if (listing.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'You are not authorized to delete this listing' });
        
        console.log(req.user);

        // Delete the listing
        await Listing.findByIdAndDelete(listingId);
        // Remove listing ID from user's listings array
        const user = await User.findById(req.user._id);
        if (user) {
            user.listings.pull(listingId);  // removes from array
            const savedUser = await user.save();
            if(!savedUser) return res.status(404).json({message:"Failed to update the user."});
            console.log(savedUser);
        }
        return res.status(200).json({ message: 'Listing deleted successfully' });
    } catch (err) {
        console.error('Error deleting listing:', err);
        return res.status(500).json({ message: err.message });
    }
};

const viewAllListings = async (req, res) => {
    try {
        const listings = await Listing.find({});
        if (!listings || listings.length === 0) return res.status(404).json({ message: "No listings found" });

        return res.status(200).json({ message: "Listings fetched successfully", listings });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const initialFetch = async (req, res) => {
  try {
    const listings = await Listing.find({});
    if(listings.length <= 0 || !listings) return res.status(404).json({message:"No Listings Found."})

    const currentDate = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(currentDate.getDate() - 7);

    // 1. 4 random listings for sale
    const randomSaleListings = await Listing.aggregate([
      { $match: { type: 'sale' } },
      { $sample: { size: 4 } }
    ]);

    // 2. 4 random listings for rent
    const randomRentListings = await Listing.aggregate([
      { $match: { type: 'rent' } },
      { $sample: { size: 4 } }
    ]);

    // 3. 4 listings created within the past week
    const weeklyListings = await Listing.find({
      createdAt: { $gte: oneWeekAgo, $lte: currentDate }
    })
      .sort({ createdAt: -1 })
      .limit(4);

    return res.status(200).json({
      message: "Fetched listings successfully",
      randomSaleListings,
      randomRentListings,
      weeklyListings
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export { uploadImg, addListing , viewOneListing , viewListingAdmin ,deleteListing, viewAllListings, initialFetch};