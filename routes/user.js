const router = require('express').Router();
const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');

const {
  getAllUsers,
  getUserById,
  editUserInfo,
  editAvatar,
} = require('../controllers/user');

router.use(express.json());
router.get('/users', getAllUsers);
router.get('/users/me', getUserById);
router.get(
  '/users/:userId',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      userId: Joi.string().length(24).hex().required(),
    }),
  }),
  getUserById,
);
router.patch(
  '/users/me',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  editUserInfo,
);
router.patch(
  '/users/me/avatar',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      avatar: Joi.string()
        .required()
        .pattern(
          /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$/,
        ),
    }),
  }),
  editAvatar,
);

module.exports = router;
