const fetchAllCategories = require('../model/models');

const getCategories = (request, response) =>
{
    fetchAllCategories()
    .then((categories) =>
    {
        response.status(200).send({'categories': categories});
    });
}

module.exports = getCategories;