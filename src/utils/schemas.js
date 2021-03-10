const Joi = require('joi');


const nameSchema = Joi.string().min(2).max(128).trim();
const loginSchema = Joi.alternatives().try(
  Joi.string().min(2).max(128).token().trim(),
  Joi.string().email().lowercase().trim()
);
const passwordSchema = Joi.string().min(8).max(128).trim();
const roleSchema = Joi.string().valid('admin', 'manager', 'employee', 'customer');

const schemas = {
  loginSchema: Joi.object({
    login: loginSchema.required(),
    password: passwordSchema.required()
  }),
  user: {
    creationSchema: Joi.object({
      name: nameSchema.required(),
      login: loginSchema.required(),
      password: passwordSchema.required(),
      role: roleSchema.required()
    })
  }
}

module.exports = schemas;
