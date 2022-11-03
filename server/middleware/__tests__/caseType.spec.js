import { createHeaders } from '../../models/user';

jest.mock('../../clients/index');
jest.mock('../../models/user');
const { infoService } = require('../../clients/index');
const { getCaseType, getCaseTypes } = require('../caseType');

const headers = '__headers__';
const req = { params: { type: '__type__' }, user: '__user__' };
const sendStatus = jest.fn();
const json = jest.fn();
const res = { json, locals: {}, sendStatus };
const next = jest.fn();
const caseTypes = [ { label: 'Case Type 1', value: 'caseType1' }, { label: 'Case Type 2', value: 'caseType2' } ];

describe('When the CaseType middleware getCaseTypes method is called', () => {

    beforeEach(() => {
        next.mockReset();
        sendStatus.mockReset();
    });

    describe('and the call is successful', () => {
        beforeEach(() => {
            infoService.get.mockImplementation(() => Promise.resolve({ data: caseTypes }));
        });

        it('should call the get method on the info service', async () => {
            createHeaders.mockImplementation(() => headers);
            await getCaseTypes(req, res, next);
            expect(infoService.get).toHaveBeenCalledWith('/caseType', { headers: headers });
            expect(res.locals.caseTypes).toStrictEqual(caseTypes);
        });

        it('should call the user create headers method', async () => {
            await getCaseTypes(req, res, next);
            expect(createHeaders).toHaveBeenCalled();
        });
    });

    describe('and the request fails', () => {
        beforeEach(async () => {
            infoService.get.mockImplementation(() => Promise.reject('__error__'));
            await getCaseTypes(req, res, next);
        });

        it('should call the next handler', async () => {
            expect(next).toHaveBeenCalledWith('__error__');
        });
    });
});

describe('When the CaseType middleware getCaseType method is called', () => {

    beforeEach(() => {
        next.mockReset();
        sendStatus.mockReset();
    });

    describe('and the call is successful', () => {
        beforeEach(() => {
            infoService.get.mockImplementation(() => Promise.resolve({ data: caseTypes[0] }));
        });

        it('should call the get method on the info service', async () => {
            createHeaders.mockImplementation(() => headers);
            await getCaseType(req, res, next);
            expect(infoService.get).toHaveBeenCalledWith('/caseType/type/__type__', { headers: headers });
            expect(res.json).toHaveBeenCalledWith(caseTypes[0]);
        });

        it('should call the user create headers method', async () => {
            await getCaseType(req, res, next);
            expect(createHeaders).toHaveBeenCalled();
        });

    });

    describe('and the request fails', () => {
        beforeEach(async () => {
            infoService.get.mockImplementation(() => Promise.reject('__error__'));
            await getCaseType(req, res, next);
        });
        it('should call the next handler', async () => {
            expect(next).toHaveBeenCalledWith('__error__');
        });
    });
});
