const express = require('express');

const { getCategories, getReviews, getReviewsById } = require('../controller/controllers');

const { handleCustomErrors, handlePsqlErrors, handleServerErrors, handlePathNotFoundErrors } = require('../errors/index');

const app = express();

app.get('/api/categories', getCategories);

app.get('/api/reviews', getReviews);

app.get('/api/reviews/:review_id', getReviewsById);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

app.use(handlePathNotFoundErrors);

module.exports = app;