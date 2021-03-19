const { CastError } = require('mongoose').Error;

const {
  ClientError,
  ServerError,
  NotFoundError,
  BadRequestError,
  MethodNotAllowedError,
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

  if (err instanceof SyntaxError) {
    // JSON parsing error handler
    err = new BadRequestError('Failed to parse request body');
  } else if (err instanceof CastError) {
    // db query type casting error handler
    err = new BadRequestError('Incorrect query parameter type');
  } else {
    // unknown error handler
    console.error(err);
    err = new ServerError(err);
  }

  return res.status(err.status).json(err.toResponseBody());
}

module.exports = {
  notFoundHandler,
  notAllowedHandler,
  basicHandler
}
