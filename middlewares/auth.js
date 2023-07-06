const jwt = require('jsonwebtoken');
const { constants } = require('node:http2');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(constants.HTTP_STATUS_UNAUTHORIZED)
      .send({ message: 'Authorization required!' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res
      .status(constants.HTTP_STATUS_UNAUTHORIZED)
      .send({ message: 'Authorization required!' });
  }
  req.user = payload;
  return next();
};
