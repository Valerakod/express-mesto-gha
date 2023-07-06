const { constants } = require('node:http2');

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_FORBIDDEN;
  }
}

module.exports = AuthorizationError;
