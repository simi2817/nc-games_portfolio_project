const reviewRouter = require('express').Router();
const   {
            getReviews,
            getReviewsById,
            patchVotesById,
            getCommentsByReviewId,
            postComment,
            postReview
        } = require('../controller/controllers');

reviewRouter
.route('/')
.get(getReviews);

reviewRouter
.route('/:review_id')
.get(getReviewsById);

reviewRouter
.route('/:review_id')
.patch(patchVotesById);

reviewRouter
.route('/:review_id/comments')
.get(getCommentsByReviewId);

reviewRouter
.route('/:review_id/comments')
.post(postComment);

reviewRouter
.route('/')
.post(postReview);

module.exports = reviewRouter;