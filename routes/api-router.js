const apiRouter = require('express').Router();
const getEndPoints = require('../controller/controllers');

const categoryRouter = require('./category-router');
const reviewRouter = require('./reviews-router');
const commentRouter = require('./comments-router');
const userRouter = require('./users-router');

apiRouter
.route('/')
.get(getEndPoints.getEndPoints);

apiRouter
.use('/categories', categoryRouter);

apiRouter
.use('/reviews', reviewRouter);

apiRouter
.use('/comments', commentRouter);

apiRouter
.use('/users', userRouter);

module.exports = apiRouter;