const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { constants } = require('node:http2');
const { Error } = require('mongoose');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ServerError = require('../errors/ServerError');
const AuthentificationError = require('../errors/AuthentificationError');
const AlreadyExistsError = require('../errors/AlreadyExistsError');
const NotFoundError = require('../errors/NotFoundError');

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return next(
          new AuthentificationError('Email or password is not correct'),
        );
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return next(
            new AuthentificationError('Email or password is not correct'),
          );
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
    .catch(next(new BadRequestError('No users found')));
};

const getUserById = (req, res, next) => {
  const id = req.params.userId ? req.params.userId : req.user._id;
  User.findById(id)
    .orFail()
    .then((user) => res.status(constants.HTTP_STATUS_OK).send({ user }))
    .catch((error) => {
      if (error instanceof Error.CastError) {
        return next(new BadRequestError('oh no!'));
      }
      if (error instanceof Error.DocumentNotFoundError) {
        return next(new NotFoundError(`User with id: ${id} was not found `));
      }
      return next(new ServerError('Server error '));
    });
};

const createNewUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(constants.HTTP_STATUS_CREATED).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError('Incorrect data was passed during user creation.'),
        );
      }
      if (err.code === 11000) {
        return next(
          new AlreadyExistsError('User with this email already exists'),
        );
      }
      return next(err);
    });

  return next();
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
        return next(new BadRequestError('Validation error'));
      }
      if (error instanceof Error.DocumentNotFoundError) {
        return next(new NotFoundError('User not found'));
      }
      return next(new ServerError('Server error'));
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
        return next(new BadRequestError('Validation error'));
      }
      if (error instanceof Error.DocumentNotFoundError) {
        return next(new NotFoundError(`User with id: ${id} was not found`));
      }
      return next(new ServerError('Server error'));
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
