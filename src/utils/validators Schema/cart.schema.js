import Joi from "joi";
export const cartSchema = {
  body: Joi.object({
    productId: Joi.string().hex().length(24).trim().required(),
    quantity: Joi.number().min(1)
  }),
};
