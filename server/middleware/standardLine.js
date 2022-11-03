const User = require('../models/user');
const { infoService } = require('../clients/index');

async function addStandardLine(req, res, next) {
    try {
        const document = req.files[0];
        const request = {
            s3UntrustedUrl: document.key,
            displayName: document.originalname,
            topicUUID: req.body.topic,
            expires: req.body.expiryDate
        };

        const options = {
            headers: User.createHeaders(req.user)
        };
        await infoService.post('/standardLine', request, options);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}

async function updateStandardLine(req, res, next) {
    try {
        const standardLineUuid = req.body.uuid;
        const request = {
            expires: req.body.expiryDate
        };

        const options = {
            headers: User.createHeaders(req.user)
        };
        await infoService.put(`/standardLine/${standardLineUuid}`, request, options);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}

async function getAllStandardLines(req, res, next) {
    const topicList = await req.listService.fetch('TOPICS', req.params);
    const policyTeamForTopicList = await req.listService.fetch('DCU_POLICY_TEAM_FOR_TOPIC', req.params);

    try {
        const response = await infoService.get('/standardLine/all', {}, { headers: User.createHeaders(req.user) });
        res.locals.standardLines = response.data.map(({ uuid, displayName, topicUUID, expires, documentUUID }) => {
            const expiry = formatDate(expires);
            return ({
                uuid: uuid,
                documentUUID: documentUUID,
                displayName: displayName,
                topic: getLabelForValue(topicList, topicUUID),
                expiryDate: expiry,
                isExpired: deriveIsExpired(expiry),
                team: getLabelForValue(policyTeamForTopicList, topicUUID)
            });
        });
        next();
    } catch (error) {
        next(error);
    }
}

async function getStandardLine(req, res, next) {
    const topicList = await req.listService.fetch('TOPICS', req.params);
    const { standardLineUuid } = req.params;
    try {
        const response = await infoService.get(`/standardLine/${standardLineUuid}`, {}, { headers: User.createHeaders(req.user) });
        const expiry = formatDate(response.data.expires);
        res.locals.standardLine = {
            uuid: response.data.uuid,
            documentUUID: response.data.documentUUID,
            displayName: response.data.displayName,
            topic: getLabelForValue(topicList, response.data.topicUUID),
            expiryDate: expiry,
            isExpired: deriveIsExpired(expiry)
        };
        next();
    } catch (error) {
        next(error);
    }
}

function deriveIsExpired(expiry) {
    if (expiry) {
        const splitDate = expiry.split('/');
        const expiryDate = new Date(parseInt(splitDate[2], 10), parseInt(splitDate[1], 10) - 1, parseInt(splitDate[0], 10));

        return new Date(expiryDate) <= new Date();
    }

    return false;
}


function getLabelForValue(list, value) {
    if (list && value) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].value === value) {
                return list[i].label;
            }
        }
    }

    return value;
}

const parseDate = (rawDate) => {
    const [ date ] = rawDate.match(/\d{4}-(?:0[1-9]|1[012])-(?:0[1-9]|[12][0-9]|3[01])/g) || [];
    if (!date) {
        return null;
    }
    const [ year, month, day ] = date.split('-');
    return `${day}/${month}/${year}`;
};
const formatDate = (date) => date ? parseDate(date) : null;

async function returnAllStandardLinesJson(_, res) {
    const { locals: { standardLines } } = res;
    await res.json(standardLines);
}

async function returnStandardLineJson(_, res) {
    const { locals: { standardLine } } = res;
    await res.json(standardLine);
}

async function expireStandardLine(req, res, next) {
    const { standardLineUuid } = req.params;

    try {
        await infoService.put(`/standardLine/expire/${standardLineUuid}`, {
            ...req.body,
            data: {}
        }, { headers: User.createHeaders(req.user) });
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}

async function deleteStandardLine(req, res, next) {
    try {
        const { standardLineUuid } = req.params;
        await infoService.delete(`/standardLine/delete/${standardLineUuid}`, { headers: User.createHeaders(req.user) });
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    addStandardLine, getAllStandardLines, returnAllStandardLinesJson,
    expireStandardLine, deleteStandardLine, getStandardLine, returnStandardLineJson,
    updateStandardLine
};
