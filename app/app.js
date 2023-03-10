const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const apiRouter = require('../routes/api-router');

const { 
        handleCustomErrors, 
        handlePsqlErrors, 
        handleServerErrors, 
        handlePathNotFoundErrors 
      } = require('../errors/index');

app.use('/api', apiRouter);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

app.use(handlePathNotFoundErrors);

module.exports = app;