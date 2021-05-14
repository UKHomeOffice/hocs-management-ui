jest.mock('../../clients/index');
jest.mock('../../libs/logger');
jest.mock('../../models/user');
const { infoService } = require('../../clients/index');
const { addToTeam, getAllUsers, removeFromTeam, getUser, addUser, amendUser, returnUsersJson, returnUserJson } = require('../user');
const getLogger = require('../../libs/logger');
const User = require('../../models/user');

describe('User middleware addToTeam', () => {

    const userId = '__userId__';
    const teamId = '__teamId__';
    const headers = '__headers__';
    const req = { params: { userId: userId, teamId: teamId }, user: '__user__' } ;
    let res = {};
    const next = jest.fn();

    beforeEach(() => {
        next.mockReset();
        res = { locals: {} };
    });

    it('should call the post method on the info service', async () => {
        User.createHeaders.mockImplementation(() => headers);
        req.body = ['__user1__', '__user2__'];
        await addToTeam(req, res, next);
        expect(infoService.post).toHaveBeenCalledWith(`/users/team/${teamId}`, ['__user1__', '__user2__'], { headers: headers });
    });

    it('should call the user create headers method', async () => {
        await addToTeam(req, res, next);
        expect(User.createHeaders).toHaveBeenCalled();
    });

    it('should call the next handler', async () => {
        await addToTeam(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should get the logger instance', async () => {
        await addToTeam(req, res, next);
        expect(getLogger).toHaveBeenCalled();
    });

    it('should log when the request fails', async () => {
        infoService.post.mockImplementation(() => Promise.reject('__error__'));
        const logError = jest.fn();
        getLogger.mockImplementation(() => ({ error: logError }) );
        await addToTeam(req, res, next);
        expect(logError).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith('__error__');
    });
});

describe('User middleware remove from team', () => {

    const userId = '__userId__';
    const teamId = '__teamId__';
    const headers = '__headers__';
    const req = { params: { userId: userId, teamId: teamId }, user: '__user__' } ;
    let res = {};
    const next = jest.fn();

    beforeEach(() => {
        next.mockReset();
        res = { locals: {} };
    });

    it('should call the delete method on the info service', async () => {
        User.createHeaders.mockImplementation(() => headers);
        await removeFromTeam(req, res, next);
        expect(infoService.delete).toHaveBeenCalledWith(`/users/${userId}/team/${teamId}`, { headers: headers });
    });

    it('should call the user create headers method', async () => {
        await removeFromTeam(req, res, next);
        expect(User.createHeaders).toHaveBeenCalled();
    });

    it('should call the next handler', async () => {
        await removeFromTeam(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should get the logger instance', async () => {
        await removeFromTeam(req, res, next);
        expect(getLogger).toHaveBeenCalled();
    });

    it('should log when the request fails', async () => {
        infoService.delete.mockImplementation(() => Promise.reject('__error__'));
        const logError = jest.fn();
        getLogger.mockImplementation(() => ({ error: logError }) );
        await removeFromTeam(req, res, next);
        expect(logError).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith('__error__');
    });
});

describe('getAllUsers', () => {

    let req = {};
    let res = {};
    const next = jest.fn();
    const users = ['user1', 'user2', 'user3'];
    const fetch = jest.fn(() => users);

    beforeEach(() => {
        next.mockReset();
        req = { listService: { fetch: fetch } };
        res = { locals: {} };
    });

    it('should put the users object in response locals', async () => {
        await getAllUsers(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res.locals.users).toBeDefined();
        expect(res.locals.users).toEqual(users);
    });
});

describe('getUser', () => {
    it('should put the users object in response locals', async () => {
        const headers = '__headers__';
        User.createHeaders.mockImplementation(() => headers);
        const userData = { name: 'value' };
        infoService.get.mockImplementation(() => Promise.resolve({ data: userData }));
        const userId = 'x-x-x-x';
        const req = { params: { userId } };
        let res = { locals: {} };
        const next = jest.fn();
        await getUser(req, res, next);
        expect(infoService.get).toHaveBeenCalledWith('/user/' + userId, { headers } );
        expect(res.locals.user).toBeDefined();
        expect(res.locals.user).toEqual(userData);
        expect(next).toHaveBeenCalled();
    });
});

describe('addUser', () => {
    it('should invoke info service and put uuid in response', async () => {
        const headers = '__headers__';
        const userId = 'x-x-x-x';
        User.createHeaders.mockImplementation(() => headers);
        infoService.post.mockImplementation(() => Promise.resolve({ data: { userUUID: userId } }));
        const reqBody = {
            email: 'email',
            firstName: 'firstName',
            lastName: 'lastName'
        };
        const req = { body: reqBody };
        const sendFunction = jest.fn();
        let res = { send: sendFunction };
        const next = jest.fn();
        await addUser(req, res, next);
        expect(infoService.post).toHaveBeenCalledWith('/user', reqBody, { headers } );
        expect(sendFunction).toHaveBeenCalledWith({ userUUID: userId } );
    });
});

describe('amendUser', () => {
    it('should invoke info service', async () => {
        const headers = '__headers__';
        const userId = 'x-x-x-x';
        User.createHeaders.mockImplementation(() => headers);
        infoService.put.mockImplementation(() => Promise.resolve({ data: { userUUID: userId } }));
        const reqBody = {
            firstName: 'firstName',
            lastName: 'lastName',
            enabled: false
        };
        const req = { body: reqBody , params: { userId } };
        const sendStatusFunction = jest.fn();
        let res = { sendStatus: sendStatusFunction };
        const next = jest.fn();
        await amendUser(req, res, next);
        expect(infoService.put).toHaveBeenCalledWith('/user/' + userId, reqBody, { headers } );
        expect(sendStatusFunction).toHaveBeenCalledWith(200 );
    });
});

describe('returnUsersJson', () => {
    const req = {};
    let res = {};
    const next = jest.fn();
    const json = jest.fn();
    const users = ['user1', 'user2', 'user3'];

    beforeEach(() => {
        next.mockReset();
        res = { json, locals: { users } };
    });

    it('should return the users as json', async () => {
        await returnUsersJson(req, res, next);
        expect(json).toHaveBeenCalledWith(users);
    });

    it('should be the last handler', async () => {
        await returnUsersJson(req, res, next);
        expect(next).not.toHaveBeenCalled();
    });
});

describe('returnUserJson', () => {
    const req = {};
    let res = {};
    const next = jest.fn();
    const json = jest.fn();
    const user = {
        label: 'user',
        value: 'user'
    };

    beforeEach(() => {
        next.mockReset();
        res = { json, locals: { user } };
    });

    it('should return the user as json', async () => {
        await returnUserJson(req, res, next);
        expect(json).toHaveBeenCalledWith(user);
    });

    it('should be the last handler', async () => {
        await returnUserJson(req, res, next);
        expect(next).not.toHaveBeenCalled();
    });
});
