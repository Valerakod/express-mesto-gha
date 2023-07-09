const { constants } = require('node:http2');
const { Error } = require('mongoose');
const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const ServerError = require('../errors/ServerError');
const AuthorizationError = require('../errors/AuthorizationError');
const NotFoundError = require('../errors/NotFoundError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next(new BadRequestError('No cards foun')));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(constants.HTTP_STATUS_CREATED).send(card))
    .catch((error) => {
      if (error instanceof Error.ValidationError) {
        return next(new BadRequestError('Validation error'));
      }
      return next(new ServerError('Server error '));
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail()
    .then((card) => {
      const owner = card.owner.toString();

      if (owner === req.user._id) {
        Card.deleteOne(card)
          .then(() => res.status(constants.HTTP_STATUS_OK).send(card))
          .catch((error) => {
            console.log(error);
            return next(
              new BadRequestError(
                `An error occurred when deleting card ${cardId}`,
              ),
            );
          });
      } else {
        return next(
          new AuthorizationError(
            `An error occurred deleting card: ${cardId}. It is not owned by ${req.user._id}. The real owner is ${owner}`,
          ),
        );
      }

      return next();
    })
    .catch((error) => {
      console.log(error);
      if (error instanceof Error.CastError) {
        return next(new BadRequestError('oh no!'));
      }
      if (error instanceof Error.DocumentNotFoundError) {
        return next(new NotFoundError(`Card with id ${cardId} not found`));
      }
      return next(new ServerError('Server error '));
    });

  return next();
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail()
    .then((card) => res.status(constants.HTTP_STATUS_OK).send({ card }))
    .catch((error) => {
      console.log(error.name);
      if (error instanceof Error.CastError) {
        return next(new BadRequestError('oh no!'));
      }
      if (error instanceof Error.DocumentNotFoundError) {
        return next(new NotFoundError('oh no!'));
      }
      return next(
        new BadRequestError(
          `An error occurred when adding a like to card: ${cardId}`,
        ),
      );
    });
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail()
    .then((card) => res.status(constants.HTTP_STATUS_OK).send({ card }))
    .catch((error) => {
      console.log(error.name);
      if (error instanceof Error.CastError) {
        return next(new BadRequestError('oh no!'));
      }
      if (error instanceof Error.DocumentNotFoundError) {
        return next(new NotFoundError('oh no!'));
      }
      return next(
        new BadRequestError(
          `An error occurred when deleting a like to card: ${cardId}`,
        ),
      );
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
