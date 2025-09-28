import Review from "../DB/models/review.model.js";

export const verifyReview_owner = async (req, res, next) => {
  const reviewId = req.params.reviewId;
  const review = await Review.findById(reviewId);
  if (!review) throw new Error(`review not found`, { cause: 404 });
  if (review.userId.toString() !== req.user.id) {
    throw new Error("you are not authorized", { cause: 401 });
  }
  req.review = review;
  next();
};
