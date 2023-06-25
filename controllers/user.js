const { constants } = require('node:http2');
const User = require('../models/user');

const getAllUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((users) => res.send({ users }))
    .catch(() => res
      .status(constants.HTTP_STATUS_BAD_REQUEST)
      .send({ message: 'No users found' }));
};

const getUserById = (req, res) => {
  const id = req.params.userId ? req.params.userId : req.user._id;
  User.findById(id)
    .orFail()
    .then((user) => res.status(constants.HTTP_STATUS_OK).send({ user }))
    .catch((error) => {
      console.log(error.name);
      if (error.name === 'CastError') {
        return res
          .status(constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'oh no!' });
      }

      return res
        .status(constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: `User with id: ${id} was not found ` });
    });
};

const createNewUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(constants.HTTP_STATUS_OK).send({ user }))
    .catch(() => res
      .status(constants.HTTP_STATUS_BAD_REQUEST)
      .send({ message: 'An error occurred when creating a new user' }));
};

const editUserInfo = (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(constants.HTTP_STATUS_OK).send({ user }))
    .catch(() => res
      .status(constants.HTTP_STATUS_BAD_REQUEST)
      .send({ message: `User with id: ${id} was not updated` }));
};

const editAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(constants.HTTP_STATUS_OK).send({ user }))
    .catch(() => res
      .status(constants.HTTP_STATUS_BAD_REQUEST)
      .send({ message: `Avatar for user with id: ${id} was not updated` }));
};

module.exports = {
  getAllUsers,
  getUserById,
  createNewUser,
  editUserInfo,
  editAvatar,
};
