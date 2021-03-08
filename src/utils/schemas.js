const Joi = require('joi');


const loginSchema = Joi.alternatives().try(
  Joi.string().min(2).max(128).token().trim(),
  Joi.string().email().lowercase().trim()
).required();
const passwordSchema = Joi.string().required().min(8).max(128).trim();

const schemas = {
  loginSchema: Joi.object({
    login: loginSchema,
    password: passwordSchema
  })
}

module.exports = schemas;
