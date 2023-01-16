const express = require('express');

const getCategories = require('../controller/controllers');

const app = express();

app.get('/api/categories', getCategories);

module.exports = app;