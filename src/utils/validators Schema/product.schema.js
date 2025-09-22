import Joi from "joi";

export const productSchema = {
  body: Joi.object({
    name: Joi.string().min(4).required().trim(),
    description: Joi.string().min(4).max(500).required().trim(),
    stock: Joi.number().integer().required().greater(0),
    price: Joi.number().required().greater(0),
    categoryId: Joi.string().hex().length(24).required(),
  }),
};
export const updateProductSchema = {
  body: Joi.object({
    name: Joi.string().min(4).trim(),
    description: Joi.string().min(4).max(500).trim(),
    stock: Joi.number().integer().greater(0),
    price: Joi.number().greater(0),
    categoryId: Joi.string().hex().length(24),
  }),
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};
export const categoryProductSchema = {
  query: Joi.object({
    page: Joi.number().integer().default(1).min(1).max(50),
  }),
  params: Joi.object({
    categoryId: Joi.string().hex().length(24).required(),
  }),
};
