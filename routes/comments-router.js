const commentRouter = require('express').Router();
const { deleteComment } = require('../controller/controllers');

commentRouter
.route('/:comment_id')
.delete(deleteComment);

module.exports = commentRouter;