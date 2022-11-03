const { infoService } = require('../clients/index');
const User = require('../models/user');

async function getCaseType(req, res, next) {
    try {
        const { type } = req.params;
        const response = await infoService.get(`/caseType/type/${type}`, { headers: User.createHeaders(req.user) });
        res.json(response.data);
    } catch (error) {
        next(error);
    }
}

async function getCaseTypes(req, res, next) {
    try {
        const response = await infoService.get('/caseType', { headers: User.createHeaders(req.user) });
        res.locals.caseTypes = response.data;
        next();
    } catch (error) {
        next(error);
    }
}

async function returnCaseTypesJson(_, res) {
    const { locals: { caseTypes } } = res;
    await res.json(caseTypes);
}

module.exports = {
    getCaseType,
    getCaseTypes,
    returnCaseTypesJson,
};
