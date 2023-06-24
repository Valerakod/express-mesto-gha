const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .orFail()
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(400).send({ message: 'No cards found' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch(() =>
      res.status(400).send({
        message: `An error occurred when creating a new card for user ${owner}`,
      })
    );
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail()
    .then((card) => {
      const owner = card.owner.toString();

      if (req.user._id === owner) {
        Card.deleteOne(card)
          .orFail()
          .then(() => res.status(200).send(card))
          .catch(() =>
            res.status(400).send({
              message: `An error occurred when deleting card ${cardId}`,
            })
          );
      }
      res.status(403).send({
        message: `An error occurred deleting card: ${cardId}. It is not owned by ${req.user._id}`,
      });
    })
    .catch(() =>
      res.status(404).send({ message: `Card with id ${cardId} not found` })
    );
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true, upsert: true }
  )
    .orFail()
    .then((card) => res.status(200).send({ card }))
    .catch(() =>
      res.status(400).send({
        message: `An error occurred when adding a like to card: ${cardId}`,
      })
    );
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true, upsert: true }
  )
    .orFail()
    .then((card) => res.status(200).send({ card }))
    .catch(() =>
      res.status(400).send({
        message: `An error occurred when deleting a like to card: ${cardId}`,
      })
    );
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
