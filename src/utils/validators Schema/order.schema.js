import Joi from "joi";

export const orderSchema = {
  body: Joi.object({
    phone: Joi.string().length(11).optional().trim(),
    address: Joi.string().required().max(255).trim(),
    payment_method: Joi.string().valid("visa").required(),
  }),
};
export const orderIdSchema = {
  params: Joi.object({
    id: Joi.string().length(24).required().hex(),
  }),
};
