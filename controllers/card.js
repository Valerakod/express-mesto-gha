const { constants } = require('node:http2');
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(constants.HTTP_STATUS_OK).send(cards))
    .catch(() => res
      .status(constants.HTTP_STATUS_BAD_REQUEST)
      .send({ message: 'No cards found' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(constants.HTTP_STATUS_CREATED).send(card))
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          message: `An error occurred when creating a new card for user ${owner}`,
        });
      }

      if (error.name === 'ValidationError') {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Validation error',
        });
      }
      return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'Server error',
      });
    });
};

const deleteCard = (req, res) => {
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
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
              message: `An error occurred when deleting card ${cardId}`,
            });
          });
      } else {
        res.status(constants.HTTP_STATUS_FORBIDDEN).send({
          message: `An error occurred deleting card: ${cardId}. It is not owned by ${req.user._id}. The real owner is ${owner}`,
        });
      }
    })
    .catch((error) => {
      console.log(error);
      if (error.name === 'CastError') {
        return res
          .status(constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'oh no!' });
      }
      return res
        .status(constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: `Card with id ${cardId} not found` });
    });
};

const likeCard = (req, res) => {
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
      if (error.name === 'DocumentNotFoundError') {
        return res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Oh no!' });
      }
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
        message: `An error occurred when adding a like to card: ${cardId}`,
      });
    });
};

const dislikeCard = (req, res) => {
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
      if (error.name === 'DocumentNotFoundError') {
        return res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Oh no!' });
      }
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
        message: `An error occurred when deleting a like to card: ${cardId}`,
      });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
