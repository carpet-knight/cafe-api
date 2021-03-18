const Joi = require('joi');


/********************** schemas for user fields validation ************************/

const nameSchema = Joi.string().min(2).max(128).trim();
const loginSchema = Joi.alternatives().try(
  Joi.string().min(2).max(128).token().trim(),
  Joi.string().email().lowercase().trim()
);
const passwordSchema = Joi.string().min(8).max(128).trim();
const roleSchema = Joi.string().valid('admin', 'manager', 'employee', 'customer');

/*********************************************************************************/

/******************** schema for database query validation **********************/

const querySchema = Joi.object({
  limit: Joi.number().min(1),
  offset: Joi.number().min(0),
  fields: Joi.string(),
  sort: Joi.string()
}).pattern(
  Joi.string(),
  Joi.alternatives().try(
    Joi.string().trim(),
    Joi.object().pattern(
      Joi.string().valid(
        '$eq',
        '$gt',
        '$gte',
        '$lt',
        '$lte',
        '$ne',
      ),
      Joi.string().trim()
    ).min(1)
  )
);

/*********************************************************************************/

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
  },
  querySchema
}

module.exports = schemas;
