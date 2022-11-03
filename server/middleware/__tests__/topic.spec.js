import { infoService } from '../../clients/index';
import { createHeaders } from '../../models/user';
import {
    addDCUTeamsToTopic,
    addParentTopic,
    addTopic,
    getParentTopics,
    getTopic,
    getTopics,
    returnParentTopicsJson,
    returnTopicJson,
    returnTopicsJson
} from '../topic';

jest.mock('../../clients/index');
jest.mock('../../models/user');

describe('When the Topic middleware getParentTopics method is called', () => {

    const headers = '__headers__';
    const req = { user: '__user__' };
    const sendStatus = jest.fn();
    const res = { locals: {}, sendStatus };
    const next = jest.fn();
    const mockParentTopics = [ { label: 'Parent Topic 1', value: 'parentTopic1' }, {
        label: 'Parent Topic 2',
        value: 'parentTopic2'
    } ];

    beforeEach(() => {
        next.mockReset();
        sendStatus.mockReset();
    });

    describe('and the call is sucessful', () => {
        beforeEach(() => {
            infoService.get.mockImplementation(() => Promise.resolve({ data: mockParentTopics }));
        });

        it('should call the post method on the info service', async () => {
            createHeaders.mockImplementation(() => headers);
            await getParentTopics(req, res, next);
            expect(infoService.get).toHaveBeenCalledWith('/topic/parents', { headers: headers });
            expect(res.locals.parentTopics).toStrictEqual(mockParentTopics);
        });

        it('should call the user create headers method', async () => {
            await getParentTopics(req, res, next);
            expect(createHeaders).toHaveBeenCalled();
        });


    });

    describe('and the request fails', () => {
        beforeEach(async () => {
            infoService.get.mockImplementation(() => Promise.reject('__error__'));
            await getParentTopics(req, res, next);

        });

        it('should call the next handler', async () => {
            expect(next).toHaveBeenCalledWith('__error__');
        });
    });
});

describe('when the json handler is called', () => {
    const req = {};
    let res = {};
    const next = jest.fn();
    const json = jest.fn();
    const parentTopics = [ 'parentTopic1', 'parentTopic2', 'parentTopic3' ];

    beforeEach(() => {
        next.mockReset();
        res = { json, locals: { parentTopics } };
    });

    it('should return the parentTopics as json', async () => {
        await returnParentTopicsJson(req, res, next);
        expect(json).toHaveBeenCalledWith(parentTopics);
    });

    it('should be the last handler', async () => {
        await returnParentTopicsJson(req, res, next);
        expect(next).not.toHaveBeenCalled();
    });
});

describe('When the Topic middleware getTopics method is called', () => {

    const headers = '__headers__';
    const req = { user: '__user__' };
    const sendStatus = jest.fn();
    const res = { locals: {}, sendStatus };
    const next = jest.fn();
    const mockTopics = [ { label: 'Topic 1', value: 'topic1' }, { label: 'Topic 2', value: 'topic2' } ];

    beforeEach(() => {
        next.mockReset();
        sendStatus.mockReset();
    });

    describe('and the call is successful', () => {
        beforeEach(() => {
            infoService.get.mockImplementation(() => Promise.resolve({ data: mockTopics }));
        });

        it('should call the get method on the info service', async () => {
            createHeaders.mockImplementation(() => headers);
            await getTopics(req, res, next);
            expect(infoService.get).toHaveBeenCalledWith('/topics/active', { headers: headers });
            expect(res.locals.topics).toStrictEqual(mockTopics);
        });

        it('should call the user create headers method', async () => {
            await getTopics(req, res, next);
            expect(createHeaders).toHaveBeenCalled();
        });

    });

    describe('and the request fails', () => {
        beforeEach(async () => {
            infoService.get.mockImplementation(() => Promise.reject('__error__'));

            await getTopics(req, res, next);
        });

        it('should call the next handler', async () => {
            expect(next).toHaveBeenCalledWith('__error__');
        });
    });
});

describe('when the json handler is called', () => {
    const req = {};
    let res = {};
    const next = jest.fn();
    const json = jest.fn();
    const topics = [ 'topic1', 'topic2', 'topic3' ];

    beforeEach(() => {
        next.mockReset();
        res = { json, locals: { topics } };
    });

    it('should return the topics as json', async () => {
        await returnTopicsJson(req, res, next);
        expect(json).toHaveBeenCalledWith(topics);
    });

    it('should be the last handler', async () => {
        await returnTopicsJson(req, res, next);
        expect(next).not.toHaveBeenCalled();
    });
});

