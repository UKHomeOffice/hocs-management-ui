import axios from 'axios';
import { createUnit, getUnits } from '../unitsService';
import Item from 'shared/models/item';

jest.mock('axios');

beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(axios, 'post').mockReturnValue(Promise.resolve());
    jest.spyOn(axios, 'get').mockReturnValue(Promise.resolve({
        data: [
            { label: 'Item' }
        ]
    }));
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

describe('when the getUnits method is called', () => {
    describe('and the request is sucessful', () => {
        it('should make an api call and return a resolved promise', async () => {
            expect.assertions(3);

            await getUnits().then((payload: [Item]) => {
                expect(axios.get).toHaveBeenCalledTimes(1);
                expect(axios.get).toHaveBeenCalledWith('/api/units');
                expect(payload).toStrictEqual([{ label: 'Item' }]);
            });
        });
    });

    describe('and the request fails', () => {
        it('should return a resolved promise with the team object', async () => {
            jest.spyOn(axios, 'get').mockReturnValue(Promise.reject(new Error('__error__')));
            expect.assertions(2);

            await getUnits().catch((error: Error) => {
                expect(axios.get).toHaveBeenCalledTimes(1);
                expect(error.message).toEqual('__error__');
            });
        });
    });
});
