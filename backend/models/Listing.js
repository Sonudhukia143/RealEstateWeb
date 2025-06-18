import mongoose from "mongoose";
import Joi from "joi";

const listingSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
        default: "No description provided"
    },
    address: {
        type: Object
    },
    type: {
        type: String,
        enum: ['rent', 'sale'],
    },
    bedrooms: {
        type: Number,
        default: 1
    },
    bathrooms: {
        type: Number,
        default: 1
    },
    regularPrice: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        default: 0
    },
    offer: {
        type: Boolean,
        default: false
    },
    parking: {
        type: Boolean,
        default: false
    },
    furnished: {
        type: Boolean,
        default: false
    },
    imageUrls: [],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    ownerGmail: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Listing = mongoose.model("Listing", listingSchema);

const validateListing = (listing) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        description: Joi.string().max(500).optional(),
        address: Joi.object().required(),
        type: Joi.string().valid('rent', 'sale').required(),
        bedrooms: Joi.number().integer().min(1).default(1),
        bathrooms: Joi.number().integer().min(1).default(1),
        regularPrice: Joi.number().positive().required(),
        discountPrice: Joi.number().min(0).optional(),
        offer: Joi.boolean().default(false),
        parking: Joi.boolean().default(false),
        furnished: Joi.boolean().default(false),
        imageUrls: Joi.array().required(),
        owner: Joi.required(), // Assuming owner is a user ID
        ownerName: Joi.string().required(),
        ownerGmail: Joi.string().email().required(),
        createdAt: Joi.required()
    });
    return schema.validate(listing);
};

export { Listing, validateListing };