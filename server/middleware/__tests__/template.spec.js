jest.mock('../../clients/index');
jest.mock('../../models/user');
const { infoService } = require('../../clients/index');
const { addTemplate, deleteTemplate, getTemplatesForCaseType } = require('../template');
const User = require('../../models/user');

const headers = '__headers__';
const file = { key: '__key__', originalname: '__originalname__' };
const body = { caseType: '__caseType__' };
const req = { body: body, files: [ file ], user: '__user__' };
const sendStatus = jest.fn();
const json = jest.fn();
const res = { sendStatus, json };
const next = jest.fn();

describe('when the add template middleware is called', () => {

    beforeEach(() => {
        next.mockReset();
        sendStatus.mockReset();
    });

    it('should call the post method on the info service', async () => {
        User.createHeaders.mockImplementation(() => headers);
        await addTemplate(req, res, next);
        expect(infoService.post).toHaveBeenCalledWith('/template', {
            s3UntrustedUrl: '__key__',
            displayName: '__originalname__',
            caseType: '__caseType__'
        }, { headers: headers });
    });

    it('should call the user create headers method', async () => {
        await addTemplate(req, res, next);
        expect(User.createHeaders).toHaveBeenCalled();
    });

    it('should call the sendstatus method with a success code', async () => {
        await addTemplate(req, res, next);
        expect(sendStatus).toHaveBeenCalledWith(200);
    });

    it('should throw error when the request fails', async () => {
        infoService.post.mockImplementation(() => Promise.reject('__error__'));
        await addTemplate(req, res, next);
        expect(next).toHaveBeenCalledWith('__error__');
    });
});

describe('when the get templates middleware is called', () => {

    beforeEach(() => {
        next.mockReset();
        sendStatus.mockReset();
        req.params = {
            type: '__type__'
        };
    });

    it('should call the get method on the info service', async () => {
        User.createHeaders.mockImplementation(() => headers);
        await getTemplatesForCaseType(req, res, next);
        expect(infoService.get).toHaveBeenCalledWith('/caseType/__type__/templates', { headers: headers });
    });

    it('should call the user create headers method', async () => {
        await getTemplatesForCaseType(req, res, next);
        expect(User.createHeaders).toHaveBeenCalled();
    });

    it('should call the json method with a success code', async () => {
        infoService.get.mockImplementation(() => ({ data: [ 'template 1', 'template 2' ] }));
        await getTemplatesForCaseType(req, res, next);
        expect(json).toHaveBeenCalledWith([ 'template 1', 'template 2' ]);
    });

    it('should throw error when the request fails', async () => {
        infoService.get.mockImplementation(() => Promise.reject('__error__'));

        await getTemplatesForCaseType(req, res, next);
        expect(next).toHaveBeenCalledWith('__error__');
    });
});

describe('when the delete template middleware is called', () => {

    beforeEach(() => {
        next.mockReset();
        sendStatus.mockReset();
        req.params = {
            uuid: '__uuid__'
        };
    });

    it('should call the delete method on the info service', async () => {
        User.createHeaders.mockImplementation(() => headers);
        await deleteTemplate(req, res, next);
        expect(infoService.delete).toHaveBeenCalledWith('/template/__uuid__', { headers: headers });
    });

    it('should call the user create headers method', async () => {
        await deleteTemplate(req, res, next);
        expect(User.createHeaders).toHaveBeenCalled();
    });

    it('should call the json method with a success code', async () => {
        await deleteTemplate(req, res, next);
        expect(sendStatus).toHaveBeenCalledWith(200);
    });

    it('should throw error when the request fails', async () => {
        infoService.delete.mockImplementation(() => Promise.reject('__error__'));

        await deleteTemplate(req, res, next);
        expect(next).toHaveBeenCalledWith('__error__');
    });
});
