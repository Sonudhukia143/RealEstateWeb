import mongoose from "mongoose";
import Joi from "joi";

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
});

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        unique: true 
    },
    profile: [ImageSchema],
    gmail: { 
        type: String, 
        unique: true, 
    },
    password: { 
        type: String,
    }
});

const User = mongoose.model("User", userSchema);

const validateUser = (user) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(30).required(),
        gmail: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(user);
};

export { User, validateUser };