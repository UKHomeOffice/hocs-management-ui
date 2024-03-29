const { infoService } = require('../clients/index');
const getLogger = require('../libs/logger');
const User = require('../models/user');
const { AuthenticationError } = require('../models/error');

async function getTeam(req, res, next) {

    const logger = getLogger(req.request);
    const { teamId } = req.params;

    try {
        const response = await infoService.get(`/team/${teamId}`, {}, { headers: User.createHeaders(req.user) });
        res.locals.team = response.data;
        next();
    } catch (error) {
        next(error);
    }
}

async function getUnitForTeam(req, res, next) {

    const logger = getLogger(req.request);
    const { teamId } = req.params;

    try {
        const response =
            await infoService.get(`/team/${teamId}/unit`, {}, { headers: User.createHeaders(req.user) });
        res.locals.unit = response.data;
        next();
    } catch (error) {
        next(error);
    }
}


async function getTeams(req, res, next) {
    try {
        const response = await req.listService.fetch('TEAMS', req.params);
        res.locals.teams = response;
        next();
    } catch (error) {
        next(error);
    }
}

async function getAllTeams(req, res, next) {
    try {
        const response = await req.listService.fetch('ALL_TEAMS', req.params);
        res.locals.teams = response;
        next();
    } catch (error) {
        next(error);
    }
}

async function getTeamMembers(req, res, next) {
    try {
        const response = await req.listService.fetch('USERS_IN_TEAM', req.params);
        res.locals.teamMembers = response;
        next();
    } catch (error) {
        next(error);
    }
}

async function getTeamsForUser(req, res, next) {
    try {
        const response = await req.listService.fetch('TEAMS_FOR_USER', req.params);
        res.locals.teams = response;
        next();
    } catch (error) {
        next(error);
    }
}

async function addTeam(req, res, next) {
    const logger = getLogger(req.request);
    const { unitUUID } = req.params;
    try {
        await infoService.post(
            `/unit/${unitUUID}/teams`,
            req.body,
            { headers: User.createHeaders(req.user) }
        );
        req.listService.flush('TEAMS');
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}

async function patchTeam(req, res, next) {
    const logger = getLogger(req.request);
    const { teamId } = req.params;

    // check the user has the correct permissions for their patch request
    if (req.body.displayName && !User.hasRole(req.user, 'RENAME_TEAM')) {
        next(new AuthenticationError('Unauthorised'));
        return;
    }

    if (req.body.unitUUID && !User.hasRole(req.user, 'REASSIGN_TEAM_UNIT')) {
        next(new AuthenticationError('Unauthorised'));
        return;
    }

    if (req.body.hasOwnProperty('active')) {
        if (req.body.active && !User.hasRole(req.user, 'ACTIVATE_TEAM')) {
            next(new AuthenticationError('Unauthorised'));
            return;
        } else if (!req.body.active && !User.hasRole(req.user, 'DEACTIVATE_TEAM')) {
            next(new AuthenticationError('Unauthorised'));
            return;
        }
    }

    try {
        await infoService.patch(
            `/team/${teamId}`,
            req.body,
            { headers: User.createHeaders(req.user) }
        );
        req.listService.flush('TEAMS');
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}

async function returnTeamJson(_, res) {
    const { locals: { team } } = res;
    await res.json(team);
}

async function returnTeamsJson(_, res) {
    const { locals: { teams } } = res;
    await res.json(teams);
}

async function returnTeamMembersJson(_, res) {
    const { locals: { teamMembers } } = res;
    await res.json(teamMembers);
}

module.exports = {
    getTeam,
    getUnitForTeam,
    getTeams,
    getAllTeams,
    getTeamMembers,
    getTeamsForUser,
    returnTeamJson,
    returnTeamsJson,
    returnTeamMembersJson,
    addTeam,
    patchTeam
};
