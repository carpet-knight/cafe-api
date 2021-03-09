const { UnauthorizedError, ForbiddenError } = require('../utils/errors');


module.exports = (allowedRoles = ['admin']) => (req, res, next) => {
  const { user } = req.session;

  if (!user) {
    throw new UnauthorizedError();
  }

  if (!allowedRoles.includes(user.role)) {
    throw new ForbiddenError();
  }

  req.user = user;
  next();
}
