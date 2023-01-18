const express = require('express');

const { getCategories, getReviews, getReviewsById, postComment, getUsers } = require('../controller/controllers');

const { handleCustomErrors, handlePsqlErrors, handleServerErrors, handlePathNotFoundErrors } = require('../errors/index');

const app = express();

app.use(express.json());

app.get('/api/categories', getCategories);

app.get('/api/reviews', getReviews);

app.get('/api/reviews/:review_id', getReviewsById);

app.post('/api/reviews/:review_id/comments', postComment);





app.get('/api/users', getUsers);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

app.use(handlePathNotFoundErrors);

module.exports = app;