import {
    getTeams, getTeamMembers, returnTeamMembersJson, returnTeamsJson, addTeam, patchTeam
} from '../team';
import { infoService } from '../../clients/index';

jest.mock('../../clients/index');
jest.mock('../../libs/logger');
jest.mock('../../models/user');

const User = require('../../models/user');
const getLogger = require('../../libs/logger');
const logError = jest.fn();
getLogger.mockImplementation(() => ({ error: logError }));

describe('getTeams', () => {

    let req = {};
    let res = {};
    const next = jest.fn();
    const teams = ['team1', 'team2', 'team3'];
    const fetch = jest.fn(() => teams);

    beforeEach(() => {
        next.mockReset();
        req = { listService: { fetch: fetch } };
        res = { locals: {} };
    });

    it('should put the teams object in response locals', async () => {
        await getTeams(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res.locals.teams).toBeDefined();
        expect(res.locals.teams).toEqual(teams);
    });
});

describe('getTeamsForUser', () => {

    let req = {};
    let res = {};
    const next = jest.fn();
    const teams = [
        {
            label: 'team1',
            value: 'teamId1'
        }, {
            label: 'team2',
            value: 'teamId2'
        }, {
            label: 'team3',
            value: 'teamId3'
        }
    ];
    const fetch = jest.fn(() => teams);

    beforeEach(() => {
        next.mockReset();
        req = { listService: { fetch: fetch } };
        res = { locals: {} };
    });

    it('should put the teams object in response locals', async () => {
        await getTeamMembers(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res.locals.teamMembers).toBeDefined();
        expect(res.locals.teamMembers).toEqual(teams);
    });
});

describe('getTeamMembers', () => {

    let req = {};
    let res = {};
    const next = jest.fn();
    const teamMembers = ['teamMember1', 'teamMember2', 'teamMember3'];
    const fetch = jest.fn(() => teamMembers);

    beforeEach(() => {
        next.mockReset();
        req = { listService: { fetch: fetch } };
        res = { locals: {} };
    });

    it('should put the teams object in response locals', async () => {
        await getTeamMembers(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res.locals.teamMembers).toBeDefined();
        expect(res.locals.teamMembers).toEqual(teamMembers);
    });
});

describe('returnTeamsJson', () => {
    const req = {};
    let res = {};
    const next = jest.fn();
    const json = jest.fn();
    const teams = ['team1', 'team2', 'team3'];

    beforeEach(() => {
        next.mockReset();
        res = { json, locals: { teams } };
    });

    it('should return the teams as json', async () => {
        await returnTeamsJson(req, res, next);
        expect(json).toHaveBeenCalledWith(teams);
    });

    it('should be the last handler', async () => {
        await returnTeamsJson(req, res, next);
        expect(next).not.toHaveBeenCalled();
    });
});

describe('returnTeamMembersJson', () => {
    const req = {};
    let res = {};
    const next = jest.fn();
    const json = jest.fn();
    const teamMembers = ['teamMember1', 'teamMember2', 'teamMember3'];

    beforeEach(() => {
        next.mockReset();
        res = { json, locals: { teamMembers } };
    });

    it('should return the teams as json', async () => {
        await returnTeamMembersJson(req, res, next);
        expect(json).toHaveBeenCalledWith(teamMembers);
    });

    it('should be the last handler', async () => {
        await returnTeamMembersJson(req, res, next);
        expect(next).not.toHaveBeenCalled();
    });
});

describe('addTeam', () => {
    const mockFlush = jest.fn();
    const req = {
        params: { unitUUID: '__someUnitUUID__' },
        body: '__someAddTeamRequest__',
        listService: { flush: mockFlush }
    };
    let res = { sendStatus: jest.fn() };
    const next = jest.fn();
    const headers = '__headers__';

    it('should successfully perform post with data', async () => {
        User.createHeaders.mockImplementation(() => headers);
        await addTeam(req, res, next);

        expect(infoService.post).toHaveBeenCalledWith(
            '/unit/__someUnitUUID__/teams',
            '__someAddTeamRequest__',
            { headers: headers }
        );
        expect(res.sendStatus).toHaveBeenCalledWith(200);
        expect(req.listService.flush).toHaveBeenCalledWith('TEAMS');
    });

    it('should catch and log error if post request fails', async () => {
        infoService.post.mockImplementation(() => Promise.reject());
        await addTeam(req, res, next);
        expect(logError).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });
});


describe('patchTeam', () => {
    const mockFlush = jest.fn();
    const req = {
        params: { teamId: '__someTeamUUID__' },
        body: '__someUpdateTeamNameRequest__',
        listService: { flush: mockFlush }
    };
    let res = { sendStatus: jest.fn() };
    const next = jest.fn();
    const headers = '__headers__';

    it('should successfully perform put with data', async () => {
        User.createHeaders.mockImplementation(() => headers);
        await patchTeam(req, res, next);

        expect(infoService.patch).toHaveBeenCalledWith(
            '/team/__someTeamUUID__',
            '__someUpdateTeamNameRequest__',
            { headers: headers }
        );
        expect(req.listService.flush).toHaveBeenCalledWith('TEAMS');
        expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it('should catch and log error if put request fails', async () => {
        infoService.patch.mockImplementation(() => Promise.reject());
        await patchTeam(req, res, next);
        expect(logError).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });
});
