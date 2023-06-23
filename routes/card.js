const router = require('express').Router();
const express = require("express");
const { getCards, createCard, deleteCard, likeCard, dislikeCard } = require("../controllers/card");
router.use(express.json());
router.get("/cards", getCards);
router.post("/cards", createCard);
router.delete("/cards/:cardId", deleteCard);
router.put("/cards/:cardId/likes", likeCard);
router.delete("/cards/:cardId/likes", dislikeCard);

module.exports = router;