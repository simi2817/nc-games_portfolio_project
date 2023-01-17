
const handleCustomErrors = (error, request, response, next) =>
{
    if(error.status && error.message)
        response.status(error.status).send({message: error.message});
    else
        next(error);
}

const handlePsqlErrors = (error, request, response, next) =>
{
    if(error.code === '22P02')
        response.status(400).send({message: 'Invalid input!'});
    else
        next(error);
}

const handleServerErrors = (error, request, response, next) =>
{
    console.error(error);
    response.status(500).send({message: 'Internal Server Error'});
}

const handlePathNotFoundErrors = (request, response, next) =>
{
    response.status(404).send({message: 'Path Not Found'});
}

module.exports = { handleCustomErrors, handlePsqlErrors, handleServerErrors, handlePathNotFoundErrors };