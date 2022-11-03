const { infoService } = require('../clients/index');
const User = require('../models/user');
const { FormSubmissionError } = require('../models/error');

async function addUsersToTeam(req, _, next) {
    const { teamId } = req.params;

    try {
        await infoService.post(`/users/team/${teamId}`, req.body, { headers: User.createHeaders(req.user) });
        next();
    } catch (error) {
        next(error);
    }
}

async function getAllUsers(req, res, next) {
    try {
        const response = await req.listService.fetch('USERS', req.params);
        res.locals.users = response;
        next();
    } catch (error) {
        next(error);
    }
}

async function getUser(req, res, next) {
    try {
        const config = { headers: User.createHeaders(req.user) };
        const userId = req.params.userId;
        const result = await infoService.get(`/user/${userId}`, config);
        res.locals.user = result.data;
        next();
    } catch (error) {
        next(error);
    }
}

async function addUser(req, res, next) {
    try {
        const body = {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        };
        const config = { headers: User.createHeaders(req.user) };
        const response = await infoService.post('/user', body, config);
        res.send({ userUUID: response.data.userUUID });
    } catch (error) {
        next(new FormSubmissionError(error.response.data, error.response.status));
    }
}

async function amendUser(req, res, next) {
    try {
        const body = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            enabled: req.body.enabled
        };
        const config = { headers: User.createHeaders(req.user) };
        await infoService.put(`/user/${req.params.userId}`, body, config);
        res.sendStatus(200);
    } catch (error) {
        next(new FormSubmissionError(error.response.data, error.response.status));
    }
}

async function removeFromTeam(req, _, next) {
    try {
        const { userId, teamId } = req.params;

        await infoService.delete(`/users/${userId}/team/${teamId}`, { headers: User.createHeaders(req.user) });
        next();
    } catch (error) {
        next(error);
    }
}

async function returnUsersJson(_, res) {
    const { locals: { users } } = res;
    await res.json(users);
}

async function returnUserJson(_, res) {
    const { locals: { user } } = res;
    await res.json(user);
}

module.exports = {
    addToTeam: addUsersToTeam,
    getAllUsers,
    getUser,
    addUser,
    amendUser,
    removeFromTeam,
    returnUsersJson,
    returnUserJson
};
