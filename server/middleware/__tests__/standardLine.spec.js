jest.mock('../../clients/index');
jest.mock('../../models/user');
const { infoService } = require('../../clients/index');
const { addStandardLine } = require('../standardLine');
const User = require('../../models/user');

describe('when the standardLine middleware is called', () => {
    const headers = '__headers__';
    const file = { key: '__key__', originalname: '__originalname__' };
    const body = { topic: '__topic__', expiryDate: '__expiry_date__' };
    const req = { body: body, files: [ file ], user: '__user__' };
    const sendStatus = jest.fn();
    const res = { sendStatus };
    const next = jest.fn();

    beforeEach(() => {
        next.mockReset();
        sendStatus.mockReset();
    });

    it('should call the post method on the info service', async () => {
        User.createHeaders.mockImplementation(() => headers);
        await addStandardLine(req, res, next);
        expect(infoService.post).toHaveBeenCalledWith('/standardLine', {
            s3UntrustedUrl: '__key__',
            displayName: '__originalname__',
            topicUUID: '__topic__',
            expires: '__expiry_date__'
        }, { headers: headers });
    });

    it('should call the user create headers method', async () => {
        await addStandardLine(req, res, next);
        expect(User.createHeaders).toHaveBeenCalled();
    });

    it('should call the sendstatus method with a success code', async () => {
        await addStandardLine(req, res, next);
        expect(sendStatus).toHaveBeenCalledWith(200);
    });

    it('should throw error when the request fails', async () => {
        infoService.post.mockImplementation(() => Promise.reject('__error__'));

        await addStandardLine(req, res, next);

        expect(next).toHaveBeenCalledWith('__error__');
    });
});
