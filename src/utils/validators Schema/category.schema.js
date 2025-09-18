import Joi from "joi";

export const CategorySchema = {
  body: Joi.object({
    name: Joi.string().min(4).required().trim(),
    description: Joi.string().min(4).max(255).required().trim(),
  }),
};
export const updateCategorySchema = {
  body: Joi.object({
    name: Joi.string().min(4).trim(),
    description: Joi.string().min(4).max(255).trim(),
  }),
};

export const checkQuery = {
  query: Joi.object({
    page: Joi.number().integer().default(1).min(1).max(50),
    name: Joi.string().trim().optional(),
  }),
};
