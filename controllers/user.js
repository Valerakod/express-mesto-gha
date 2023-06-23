const User = require('../models/user');

const getAllUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((users) => {
      if (users && users.length > 0) {
        return res.send({ users });
      }
      return res.status(500).send('No users found');
    })
    .catch(() => res.status(500).send('No users found'));
};

const getUserById = (req, res) => {
  const id = req.params.userId ? req.params.userId : req.user._id;
  User.findById(id)
    .orFail()
    .then((user) => res.status(200).send({ user }))
    .catch(() => res.status(500).send(`User with id: ${id} was not found `));
};

const createNewUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .orFail()
    .then((user) => res.status(200).send({ user }))
    .catch(() => res.status(500).send('An error occurred when creating a new user'));
};

const editUserInfo = (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { name, about })
    .orFail()
    .then((user) => res.status(200).send({ user }))
    .catch(() => res.status(500).send(`User with id: ${id} was not updated`));
};

const editAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { avatar })
    .orFail()
    .then((user) => res.status(200).send({ user }))
    .catch(() => res.status(500).send(`Avatar for user with id: ${id} was not updated`));
};

module.exports = {
  getAllUsers,
  getUserById,
  createNewUser,
  editUserInfo,
  editAvatar,
};
