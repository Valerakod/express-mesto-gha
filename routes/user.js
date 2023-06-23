const router = require("express").Router();
const express = require("express");

const { getAllUsers, getUserById, createNewUser, editUserInfo, editAvatar } = require("../controlles/users");

router.get("/users", getAllUsers);
router.get("/users/:userId", getUserById);
router.post("/users/:userId", createNewUser);
router.patch("/me", editUserInfo);
router.patch("/me/avatar", editAvatar);
router.use(express.json());
module.exports = router;
