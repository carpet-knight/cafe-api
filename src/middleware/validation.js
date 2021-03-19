const { BadRequestError } = require('../utils/errors');


module.exports = (property, schema) => async (req, res, next) => {
  try {
    req[property] = await schema.validateAsync(req[property]);
  } catch (error) {
    next(new BadRequestError(error.message));
  }

  next();
}
