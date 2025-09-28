import Joi from "joi";

export const signupSchema = {
  body: Joi.object({
    Name: Joi.string().required().min(4).trim(),
    user_name: Joi.string().required().min(4).trim(),
    email: Joi.string()
      .email({
        tlds: ["com", "org", "net"],
      })
      .required()
      .trim()
      .lowercase()
      .messages({
        "string.email": "Invalid email format",
        "any.required": "Email is required",
      }),
    password: Joi.string()
      .min(6)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?.&-])[A-Za-z\d@$!%?.&-]{6,}$/
      )
      .required()
      .trim()
      .messages({
        "string.min": "Password should be at least 6 characters",
        "any.required": "Password is required",
      }),
    phone: Joi.string().max(11).required().messages({
      "any.required": "phone is required",
    }),
    role: Joi.string().valid("user", "Admin").default("user"),
    age: Joi.number().required().min(16).max(100).messages({
      "number.base": "Age must be a number",
      "number.min": "Age must be at least 18",
      "number.max": "Age must be less than or equal to 100",
      "any.required": "Age is required",
    }),
    address: Joi.string().required(),
  }),
};

export const confirmEmailSchema = {
  body: Joi.object({
    OTP: Joi.string().alphanum().required().length(6),
    email: Joi.string()
      .email({
        tlds: ["com", "org", "net"],
      })
      .trim()
      .lowercase()
      .messages({
        "string.email": "Invalid email format",
      }),
  }),
};

export const updateSchema = {
  body: Joi.object({
    Name: Joi.string().min(4).trim(),
    email: Joi.string()
      .email({
        tlds: ["com", "org", "net"],
      })
      .trim()
      .lowercase()
      .messages({
        "string.email": "Invalid email format",
      }),
    phone: Joi.string().max(11).messages({
      "any.required": "phone is required",
    }),
    age: Joi.number().min(16).max(100).messages({
      "number.base": "Age must be a number",
      "number.min": "Age must be at least 18",
      "number.max": "Age must be less than or equal to 100",
    }),
    address: Joi.string(),
  }),
};

export const loginSchema = {
  body: Joi.object({
    email: Joi.string()
      .email({
        tlds: ["com", "org", "net"],
      })
      .trim()
      .lowercase()
      .messages({
        "string.email": "Invalid email format",
        "any.required": "Email is required",
      })
      .required(),
    password: Joi.string()
      .min(6)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?.&-])[A-Za-z\d@$!%?.&-]{6,}$/
      )
      .required()
      .trim()
      .messages({
        "string.min": "Password should be at least 6 characters",
        "any.required": "Password is required",
      }),
  }),
};
export const updatePasswordSchema = {
  body: Joi.object({
    oldPassword: Joi.string()
      .min(6)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?.&-])[A-Za-z\d@$!%?.&-]{6,}$/
      )
      .trim()
      .required()
      .messages({
        "string.min": "Password should be at least 6 characters",
        "any.required": "Password is required",
      }),
    newPassword: Joi.string()
      .min(6)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?.&-])[A-Za-z\d@$!%?.&-]{6,}$/
      )
      .required()
      .trim()
      .messages({
        "string.min": "Password should be at least 6 characters",
        "any.required": "Password is required",
      }),
    newPasswordConfirm: Joi.string()
      .min(6)
      .valid(Joi.ref("newPassword"))
      .required()
      .trim()
      .messages({
        "string.min": "Password should be at least 6 characters",
        "any.required": "Password is required",
      }),
  }),
};
export const resetPasswordSchema = {
  body: Joi.object({
    OTP: Joi.string().alphanum().required().length(6),
    newPassword: Joi.string()
      .min(6)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?.&-])[A-Za-z\d@$!%?.&-]{6,}$/
      )
      .trim()
      .required()
      .messages({
        "string.min": "Password should be at least 6 characters",
        "any.required": "Password is required",
      }),
  }),
};
export const resendOTPSchema = {
  query: Joi.object({
    email: Joi.string()
      .email({
        tlds: ["com", "org", "net"],
      })
      .required()
      .trim()
      .lowercase()
      .messages({
        "string.email": "Invalid email format",
        "any.required": "Email is required",
      }),
  }),
};

export const checkParams = {
  params: Joi.object({
    id: Joi.string().length(24).required().hex(),
  }),
};
