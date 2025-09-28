import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 4,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 500,
      trim: true,
    },
    Images: [
      {
        public_id: { type: String, default: null },
        url: { type: String, default: null },
      },
    ],
    price: {
      type: Number,
      required: true,
      min: [1, `the price must be greater than 0`],
    },
    stock: {
      type: Number,
      required: true,
    },
    avgRating: {
      type: Number,
      default: 0
    },
    total_Ratings: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default:0,
    },
    categoryId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
