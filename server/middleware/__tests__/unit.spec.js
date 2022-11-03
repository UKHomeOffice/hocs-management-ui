jest.mock('../../clients/index');
jest.mock('../../models/user');
const { infoService } = require('../../clients/index');
const { addUnit, getUnits } = require('../unit');
const User = require('../../models/user');

describe('Unit middleware addUnit', () => {
    const headers = '__headers__';
    const unitToCreate = { displayName: '__displayName__', shortCode: '__shortCode__' };
    let req = {};
    const sendStatus = jest.fn();
    let res = {};
    const next = jest.fn();
    const units = [ 'unit1', 'unit2' ];
    const fetch = jest.fn(() => units);

    beforeEach(() => {
        next.mockReset();
        req = { body: unitToCreate, user: '__user__' };
        res = { sendStatus };
        sendStatus.mockReset();
    });

    it('should call the post method on the info service', async () => {
        User.createHeaders.mockImplementation(() => headers);

        await addUnit(req, res, next);
        expect(infoService.post).toHaveBeenCalledWith('/unit', unitToCreate, { headers: headers });
    });

    it('should call the get method on the info service', async () => {
        req = { listService: { fetch: fetch } };
        res = { locals: {} };

        await getUnits(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.locals.units).toBeDefined();
        expect(res.locals.units).toEqual(units);
    });

    it('should call the user create headers method', async () => {
        await addUnit(req, res, next);

        expect(User.createHeaders).toHaveBeenCalled();
    });

    it('should call the sendstatus method with a success code', async () => {
        await addUnit(req, res, next);

        expect(sendStatus).toHaveBeenCalledWith(200);
    });

    it('should throw error when the request fails', async () => {
        infoService.post.mockImplementation(() => Promise.reject('__error__'));

        await addUnit(req, res, next);

        expect(next).toHaveBeenCalledWith('__error__');
    });

});
