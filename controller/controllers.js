const { 
    fetchAllCategories,
    fetchAllReviews,
    fetchReviewById,
    fetchCommentByReviewId,
    addComment, 
    validateReviewId,
    updateVotesById,
    fetchAllUsers,
    validateCategory,
    removeCommentById,
    fetchEndPoints,
    fetchUserByName,
    updateVoteByCommentId
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
        Promise.all([validateCategory(query.category),fetchAllReviews(query)])
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

    Promise.all([validateReviewId(reviewId),fetchReviewById(reviewId)])
    .then((review) =>
    {
        response.status(200).send({'review': review[1]});
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
    
    Promise.all([validateReviewId(reviewId), addComment(reviewId, body)])
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

const deleteComment = (request, response, next) =>
{
    const commentId = request.params.comment_id;

    removeCommentById(commentId)
    .then(() =>
    {
        response.status(204).send();
    })
    .catch((error) =>
    {
        next(error);
    });
}

const getEndPoints = (request, response, next) =>
{
    fetchEndPoints()
    .then((api) =>
    {
        response.status(200).send({api});
    })
    .catch((error) =>
    {
        next(error);
    });
}

const getUserByName = (request, response, next) =>
{
    const userName = request.params.username;

    fetchUserByName(userName)
    .then((user) =>
    {
        response.status(200).send({'user': user});
    })
    .catch((error) => 
    {
        next(error);
    });
}

const patchComment = (request, response, next) =>
{
    const commentId = request.params.comment_id;
    const { body } = request;

    updateVoteByCommentId(commentId, body)
    .then((comment) =>
    {
        response.status(200).send({'comment': comment})
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
    getUsers,
    deleteComment,
    getEndPoints,
    getUserByName,
    patchComment
    };