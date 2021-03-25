const { BadRequestError } = require('../utils/errors');


module.exports = (ignoreMethods = ['GET', 'OPTIONS', 'HEAD']) => (req, res, next) => {
  if (ignoreMethods.includes(req.method)) {
    return next();
  }

  const { _csrf } = req.session;
  const userToken = req.headers['x-csrf-token'];

  if (!userToken || userToken !== _csrf) {
    next(new BadRequestError('Invalid CSRF token'));
  }

  next();
}