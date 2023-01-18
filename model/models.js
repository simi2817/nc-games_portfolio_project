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

const fetchAllReviews = (query) =>
{
    const queryValues = [];
    let where = '';
    let sort = '';
    let order = '';

    if(query.category)
    {
        where = ` WHERE reviews.category = $1 `;
        queryValues.push(query.category);
    }
     
    if(query.sort_by)
        sort = `reviews.${query.sort_by}`;
    else
        sort = `DATE(reviews.created_at)`;

    if(query.order)
    {
        if(query.order === 'asc' || query.order === 'desc')
            order = `${query.order}`;
        else
            return Promise.reject({status: 400, message: 'Invalid order query!'});
    }
    else
        order = `DESC`;

        const selectReviewQuery = 
        `SELECT reviews.*, COUNT(comments.review_id) AS comment_count
        FROM reviews
        JOIN comments
        ON reviews.review_id = comments.review_id
        ${where}
        GROUP BY reviews.review_id
        ORDER BY ${sort} ${order};`;

        return db.query(selectReviewQuery,queryValues)
        .then(({ rows })=>
        {   
                return rows;
        });
}

const fetchCategoryFromReviews = (category) =>
{
    const selectCategoryQuery = 
    `SELECT reviews.category
    FROM reviews
    JOIN comments
    ON reviews.review_id = comments.review_id
    WHERE reviews.category = $1;`;

    return db.query(selectCategoryQuery, [category])
    .then(({ rows, rowCount }) =>
    {
        if(rowCount === 0)
            return Promise.reject({status: 404, message: 'category not found!'});
        else
            return rows[0];
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

const addComment = (reviewId, body) =>
{
    if(JSON.stringify(body) === '{}')
        return Promise.reject({status: 400, message: 'request body is empty!'});
    else
    {
        if(body.hasOwnProperty('username') && body.hasOwnProperty('body'))
        {
            const author = body.username;
            const commentBody = body.body;
            
            const insertCommentQuery = 
            `INSERT INTO comments (body,review_id,author)
            VALUES ($1, $2, $3)
            RETURNING *;`;
                        
            return db.query(insertCommentQuery,[commentBody,reviewId,author])
            .then(({ rows }) =>
            {
                return rows;
            });
        }
        else
            return Promise.reject({status: 400, message: 'request body is missing keys of username & body!'});
    }
}
        
const fetchReviewsById = (reviewId) =>
{
    const selectReviewQuery = `SELECT review_id FROM reviews WHERE review_id = $1;`;

    return db.query(selectReviewQuery,[reviewId])
    .then(({ rowCount, rows }) =>
    {
        if(rowCount === 0)
        return Promise.reject({status: 404, message: 'review_id not found!'});
        else
            return rows[0];
    });
}

const updateVotesById = (reviewId, body) =>
{
    
    if(JSON.stringify(body) === '{}')
        return Promise.reject({status: 400, message: 'request body is empty!'});
    else
    {
        if(body.hasOwnProperty('inc_votes'))
        {
            const updateVotes = body.inc_votes;

            const updateVoteQuery = `
            UPDATE reviews
            SET votes = (votes + $1)
            WHERE review_id = $2
            RETURNING *;`;
            
            return db.query(updateVoteQuery,[updateVotes,reviewId])
            .then(({ rows, rowCount }) =>
            {
                if(rowCount === 0)
                    return Promise.reject({status: 404, message: 'review_id not found!'});
                else
                    return rows[0];
            });
        }
        else
            return Promise.reject({status: 400, message: 'request body must have inc_votes key!'});
    }
}

const fetchAllUsers = () =>
{
    const selectUsersQuery = `SELECT * FROM users;`;

    return db.query(selectUsersQuery)
    .then(({ rows }) =>
    {
        return rows;
    });
}

module.exports = { 
    fetchAllCategories,
    fetchAllReviews,
    fetchReviewById,
    fetchCommentByReviewId,
    addComment,
    fetchReviewsById,
    updateVotesById,
    fetchAllUsers,
    fetchCategoryFromReviews
    };