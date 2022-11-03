const User = require('../models/user');
const { infoService } = require('../clients/index');

async function addTemplate(req, res, next) {
    try {
        const document = req.files[0];
        const request = {
            s3UntrustedUrl: document.key,
            displayName: document.originalname,
            caseType: req.body.caseType,
        };

        const options = {
            headers: User.createHeaders(req.user)
        };
        await infoService.post('/template', request, options);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}


async function getTemplatesForCaseType(req, res, next) {
    try {
        const { type } = req.params;
        const response = await infoService.get(`/caseType/${type}/templates`, { headers: User.createHeaders(req.user) });
        res.json(response.data);
    } catch (error) {
        next(error);
    }
}

async function deleteTemplate(req, res, next) {
    try {
        const { uuid } = req.params;
        await infoService.delete(`/template/${uuid}`, { headers: User.createHeaders(req.user) });
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}


module.exports = {
    addTemplate,
    deleteTemplate,
    getTemplatesForCaseType
};
