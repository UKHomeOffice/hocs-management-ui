const winston = require('winston');
const { MESSAGE } = require('triple-beam');
const jsonStringify = require('safe-stable-stringify');
const { isProduction } = require('../config');

const loggingTransports = [];
const exceptionTransports = [];

const colors = {
    info: 'green',
    email: 'magenta',
    warn: 'yellow',
    error: 'red'
};

const customLogstash = winston.format((info) => {
    let logstash = info || {};

    if (info.message && info.message instanceof Object) {
        logstash = Object.assign(info.message);
        logstash['level'] = info.level;
    }

    if (info.timestamp) {
        logstash['@timestamp'] = info.timestamp;
    }

    info[MESSAGE] = jsonStringify(logstash);
    return info;
});

const customDeveloperFormat = winston.format((info) => {
    let logstash = {};

    if (info.message) {
        if (info.message instanceof Object) {
            logstash = Object.assign(info.message);
        } else {
            logstash['message'] = info.message;
        }
    }

    if (info.stack) {
        logstash['stack'] = info.stack;
    }

    info[MESSAGE] = `${info.timestamp} - ${info.level}: ${jsonStringify(logstash)}`;
    return info;
});


const productionFormat = {
    format: winston.format.combine(
        winston.format.timestamp(),
        customLogstash()
    )
};

const devFormat = {
    format: winston.format.combine(
        winston.format.colorize({ colors:  colors }),
        winston.format.timestamp(),
        customDeveloperFormat()
    )
};

loggingTransports.push(
    new (winston.transports.Console)({
        ...(isProduction ? productionFormat : devFormat)
    })
);

exceptionTransports.push(
    new (winston.transports.Console)({
        ...(isProduction ? productionFormat : devFormat)
    })
);

const logger = winston.createLogger({
    level: isProduction ? 'info' : 'debug',
    transports: loggingTransports,
    exceptionHandlers: exceptionTransports,
    exitOnError: true,
});

logger.info(`Logger mode: ${isProduction ? 'production' : 'development'}`);

module.exports = (requestId) => {
    const correlationId = requestId ? { 'X-Correlation-Id': requestId } : null;
    return {
        info: (event, options) => logger.info(Object.assign({ event_id: event }, options, correlationId)),
        warn: (event, options) => logger.warn(Object.assign({ event_id: event }, options, correlationId)),
        debug: (event, options) => logger.debug(Object.assign({ event_id: event }, options, correlationId)),
        error: (event, options) => logger.error(Object.assign({ event_id: event }, options, correlationId)),
    };
};
