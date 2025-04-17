import mongoose from "mongoose";

const detailSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  details: [
    {
      fieldName: {  
        type: String,
        required: true,
        trim: true
      },
      value: {
        type: mongoose.Schema.Types.Mixed,  
        required: true
      },
      valueType: {
        type: String,
        enum: ["string", "number", "boolean", "date"],
        required: true
      }
    }
  ]
}, { timestamps: true });

const Detail = mongoose.model("Detail", detailSchema);  

export { Detail };