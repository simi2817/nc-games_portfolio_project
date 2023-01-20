const userRouter = require('express').Router();
const { getUsers } = require('../controller/controllers');

userRouter
.route('/')
.get(getUsers);

module.exports = userRouter;