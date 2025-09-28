import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
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
      maxlength: 255,
      trim: true,
    },
    Image: {
      public_id: { type: String, default: null },
      url: { type: String, default: null },
    },
    product_num: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
const Category = mongoose.model("Category", categorySchema);

export default Category;
