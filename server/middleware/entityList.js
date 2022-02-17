const { infoService } = require('../clients/index');
const getLogger = require('../libs/logger');
const User = require('../models/user');

async function getEntityList(req, res, next) {

    const logger = getLogger(req.request);
    const { listName } = req.params;

    try {
        const response = await infoService.get(`/entity/list/${listName}`, {}, { headers: User.createHeaders(req.user) });
        res.locals.entityList = response.data.map(({ simpleName, uuid, data }) => ({ simpleName: simpleName, uuid: uuid, ...data }));
        next();
    } catch (error) {
        logger.error(error);
        next(error);
    }
}

async function returnEntityListJson(_, res) {
    const { locals: { entityList } } = res;
    await res.json(entityList);
}

async function addEntityListItem(req, res, next) {
    const logger = getLogger(req.request);
    const { listName } = req.params;

    try {
        await infoService.post(`/entity/list/${listName}`, { ...req.body, data: JSON.stringify({ title: req.body.title }) }, { headers: User.createHeaders(req.user) });
        res.sendStatus(200);
    } catch (error) {
        logger.error(error);
        next(error);
    }
}

async function getEntity(req, res, next) {

    const logger = getLogger(req.request);
    const { itemUUID } = req.params;

    try {
        const response = await infoService.get(`/entity/${itemUUID}`, {}, { headers: User.createHeaders(req.user) });
        res.locals.entity = { simpleName: response.data.simpleName, uuid: response.data.uuid, title: response.data.data.title };
        next();
    } catch (error) {
        logger.error(error);
        next(error);
    }
}

async function returnEntityJson(_, res) {
    const { locals: { entity } } = res;
    await res.json(entity);
}

async function updateEntityListItem(req, res, next) {
    const logger = getLogger(req.request);
    const { listName } = req.params;

    try {
        await infoService.put(`/entity/list/${listName}`, { ...req.body, data: JSON.stringify({ title: req.body.title }) }, { headers: User.createHeaders(req.user) });
        res.sendStatus(200);
    } catch (error) {
        logger.error(error);
        next(error);
    }
}

async function deleteEntityListItem(req, res, next) {
    const logger = getLogger(req.request);
    const { listName } = req.params;
    try {
        await infoService.delete(`/entity/list/${listName}`, { ...req.body, data: req.body.entityUUID }, { headers: User.createHeaders(req.user) });
        res.sendStatus(200);
    } catch (error) {
        logger.error(error);
        next(error);
    }
}

module.exports = {
    getEntityList,
    returnEntityListJson,
    addEntityListItem,
    getEntity,
    returnEntityJson,
    updateEntityListItem,
    deleteEntityListItem
};