describe('When the Topic middleware getTopic method is called', () => {

    const headers = '__headers__';
    const req = { params: { topicId: '__topicId__' }, user: '__user__' };
    const sendStatus = jest.fn();
    const res = { locals: {}, sendStatus };
    const next = jest.fn();
    const mockTopic = { label: 'Topic 1', value: 'topic1' };

    beforeEach(() => {
        next.mockReset();
        sendStatus.mockReset();
    });

    describe('and the call is successful', () => {
        beforeEach(() => {
            infoService.get.mockImplementation(() => Promise.resolve({ data: mockTopic }));
        });

        it('should call the get method on the info service', async () => {
            createHeaders.mockImplementation(() => headers);
            await getTopic(req, res, next);
            expect(infoService.get).toHaveBeenCalledWith('/topic/' + req.params.topicId, { headers: headers });
            expect(res.locals.topic).toStrictEqual(mockTopic);
        });

        it('should call the user create headers method', async () => {
            await getTopic(req, res, next);
            expect(createHeaders).toHaveBeenCalled();
        });
    });

    describe('and the request fails', () => {
        beforeEach(async () => {
            infoService.get.mockImplementation(() => Promise.reject('__error__'));
            await getTopic(req, res, next);
        });

        it('should call the next handler', async () => {
            expect(next).toHaveBeenCalledWith('__error__');
        });
    });
});

describe('when the json handler is called', () => {
    const req = {};
    let res = {};
    const next = jest.fn();
    const json = jest.fn();
    const topic = [ 'topic1' ];

    beforeEach(() => {
        next.mockReset();
        res = { json, locals: { topic } };
    });

    it('should return the topic as json', async () => {
        await returnTopicJson(req, res, next);
        expect(json).toHaveBeenCalledWith(topic);
    });

    it('should be the last handler', async () => {
        await returnTopicJson(req, res, next);
        expect(next).not.toHaveBeenCalled();
    });
});

describe('Topic middleware addTopic', () => {

    const headers = '__headers__';
    const topicToCreate = { displayName: '__displayName__' };
    const req = { params: { parentTopicId: '__parentTopicId__' }, body: topicToCreate, user: '__user__' };
    const sendStatus = jest.fn();
    const res = { sendStatus };
    const next = jest.fn();

    beforeEach(() => {
        next.mockReset();
        sendStatus.mockReset();
    });

    it('should call the post method on the info service', async () => {
        createHeaders.mockImplementation(() => headers);
        await addTopic(req, res, next);
        expect(infoService.post).toHaveBeenCalledWith('/topic/parent/__parentTopicId__', topicToCreate, { headers: headers });
    });

    it('should call the user create headers method', async () => {
        await addTopic(req, res, next);
        expect(createHeaders).toHaveBeenCalled();
    });

    it('should call the sendstatus method with a success code', async () => {
        await addTopic(req, res, next);
        expect(sendStatus).toHaveBeenCalledWith(200);
    });


    it('should log when the request fails', async () => {
        infoService.post.mockImplementationOnce(() => Promise.reject('__error__'));

        await addTopic(req, res, next);

        expect(next).toHaveBeenCalledWith('__error__');
    });
});

describe('Topic middleware addParentTopic', () => {

    const headers = '__headers__';
    const topicToCreate = { displayName: '__displayName__' };
    const req = { body: topicToCreate, user: '__user__' };
    const sendStatus = jest.fn();
    const res = { sendStatus };
    const next = jest.fn();

    beforeEach(() => {
        next.mockReset();
        sendStatus.mockReset();
    });

    it('should call the post method on the info service', async () => {
        createHeaders.mockImplementation(() => headers);
        await addParentTopic(req, res, next);
        expect(infoService.post).toHaveBeenCalledWith('/topic/parent', topicToCreate, { headers: headers });
    });

    it('should call the user create headers method', async () => {
        await addParentTopic(req, res, next);
        expect(createHeaders).toHaveBeenCalled();
    });

    it('should call the sendstatus method with a success code', async () => {
        await addParentTopic(req, res, next);
        expect(sendStatus).toHaveBeenCalledWith(200);
    });

    it('should throw error when the request fails', async () => {
        infoService.post.mockImplementationOnce(() => Promise.reject('__error__'));

        await addParentTopic(req, res, next);

        expect(next).toHaveBeenCalledWith('__error__');
    });
});

describe.skip('Topic middleware addDCUTeamsToTopic', () => {

    const headers = '__headers__';
    const req = {
        body: {
            topicValue: '__topicValue__',
            privateMinisterTeam: '__privateMinisterTeam__',
            draftQaTeam: '__draftQaTeam__'
        },
        user: '__user__'
    };
    const caseAndStageType = { 'case_type': '__case_type__', 'stage_type': '__stage_type__' };
    const sendStatus = jest.fn();
    const res = { sendStatus };
    const next = jest.fn();

    beforeEach(() => {
        next.mockReset();
        sendStatus.mockReset();
    });

    it('should call the post method on the info service', async () => {
        createHeaders.mockImplementation(() => headers);
        await addDCUTeamsToTopic(req, res, next);
        expect(infoService.post).toHaveBeenCalledWith('/topic/__topicValue__/team/__teamValue__', caseAndStageType, { headers: headers });
    });

    it('should call the user create headers method', async () => {
        await addDCUTeamsToTopic(req, res, next);
        expect(createHeaders).toHaveBeenCalled();
    });

    it('should call the sendstatus method with a success code', async () => {
        await addDCUTeamsToTopic(req, res, next);
        expect(sendStatus).toHaveBeenCalledWith(200);
    });


    it('should throw error when the request fails', async () => {
        infoService.post.mockImplementationOnce(() => Promise.reject('__error__'));

        await addDCUTeamsToTopic(req, res, next);

        expect(next).toHaveBeenCalledWith('__error__');
    });
});
