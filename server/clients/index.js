const { createClient } = require('../libs/request');

const {
    INFO_SERVICE,
    CASEWORK_SERVICE,
    DOCUMENT_SERVICE
} = require('../config').forContext('server');

const infoService = createClient({
    baseURL: INFO_SERVICE
});

const caseworkService = createClient({
    baseURL: CASEWORK_SERVICE
});

const documentService = createClient({
    baseURL: DOCUMENT_SERVICE
});

module.exports = {
    infoService,
    caseworkService,
    documentService
};
