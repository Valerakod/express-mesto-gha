const { constants } = require('node:http2');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
  }
}

module.exports = BadRequestError;
