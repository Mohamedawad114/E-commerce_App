
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    total_price: {
      type: Number,
      default: 0,
    },
    products: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

cartSchema.pre("save", function (next) {
  this.total_price = this.products.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
  next();
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
