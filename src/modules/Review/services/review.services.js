import asyncHandler from "express-async-handler";
import Review from "../../../DB/models/review.model.js";
import Product from "../../../DB/models/product.model.js";
import { connection } from "../../../utils/index.js";

export const addReview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.id;
  const { comment, rating } = req.body;
  const product = await Product.findById(productId);
  if (!product) throw new Error(`product not found`, { cause: 404 });
  if (!comment && !rating)
    throw new Error(`one of them required`, { cause: 400 });
  const created = await Review.create({ userId, productId, comment, rating });
  if (created) {
    const newAvgRating =
      (product.avgRating * product.total_Ratings + rating) /
      (product.total_Ratings + 1);
    product.avgRating = newAvgRating;
    product.total_Ratings += 1;
    await product.save();
    await connection.set(`review:${created._id}`, true, "EX", 60 * 60 * 48);
    return res.status(200).json({ message: `review shared`, created });
  }
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = req.review;
  const reviewId = review._id;
  const { comment, rating } = req.body;
  const isEditable = await connection.get(`review:${reviewId}`);
  if (!isEditable) throw new Error("can't edit review");
  if (comment !== undefined) review.comment = comment;
  if (rating) {
    const product = await Product.findById(review.productId);
    const oldRating = review.rating;
    const totalRatings = product.total_Ratings;
    const totalScore = product.avgRating * totalRatings;
    const newAvgRating = (totalScore - oldRating + rating) / totalRatings;
    product.avgRating = newAvgRating;
    await product.save();
    review.rating = rating;
  }
  await review.save();
  return res.status(200).json({ message: "review edit successfully" });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = req.review;
  const reviewId = review._id;
  if (await connection.get(`review:${reviewId}`))
    await connection.del(`review:${reviewId}`);
  await review.deleteOne();
  const product = await Product.findById(review.productId);
  const oldAvg = product.avgRating;
  const oldTotal = product.total_Ratings;
  const newTotal = product.total_Ratings - 1;
  product.avgRating = oldAvg * oldTotal - review.rating / newTotal;
  product.total_Ratings = newTotal;
  await product.save();
  return res.status(200).json({ message: `review deleted` });
});

export const getReview = asyncHandler(async (req, res) => {
  const review = req.review;
  return res.status(200).json({ Review: review });
});

export const allReviewProduct = asyncHandler(async (req, res) => {
  const productId=req.params.productId
  const product = await Product.findById(productId)
    if(!product) throw new Error("product not found")
  const reviews = await Review.find({productId})
    .sort({ createdAt: -1 })
    .populate({ path: "userId", select: "user_name" })
    .lean();
  return res.status(200).json({ Reviews: reviews });
});
