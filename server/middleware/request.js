const { v4: uuid } = require('uuid');
const logger = require('../libs/logger');
const { ValidationError, GenericError } = require('../models/error');
const { isProduction } = require('../config');
const listService = require('../services/list/');
const { AxiosError } = require('axios');

function axiosErrorMiddleware(err, _req, _res, next) {
    if (err instanceof AxiosError) {
        if (err.response) {
            return next(new GenericError(err.response.data, err.response.status));
        } else if (err.request) {
            return next(new GenericError(`Failed to request following endpoint ${err.config.url} for reason ${err.code}`, 500));
        }
        return next(new GenericError(`Axios failed to process the request for reason ${err.code}`, 500));
    }
    return next(err);
}

// eslint-disable-next-line no-unused-vars
function apiErrorMiddleware(err, req, res, _) {

    if (err instanceof ValidationError) {
        logger(req.requestId).info('VALIDATION_FAILED', { errors: Object.keys(err.fields) });
        return res.status(err.status).json({ errors: err.fields });
    } else {
        logger(req.requestId).error('ERROR', { message: err.message, stack: err.stack });
        const status = err.status || (err.response && err.response.status) || 500;
        return res.status(status).json({
            message: err.message,
            status: status,
            stack: isProduction ? null : err.stack,
            title: err.title,
            body: err.response ? err.response.data : undefined
        });
    }
}

function errorMiddleware(err, req, res, next) {
    if (err instanceof ValidationError) {
        logger(req.requestId).info('VALIDATION_FAILED', { errors: Object.keys(err.fields) });
        res.status(err.status || 500);
        req.form.errors = err.fields;
    } else {
        logger(req.requestId).error('ERROR', { message: err.message, stack: err.stack });
        res.locals.error = {
            message: err.message,
            status: err.status || 500,
            stack: isProduction ? null : err.stack,
            title: err.title
        };
    }
    next();
}

function initRequest(req, res, next) {
    const requestId = uuid();
    res.locals = {};
    req.requestId = requestId;
    req.listService = listService.getInstance(requestId, req.user);
    logger(requestId).info('REQUEST_RECEIVED', { method: req.method, endpoint: req.originalUrl });
    next();
}

module.exports = {
    axiosErrorMiddleware,
    apiErrorMiddleware,
    errorMiddleware,
    initRequest
};
