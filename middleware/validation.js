//this validation middleware has no usages yet. We just created it for whenever we actually need to use it its ready.

const Joi = require("joi");

// Validation schemas
const schemas = {
  userRegistration: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    // Add more fields as necessary
  }),
  serviceCreation: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    category: Joi.string().required(),
    // Add more fields as necessary
  }),
  reviewPost: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().allow(""), // Allow empty comment
    // Add more fields as necessary
  }),
  // Add more schemas as necessary
};

const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};

module.exports = { schemas, validationMiddleware };
