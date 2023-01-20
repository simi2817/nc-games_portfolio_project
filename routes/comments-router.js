const commentRouter = require('express').Router();
const { deleteComment, patchComment } = require('../controller/controllers');

commentRouter
.route('/:comment_id')
.delete(deleteComment);

commentRouter
.route('/:comment_id')
.patch(patchComment);

module.exports = commentRouter;