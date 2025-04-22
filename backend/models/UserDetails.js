import mongoose from "mongoose";

const detailSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  pincode: String,
  city: String,
  state: String,
  country: String,
  UserType:String,
  UserType: {
    type: String,
    enum: ["Renter", "Buyer", "Property Owner", "Agent"],
  }
});

const Detail = mongoose.model("Detail", detailSchema);

export { Detail };