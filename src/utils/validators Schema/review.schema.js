import Joi from "joi";

export const addReview = {
  body: Joi.object({
    comment: Joi.string().optional().max(100),
    rating: Joi.number().min(1).max(5),
  }).or("comment", "rating"),
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};
export const updateReview = {
  body: Joi.object({
    comment: Joi.string().optional().max(100),
    rating: Joi.number().min(1).max(5),
  }),
  params: Joi.object({
    reviewId: Joi.string().hex().length(24).required(),
  }),
};
export const reviewId = {
  params: Joi.object({
    reviewId: Joi.string().hex().length(24).required(),
  }),
};
