const Card = require('../models/card');
const getCards = (req, res, next) => {
  Card.find({})
    .orFail()
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send('No cards found'));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .orFail()
    .then((card) => res.status(201).send(card))
    .catch(() =>
      res
        .status(500)
        .send(`An error occurred when creating a new card for user ${owner}`)
    );
};

const deleteCard = (req, res, next) => {
  const cardId = req.params.cardId;
  Card.findById(cardId)
    .orFail()
    .then((card) => {
      const owner = card.owner.toString();

      if (req.user._id === owner) {
        Card.deleteOne(card)
          .orFail()
          .then(() => res.send(card))
          .catch(() =>
            res
              .status(500)
              .send(`An error occurred when deleting card ${cardId}`)
          );
      }
      res
        .status(403)
        .send(
          `An error occurred deleting card: ${cardId}. It is not owned by ${req.user._id}`
        );
    })
    .catch(() => res.status(404).send(`Card with id ${cardId} not found`));
};

const likeCard = (req, res, next) => {
  const cardId = req.params.cardId;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .orFail()
    .then((card) => res.status(200).send({ card }))
    .catch(() =>
      res
        .status(500)
        .send(`An error occurred when adding a like to card: ${cardId}`)
    );
};

const dislikeCard = (req, res, next) => {
  const cardId = req.params.cardId;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .orFail()
    .then((card) => res.status(200).send({ card }))
    .catch(() =>
      res
        .status(500)
        .send(`An error occurred when deleting a like to card: ${cardId}`)
    );
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
