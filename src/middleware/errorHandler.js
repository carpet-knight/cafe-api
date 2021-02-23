const { ClientError, ServerError } = require('../utils/errors');

module.exports = (err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.status).json(err.toResponseBody());
  }

  console.error(err);
  const serverError = new ServerError(err);
  return res.status(serverError.status).json(serverError.toResponseBody());
}
