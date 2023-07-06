const { constants } = require('node:http2');

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  }
}

module.exports = ServerError;
