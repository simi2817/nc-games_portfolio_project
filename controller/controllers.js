const { 
    fetchAllCategories, 
    fetchAllReviews, 
    fetchReviewById, 
    addComment, 
    fetchReviewsById,
    fetchAllUsers } = require('../model/models');

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

const postComment = (request, response, next) =>
{
    const { body } = request;
    const reviewId = request.params.review_id;
    
    Promise.all([fetchReviewsById(reviewId), addComment(reviewId, body)])
    .then((newComment) =>
    {   
        response.status(201).send({'comment': newComment[1]});
    })
    .catch((error) =>
    {
        next(error);
    })
}

const getUsers = (request, response, next) =>
{
    fetchAllUsers()
    .then((users) =>
    {
        response.status(200).send({'users': users});
    })
    .catch((error) =>
    {
        next(error);
    });
}

module.exports = { 
    getCategories, 
    getReviews, 
    getReviewsById, 
    postComment, 
    getUsers };