const { caseworkService } = require('../clients/index');
const getLogger = require('../libs/logger');
const User = require('../models/user');
const encodeCaseReference = require('../libs/encodingHelpers');

async function withdrawCase(req, res, next) {
    const logger = getLogger(req.request);

    try {
        const encodedReference = encodeCaseReference(req.body.caseReference.toUpperCase());
        const requestHeaders = User.createHeaders(req.user);
        const caseData = await caseworkService.get(`/case/data/${encodedReference}`, { headers: requestHeaders });
        if (caseData.data.stages && caseData.data.stages.length > 0) {
            const caseUuid = caseData.data.uuid;
            const activeStageUuid = caseData.data.stages[0].uuid;
            await caseworkService.post(`/case/${caseUuid}/stage/${activeStageUuid}/withdraw`, req.body, { headers: requestHeaders });
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        logger.error(error);
        next(error);
    }
}

module.exports = {
    withdrawCase,
};
