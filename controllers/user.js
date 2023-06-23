const User = require("../models/user");
const someErrorUser = {
  "message": "Запрашиваемый пользователь не найден"
};
const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId ? req.params.userId : req.user._id)
    .then((user) => if (err.name === someErrorUser) { return res.status(400).send({ user })})
    .catch((err) => console.error(err));
    .catch(next);
};

const createNewUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => console.error(err));
};

const editUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about }
  )
    .then((user) => res.send({ user }))
    .catch((err) => console.error(err))
    .catch(next);
};

const editAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar }
  )
  .then((user) => res.send({ user }))
  .catch((err) => console.error(err))
  .catch(next);
};

module.exports = {
  getAllUsers,
  getUserById,
  createNewUser,
  editUserInfo,
  editAvatar
};