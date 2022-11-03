import { addTeam, getTeamMembers, getTeams, patchTeam, returnTeamMembersJson, returnTeamsJson } from '../team';
import { infoService } from '../../clients/index';

jest.mock('../../clients/index');
jest.mock('../../models/user');

const User = require('../../models/user');

describe('getTeams', () => {

    let req = {};
    let res = {};
    const next = jest.fn();
    const teams = [ 'team1', 'team2', 'team3' ];
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
    const teamMembers = [ 'teamMember1', 'teamMember2', 'teamMember3' ];
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
    const teams = [ 'team1', 'team2', 'team3' ];

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
    const teamMembers = [ 'teamMember1', 'teamMember2', 'teamMember3' ];

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

    it('should catch and throw error if post request fails', async () => {
        infoService.post.mockImplementation(() => Promise.reject());
        await addTeam(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});


describe('patchTeam', () => {
    beforeEach(() => {
        infoService.patch.mockRestore();
        User.hasRole.mockRestore();
    });
    const mockFlush = jest.fn();
    const req = {
        params: { teamId: '__someTeamUUID__' },
        body: {
            displayName: '__newDisplayName__',
            unitUUID: '__newUnitUUID__',
            active: false
        },
        listService: { flush: mockFlush }
    };
    let res = { sendStatus: jest.fn() };
    const next = jest.fn();
    const headers = '__headers__';

    it('should successfully perform patch with data', async () => {
        User.createHeaders.mockImplementation(() => headers);
        User.hasRole.mockReturnValue(true);
        await patchTeam(req, res, next);

        expect(infoService.patch).toHaveBeenCalledWith(
            '/team/__someTeamUUID__',
            req.body,
            { headers: headers }
        );
        expect(req.listService.flush).toHaveBeenCalledWith('TEAMS');
        expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it('should not call patch if user tries to change the team name without the RENAME_TEAM role',
        async () => {
            User.createHeaders.mockImplementation(() => headers);
            User.hasRole.mockImplementation((_, role) => {
                if (role === 'RENAME_TEAM') {
                    return false;
                }
                return true;
            });
            await patchTeam(req, res, next);

            expect(infoService.patch).toHaveBeenCalledTimes(0);
            expect(next).toHaveBeenCalled();
        });

    it('should not call patch if user tries to reassign the team unit without the REASSIGN_TEAM_UNIT role',
        async () => {
            User.createHeaders.mockImplementation(() => headers);
            User.hasRole.mockImplementation((_, role) => {
                if (role === 'REASSIGN_TEAM_UNIT') {
                    return false;
                }
                return true;
            });
            await patchTeam(req, res, next);

            expect(infoService.patch).toHaveBeenCalledTimes(0);
            expect(next).toHaveBeenCalled();
        });

    it('should not call patch if user tries to reactivate team without ACTIVATE_TEAM role',
        async () => {
            User.createHeaders.mockImplementation(() => headers);
            User.hasRole.mockImplementation((_, role) => {
                if (role === 'ACTIVATE_TEAM') {
                    return false;
                }
                return true;
            });

            const reactiveRequest = { ...req };
            reactiveRequest.body.active = true;

            await patchTeam(reactiveRequest, res, next);

            expect(infoService.patch).toHaveBeenCalledTimes(0);
            expect(next).toHaveBeenCalled();
        });

    it('should call patch if user tries to reactivate team with ACTIVATE_TEAM role',
        async () => {
            User.createHeaders.mockImplementation(() => headers);
            User.hasRole.mockImplementation(() => {
                return true;
            });

            const reactiveRequest = { ...req };
            reactiveRequest.body.active = true;

            await patchTeam(reactiveRequest, res, next);

            expect(infoService.patch).toHaveBeenCalledTimes(1);
        });

    it('should not call patch if user tries to deactivate team without DEACTIVATE_TEAM role',
        async () => {
            User.createHeaders.mockImplementation(() => headers);
            User.hasRole.mockImplementation((_, role) => {
                if (role === 'DEACTIVATE_TEAM') {
                    return false;
                }
                return true;
            });

            const reactiveRequest = { ...req };
            reactiveRequest.body.active = false;

            await patchTeam(reactiveRequest, res, next);

            expect(infoService.patch).toHaveBeenCalledTimes(0);
            expect(next).toHaveBeenCalled();
        });

    it('should call patch if user tries to deactivate team with DEACTIVATE_TEAM role',
        async () => {
            User.createHeaders.mockImplementation(() => headers);
            User.hasRole.mockImplementation(() => {
                return true;
            });

            const reactiveRequest = { ...req };
            reactiveRequest.body.active = false;

            await patchTeam(reactiveRequest, res, next);

            expect(infoService.patch).toHaveBeenCalledTimes(1);
        });

    it('should throw error if patch request fails', async () => {
        infoService.patch.mockImplementation(() => Promise.reject());
        User.hasRole.mockReturnValue(true);

        await patchTeam(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});
