const { 
    fetchAllCategories, 
    fetchAllReviews, 
    fetchReviewById, 
    fetchCommentByReviewId } = require('../model/models');

const getCategories = (request, response) =>
{
    fetchAllCategories()
    .then((categories) =>
    {
        response.status(200).send({'categories': categories});
    });
}

const getReviews = (request, response) =>
{
    fetchAllReviews()
    .then((reviews) =>
    {
        response.status(200).send({'reviews': reviews});
    });
}

const getReviewsById = (request, response, next) =>
{
    const reviewId = request.params.review_id;

    fetchReviewById(reviewId)
    .then((review) =>
    {
        response.status(200).send({'review': review});
    })
    .catch((error) =>
    {
        next(error);
    })
}

const getCommentsByReviewId = (request, response, next) =>
{
    const reviewId = request.params.review_id;

    fetchCommentByReviewId(reviewId)
    .then((comments) =>
    {
        response.status(200).send({'comments': comments});
    })
    .catch((error) =>
    {
        next(error);
    })
}

module.exports = { 
    getCategories, 
    getReviews, 
    getReviewsById, 
    getCommentsByReviewId };