import axios from 'axios';
import { addTemplate, deleteTemplate } from '../templatesService';
import { createMockFile } from '../../../../test/createMockFile';

const mockFile = createMockFile();
const template = new FormData();
template.append('file', mockFile);
template.append('caseType', 'caseType');

jest.mock('axios');

beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(axios, 'post').mockReturnValue(Promise.resolve());
    jest.spyOn(axios, 'delete').mockReturnValue(Promise.resolve());
});

describe('when the createTemplate method is called', () => {
    describe('and the request is successful', () => {
        it('should make an api call and return a resolved promise', async () => {
            expect.assertions(2);
            await addTemplate(template).then(() => {
                expect(axios.post).toHaveBeenCalledTimes(1);
                expect(axios.post).toHaveBeenCalledWith('/api/templates', template);
            });
        });
    });

    describe('and the request fails', () => {
        it('should return a resolved promise with the team object', async () => {
            jest.spyOn(axios, 'post').mockReturnValue(Promise.reject(new Error('__error__')));
            expect.assertions(2);

            await addTemplate(template).catch((error: Error) => {
                expect(axios.post).toHaveBeenCalledTimes(1);
                expect(error.message).toEqual('__error__');
            });
        });
    });
});

describe('when the deleteTemplate method is called', () => {
    describe('and the request is successful', () => {
        it('should make an api call and return a resolved promise', async () => {
            expect.assertions(2);
            await deleteTemplate('__uuid__').then(() => {
                expect(axios.delete).toHaveBeenCalledTimes(1);
                expect(axios.delete).toHaveBeenCalledWith('/api/templates/__uuid__');
            });
        });
    });

    describe('and the request fails', () => {
        it('should return a resolved promise with the team object', async () => {
            jest.spyOn(axios, 'delete').mockReturnValue(Promise.reject(new Error('__error__')));
            expect.assertions(2);

            await deleteTemplate('__uuid__').catch((error: Error) => {
                expect(axios.delete).toHaveBeenCalledTimes(1);
                expect(error.message).toEqual('__error__');
            });
        });
    });
});
