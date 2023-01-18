const { 
    fetchAllCategories,
    fetchAllReviews,
    fetchReviewById,
    fetchCommentByReviewId,
    addComment, 
    fetchReviewsById,
    updateVotesById,
    fetchAllUsers,
    fetchCategoryFromReviews
    } = require('../model/models');

const getCategories = (request, response) =>
{
    fetchAllCategories()
    .then((categories) =>
    {
        response.status(200).send({'categories': categories});
    });
}

const getReviews = (request, response, next) =>
{
    const { query } = request;

    if(query.category !== undefined)
    {
        Promise.all([fetchCategoryFromReviews(query.category), fetchAllReviews(query)])
        .then((reviews) =>
        {
            response.status(200).send({'reviews': reviews[1]});
        })
        .catch((error) =>
        {
            next(error);
        });
    }
    else
    {
        fetchAllReviews(query)
        .then((reviews) =>
        {
            response.status(200).send({'reviews': reviews});
        })
        .catch((error) =>
        {
            next(error);
        });
    }
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

const patchVotesById = (request, response, next) =>
{
    const reviewId = request.params.review_id;
    const { body } = request;

    updateVotesById(reviewId, body)
    .then((updatedReview) => 
    {
        response.status(200).send({'review': updatedReview});
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
    getCommentsByReviewId,
    postComment,
    patchVotesById,
    getUsers
    };