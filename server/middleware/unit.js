const { infoService } = require('../clients/index');
const getLogger = require('../libs/logger');
const User = require('../models/user');

async function addUnit(req, res, next) {
    try {
        await infoService.post('/unit', req.body, { headers: User.createHeaders(req.user) });
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}

async function getUnits(req, res, next) {
    try {
        const response = await req.listService.fetch('UNITS', req.params);
        res.locals.units = response;
        next();
    } catch (error) {
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
