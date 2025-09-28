const keys = ["body", "query", "params"];
export const validate = (schema) => {
  return (req, res, next) => {
    let validationError = [];
    for (const key of keys) {
      if (schema[key]) {
        const { error } = schema[key].validate(req[key], { abortEarly: false });
        if (error) {
          validationError.push(...error.details);
        }
      }
      if (validationError.length) {
        return res
          .status(400)
          .json({ Message: "validation Errors", errors: validationError });
      }
    }
    next();
  };
};
