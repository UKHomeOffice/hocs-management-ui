const { infoService } = require('../clients/index');
const User = require('../models/user');

async function addNominatedContact(req, res, next) {
    const data = {
        'email_address': req.body.emailAddress
    };

    try {
        const response = await infoService.post(`/team/${req.body.teamUUID}/contact`, data, { headers: User.createHeaders(req.user) });
        res.json({ uuid: response.data.uuid });
    } catch (error) {
        next(error);
    }
}

async function getNominatedContactsForTeam(req, res, next) {

    try {
        const response = await req.listService.fetch('CONTACTS_FOR_TEAM', req.params);

        res.locals.nominatedContacts = response;
        next();
    } catch (error) {
        next(error);
    }
}

async function removeNominatedContactFromTeam(req, res, next) {
    try {
        const { teamUUID, nominatedContactUUID } = req.params;
        await infoService.delete(`/team/${teamUUID}/contact/${nominatedContactUUID}`, { headers: User.createHeaders(req.user) });

        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}

async function returnNominatedContactsJson(_, res) {
    const { locals: { nominatedContacts } } = res;
    await res.json(nominatedContacts);
}


module.exports = {
    addNominatedContact,
    getNominatedContactsForTeam,
    removeNominatedContactFromTeam,
    returnNominatedContactsJson
};
