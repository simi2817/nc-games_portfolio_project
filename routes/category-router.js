const categoryRouter = require('express').Router();
const { getCategories } = require('../controller/controllers');

categoryRouter
.route('/')
.get(getCategories);

module.exports = categoryRouter;