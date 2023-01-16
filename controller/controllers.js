const { fetchAllCategories, fetchAllReviews } = require('../model/models');

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

module.exports = { getCategories, getReviews };