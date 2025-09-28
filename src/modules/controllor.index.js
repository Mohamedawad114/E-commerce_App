import adminRouter from "./Users/Admin/admin.controllor.js";
import userRouter from "./Users/user/controllors/profile.controllor.js";
import userCategoryRouter from "./category/user/user_category.controllor.js";
import adminCategoryRouter from "./category/admin/admin_category.controllor.js";
import adminProductRouter from "./Products/admin/adminProduct.contollor.js";
import userProductRouter from "./Products/users/userProducts.controllor.js";
import wishlistRouter from "./Wishlist/wishlist.controllor.js";
import reviewRouter from "./Review/review.controllor.js";
import cartRouter from "./Cart/cart.controllor.js";
import authRouter from "./Users/user/controllors/auth.controllor.js";
import userOder_Router from "./Order/user/user.order.controllor.js";
import adminOrder_Router from './Order/admin/admin.order.controllor.js'
import payment_Router from './Payment/payment.controllor.js'
export const app_router = {
  adminRouter,
  userRouter,
  userCategoryRouter,
  adminCategoryRouter,
  adminProductRouter,
  userProductRouter,
  wishlistRouter,
  cartRouter,
  reviewRouter,
  authRouter,
  userOder_Router,
  adminOrder_Router,
  payment_Router,
};
