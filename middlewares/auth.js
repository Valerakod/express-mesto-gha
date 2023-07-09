const jwt = require('jsonwebtoken');
const AuthentificationError = require('../errors/AuthentificationError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthentificationError('Authorization required!'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new AuthentificationError('Authorization required!'));
  }
  req.user = payload;
  return next();
};
