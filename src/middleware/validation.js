const ash = require('express-async-handler');

const { BadRequestError } = require('../utils/errors');


module.exports = (property, schema) => ash(async (req, res, next) => {
  try {
    req[property] = await schema.validateAsync(req[property]);
  } catch (error) {
    throw new BadRequestError(error.message);
  }

  next();
});
