const router = require("express").Router();
const express = require("express");

const { getAllUsers, getUserById, createNewUser, editUserInfo, editAvatar } = require("../controllers/user");
router.use(express.json());
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserById);
router.post("/users", createNewUser);
router.patch("/users/me", editUserInfo);
router.patch("/users/me/avatar", editAvatar);

module.exports = router;
