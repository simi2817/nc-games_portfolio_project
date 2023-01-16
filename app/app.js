const express = require('express');

const { getCategories, getReviews, getReviewsById } = require('../controller/controllers');

const app = express();

app.get('/api/categories', getCategories);

app.get('/api/reviews', getReviews);

app.get('/api/reviews/:review_id', getReviewsById);

app.use((error, request, response, next) =>
{
    if(error.code === '22P02')
        response.status(400).send({message: 'Bad request!'});
    else
        next(error);
});

app.use((error, request, response, next) =>
{
    if(error.status)
        response.status(error.status).send({message: error.message});
    else
        next(error);
})


app.use((error, request, response, next) =>
{
        console.error(error);
        response.status(500).send({message: 'Internal Server Error'});
})

module.exports = app;