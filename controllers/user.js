const User = require('../models/user');

const getAllUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((users) => {
      if (users && users.length > 0) {
        return res.send({ users });
      }
      return res.status(500).send({ message: 'No users found' });
    })
    .catch(() => res.status(400).send({ message: 'No users found' }));
};

const getUserById = (req, res) => {
  const id = req.params.userId ? req.params.userId : req.user._id;
  User.findById(id)
    .orFail()
    .then((user) => res.status(200).send({ user }))
    .catch(() =>
      res.status(404).send({ message: `User with id: ${id} was not found ` })
    );
};

const createNewUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ user }))
    .catch(() =>
      res
        .status(400)
        .send({ message: 'An error occurred when creating a new user' })
    );
};

const editUserInfo = (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(
    id,
    { name, about },
    { upsert: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(200).send({ user }))
    .catch(() =>
      res.status(400).send({ message: `User with id: ${id} was not updated` })
    );
};

const editAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { avatar }, { upsert: true, runValidators: true })
    .orFail()
    .then((user) => res.status(200).send({ user }))
    .catch(() =>
      res
        .status(400)
        .send({ message: `Avatar for user with id: ${id} was not updated` })
    );
};

module.exports = {
  getAllUsers,
  getUserById,
  createNewUser,
  editUserInfo,
  editAvatar,
};
