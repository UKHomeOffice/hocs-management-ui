jest.mock('../../clients/index');
jest.mock('../../models/user');
const { infoService } = require('../../clients/index');
const {
    addNominatedContact,
    getNominatedContactsForTeam,
    removeNominatedContactFromTeam
} = require('../nominatedContact');
const User = require('../../models/user');

describe('nominatedContact middleware', () => {
    describe('NominatedContact middleware addNominatedContact', () => {
        const headers = '__headers__';
        const nominatedContact = { emailAddress: '__emailAddress__', teamUUID: '__teamUUID__' };
        const nominatedContactEmail = { email_address: '__emailAddress__' };
        let req = {};
        const json = jest.fn();
        let res = {};
        const next = jest.fn();
        let mockUuidResponse;

        beforeEach(() => {
            next.mockReset();
            req = { body: nominatedContact, user: '__user__' };
            res = { json };
            json.mockReset();
            mockUuidResponse = { data: { uuid: '123' } };
            infoService.post.mockImplementation(() => Promise.resolve(mockUuidResponse));
        });

        it('should call the post method on the info service', async () => {
            User.createHeaders.mockImplementation(() => headers);

            await addNominatedContact(req, res, next);
            expect(infoService.post).toHaveBeenCalledWith(`/team/${req.body.teamUUID}/contact`, nominatedContactEmail, { headers: headers });
        });

        it('should call the user create headers method', async () => {
            await addNominatedContact(req, res, next);

            expect(User.createHeaders).toHaveBeenCalled();
        });

        it('should call the json method with the new uuid', async () => {
            await addNominatedContact(req, res, next);

            expect(json).toHaveBeenCalledWith({ 'uuid': '123' });
        });


        it('should throw error when the request fails', async () => {
            infoService.post.mockImplementationOnce(() => Promise.reject('__error__'));

            await addNominatedContact(req, res, next);

            expect(next).toHaveBeenCalledWith('__error__');
        });
    });

    describe('NominatedContact middleware removeNominatedContactFromTeam', () => {
        const headers = '__headers__';
        let req = {};
        const sendStatus = jest.fn();
        let res = {};
        const next = jest.fn();

        beforeEach(() => {
            next.mockReset();
            req = { params: { teamUUID: '__teamUUID__', nominatedContactUUID: '__nominatedContactUUID__' } };
            res = { sendStatus };
            sendStatus.mockReset();
            infoService.delete.mockImplementation(() => Promise.resolve());
        });

        it('should call the post method on the info service', async () => {
            User.createHeaders.mockImplementation(() => headers);
            await removeNominatedContactFromTeam(req, res, next);

            expect(infoService.delete).toHaveBeenCalledWith(
                `/team/${req.params.teamUUID}/contact/${req.params.nominatedContactUUID}`, { 'headers': '__headers__' });
        });

        it('should call the user create headers method', async () => {
            await removeNominatedContactFromTeam(req, res, next);

            expect(User.createHeaders).toHaveBeenCalled();
        });

        it('should throw error when the request fails', async () => {
            infoService.delete.mockImplementationOnce(() => Promise.reject('__error__'));

            await removeNominatedContactFromTeam(req, res, next);

            expect(next).toHaveBeenCalledWith('__error__');
        });
    });

    describe('NominatedContact middleware getNominatedContactsForTeam', () => {
        let req = {};
        const json = jest.fn();
        let res = {};
        const next = jest.fn();
        let mockContacts;

        beforeEach(() => {
            next.mockReset();
            res = { json, locals: {} };
            json.mockReset();
            mockContacts = [
                {
                    'id': 1,
                    'uuid': 'uuid1',
                    'teamUUID': 'teamUUID1',
                    'emailAddress': 'one@example.org'
                },
                {
                    'id': 2,
                    'uuid': 'uuid2',
                    'teamUUID': 'teamUUID2',
                    'emailAddress': 'two@example.org'
                }
            ];
            req = { params: { teamId: 'team1' }, listService: { fetch: jest.fn().mockReturnValue(mockContacts) } };
        });

        it('should return NominatedContacts from the info service', async () => {
            await getNominatedContactsForTeam(req, res, next);

            expect(req.listService.fetch).toBeCalledWith('CONTACTS_FOR_TEAM', { 'teamId': 'team1' });
            expect(res.locals.nominatedContacts).toEqual(mockContacts);
        });

        it('should throw error when the request fails', async () => {
            req.listService.fetch = jest.fn((() => Promise.reject('__error__')));

            await getNominatedContactsForTeam(req, res, next);

            expect(next).toHaveBeenCalledWith('__error__');
        });
    });
});
