import axios from 'axios';
import { createUnit } from '../unitsService';

jest.mock('axios');

beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(axios, 'post').mockReturnValue(Promise.resolve());
});

describe('when the createUnit method is called', () => {
    describe('and the request is sucessful', () => {
        it('should make an api call and return a resolved promise', async () => {
            expect.assertions(2);

            await createUnit({
                displayName: '__unit1__', shortCode: '__unitId1__', value: '__unitsValue1__'}).then(() => {
                    expect(axios.post).toHaveBeenCalledTimes(1);
                    expect(axios.post).toHaveBeenCalledWith('/api/units', { displayName: '__unit1__', shortCode: '__unitId1__', value: '__unitsValue1__' });
                });
        });
    });

    describe('and the request fails', () => {
        it('should return a resolved promise with the team object', async () => {
            jest.spyOn(axios, 'post').mockReturnValue(Promise.reject(new Error('__error__')));
            expect.assertions(2);

            await createUnit({ displayName: '__unit1__', shortCode: '__unitId1__', value: '__unitsValue1__' }).catch((error: Error) => {
                expect(axios.post).toHaveBeenCalledTimes(1);
                expect(error.message).toEqual('__error__');
            });
        });
    });
});
