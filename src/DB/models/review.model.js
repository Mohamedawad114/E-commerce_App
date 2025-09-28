import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref:"User",
      required: true,
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref:"Product",
      required: true,
    },
    comment: {
      type: String,
      maxlength: 300,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);
const Review = mongoose.model("Review", reviewSchema);
export default Review;
