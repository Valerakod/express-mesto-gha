const { constants } = require('node:http2');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_NOT_FOUND;
  }
}

module.exports = NotFoundError;
