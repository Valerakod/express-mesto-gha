const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { constants } = require('node:http2');
const { Error } = require('mongoose');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ServerError = require('../errors/ServerError');
const AuthentificationError = require('../errors/AuthentificationError');
const EmailError = require('../errors/EmailError');
const NotFoundError = require('../errors/NotFoundError');

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        next(new AuthentificationError('Email or password is not correct'));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          next(new AuthentificationError('Email or password is not correct'));
        }
        return res.send({
          token: jwt.sign({ _id: user._id }, 'some-secret-key', {
            expiresIn: '7d',
          }),
        });
      });
    })
    .catch(next);
};

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => next(new BadRequestError('No users found')));
};

const getUserById = (req, res, next) => {
  const id = req.params.userId ? req.params.userId : req.user._id;
  User.findById(id)
    .orFail()
    .then((user) => res.status(constants.HTTP_STATUS_OK).send({ user }))
    .catch((error) => {
      if (error instanceof Error.CastError) {
        next(new BadRequestError('oh no!'));
      }
      if (error instanceof Error.DocumentNotFoundError) {
        next(new BadRequestError(`User with id: ${id} was not found `));
      }
      next(new ServerError('Server error '));
    });
};

const createNewUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User.create({
    name, about, avatar, email, password,
  })
    .then((user) => res.status(constants.HTTP_STATUS_OK).send({ user }))
    .catch((error) => {
      if (error instanceof Error.ValidationError) {
        next(new BadRequestError('Validation error'));
      }
      next(new BadRequestError('An error occurred when creating a new user'));
    })
    .catch((error) => {
      if (error instanceof Error.MongoError) {
        next(new EmailError('A User with this email address already exists'));
      }
    });
};

const editUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(constants.HTTP_STATUS_OK).send({ user }))
    .catch((error) => {
      if (error instanceof Error.ValidationError) {
        next(new BadRequestError('Validation error'));
      }
      next(new ServerError('Server error'));
    });
};

const editAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(constants.HTTP_STATUS_OK).send({ user }))
    .catch((error) => {
      if (error instanceof Error.ValidationError) {
        next(new BadRequestError('Validation error'));
      }
      if (error instanceof Error.DocumentNotFoundError) {
        next(new NotFoundError(`User with id: ${id} was not found`));
      }
      next(new ServerError('Server error'));
    });
};

module.exports = {
  login,
  getAllUsers,
  getUserById,
  createNewUser,
  editUserInfo,
  editAvatar,
};
