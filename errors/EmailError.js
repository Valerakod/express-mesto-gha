const { constants } = require('node:http2');

class EmailError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_CONFLICT;
  }
}

module.exports = EmailError;
