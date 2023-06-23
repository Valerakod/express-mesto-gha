const Card = require('../models/card');
const someErrorCard = {
  "message": "Карточка не найдена"
};
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner }).then((card) => res.status(201).send(card));
  .catch((err) => if (err.name === someErrorCard) { return res.status(400)})
  .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      const owner = card.owner.toString();
      if (req.user._id === owner) {
        Card.deleteOne(card)
          .then(() => {
            res.send(card);
          })

    })
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => res.send({ card }))
    .catch((err) => {
      console.error(err);
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.send({ card }))
    .catch((err) => {
      console.error(err);
    })
    .catch(next);
};


module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
};

module.exports.createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен
};
