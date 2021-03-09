// abstract class
class AppBaseError extends Error {
  constructor(message) {
    super(message);

    if (this.constructor === AppBaseError) {
      throw new Error('Failed to create an instance of an abstract class');
    }
  }

  toResponseBody() {
    return {
      status: this.status,
      type: this.type,
      message: this.message
    }
  }
}

class ServerError extends AppBaseError {
  constructor(error) {
    super('Something went terribly wrong');
    this.status = 500;
    this.cause = error;
    this.type = 'Internal Server Error';
  }
}

// abstract class
class ClientError extends AppBaseError {
  constructor(message) {
    super(message);

    if (this.constructor === ClientError) {
      throw new Error('Failed to create an instance of an abstract class');
    }
  }
}

class BadRequestError extends ClientError {
  constructor(message) {
    super(message);
    this.status = 400;
    this.type = 'Bad Request';
  }
}

class UnauthorizedError extends ClientError {
  constructor(message = 'Access Denied') {
    super(message);
    this.status = 401;
    this.type = 'Unauthorized';
  }
}

class ForbiddenError extends ClientError {
  constructor(message = 'No permission to perform the requested operation') {
    super(message);
    this.status = 403;
    this.type = 'Forbidden';
  }
}

class NotFoundError extends ClientError {
  constructor(message = 'Requested Resource Not Found') {
    super(message);
    this.status = 404;
    this.type = 'Not Found';
  }
}

class MethodNotAllowedError extends ClientError {
  constructor(message = 'Request Method Not Allowed') {
    super(message);
    this.status = 405;
    this.type = 'Method Not Allowed';
  }
}

module.exports = {
  ClientError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  MethodNotAllowedError,
  ServerError
}
