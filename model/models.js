const db = require('../db/connection');

const fetchAllCategories = () =>
{
    const selectCategoryQuery = `SELECT * FROM categories;`;

    return db.query(selectCategoryQuery)
    .then(({ rows })=>
    {
            return rows;
    });
}

const fetchAllReviews = () =>
{
    const selectReviewQuery = 
    `SELECT reviews.*, COUNT(comments.review_id) AS comment_count
    FROM reviews
    JOIN comments
    ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY DATE(reviews.created_at) DESC;`;

    return db.query(selectReviewQuery)
    .then(({ rows })=>
    {
            return rows;
    });
}

const fetchReviewById = (reviewId) =>
{
    if(/\d+/.test(reviewId))
    {
        const selectReviewByIdQuery = 
        `SELECT * FROM reviews
        WHERE review_id = $1;`;

        return db.query(selectReviewByIdQuery, [reviewId])
        .then(({ rows }) => 
        {
            if(rows.length === 1)
                return rows;
            else
                return Promise.reject({status: 404, message: 'review_id not found!'});
        });
    } 

    else
        return Promise.reject({status: 400, message: 'Invalid input!'});
    
}

const fetchCommentByReviewId = (reviewId) =>
{
    const selectCommentByReviewId = 
    `SELECT * FROM comments
    WHERE review_id = $1
    ORDER BY created_at DESC;`;

    return db.query(`SELECT review_id FROM reviews WHERE review_id = $1;`,[reviewId])
    .then(({ rowCount }) =>
    {
        if(rowCount === 0)
            return Promise.reject({status: 404, message: 'review_id not found!'});
        else
        {
            return db.query(selectCommentByReviewId, [reviewId])
            .then(({ rows, rowCount }) =>
            {
                return rows;
            });
        }
    })
}

module.exports = { 
    fetchAllCategories, 
    fetchAllReviews, 
    fetchReviewById,
    fetchCommentByReviewId };