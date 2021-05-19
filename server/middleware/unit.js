const { infoService } = require('../clients/index');
const getLogger = require('../libs/logger');
const User = require('../models/user');

async function addUnit(req, res, next) {
    const logger = getLogger(req.request);

    try {
        await infoService.post('/unit', req.body, { headers: User.createHeaders(req.user) });
        res.sendStatus(200);
    } catch (error) {
        logger.error(error);
        next(error);
    }
}

async function getUnits(req, res, next) {
    const logger = getLogger(req.request);
    try {
        const response = await req.listService.fetch('UNITS', req.params);
        res.locals.units = response;
        next();
    } catch (error) {
        logger.error(error);
        next(error);
    }
}

async function returnUnitAsJson(_, res) {
    const { locals: { unit } } = res;
    await res.json(unit);
}

async function returnUnitsAsJson(_, res) {
    const { locals: { units } } = res;
    await res.json(units);
}

module.exports = {
    addUnit,
    getUnits,
    returnUnitAsJson,
    returnUnitsAsJson
};