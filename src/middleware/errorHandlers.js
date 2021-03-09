const {
  ClientError,
  ServerError,
  NotFoundError,
  MethodNotAllowedError
} = require('../utils/errors');


function notFoundHandler(req, res) {
  throw new NotFoundError();
}

function notAllowedHandler(req, res) {
  throw new MethodNotAllowedError();
}

function basicHandler(err, req, res, next) {
  if (err instanceof ClientError) {
    return res.status(err.status).json(err.toResponseBody());
  }

  console.error(err);
  const serverError = new ServerError(err);
  return res
    .status(serverError.status)
    .json(serverError.toResponseBody());
}

module.exports = {
  notFoundHandler,
  notAllowedHandler,
  basicHandler
}
