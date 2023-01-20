const userRouter = require('express').Router();
const { getUsers, getUserByName } = require('../controller/controllers');

userRouter
.route('/')
.get(getUsers);

userRouter
.route('/:username')
.get(getUserByName);

module.exports = userRouter;