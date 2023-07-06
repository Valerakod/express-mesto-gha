const { constants } = require('node:http2');

class AuthentificationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_UNAUTHORIZED;
  }
}

module.exports = AuthentificationError;
