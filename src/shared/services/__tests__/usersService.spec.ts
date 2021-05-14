import axios from 'axios';
import { getUsers, addUsersToTeam, AddUserError, deleteUserFromTeam, addUser, updateUser } from '../usersService';
import { User } from '../../models/user';

jest.mock('axios');

beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(axios, 'post').mockReturnValue(Promise.resolve({
        data: { label: '__user1__', value: '__userId1__' }
    }));
    jest.spyOn(axios, 'delete').mockReturnValue(Promise.resolve({
        data: { label: '__user1__', value: '__userId1__' }
    }));
});

describe('when the getUsers method is called', () => {
    beforeEach(() => {
        jest.spyOn(axios, 'get').mockReturnValue(Promise.resolve({
            data: [
                { label: '__user1__', value: '__userId1__' },
                { label: '__user2__', value: '__userId2__' }
            ]
        }));
    });
    describe('and the request is successful', () => {
        it('should return a resolved promise with the users collection', async () => {
            expect.assertions(2);

            await getUsers().then((payload: User[]) => {
                expect(axios.get).toHaveBeenCalledTimes(1);
                expect(payload).toStrictEqual([
                    { label: '__user1__', value: '__userId1__' },
                    { label: '__user2__', value: '__userId2__' }
                ]);
            });
        });
    });

    describe('and the request fails', () => {
        it('should return a resolved promise with the team object', async () => {
            jest.spyOn(axios, 'get').mockReturnValue(Promise.reject(new Error('__error__')));
            expect.assertions(2);

            await getUsers().catch((error: Error) => {
                expect(axios.get).toHaveBeenCalledTimes(1);
                expect(error.message).toEqual('__error__');
            });
        });
    });
});

describe('when the getUser method is called', () => {
    beforeEach(() => {
        jest.spyOn(axios, 'get').mockReturnValue(Promise.resolve({
            data: { label: '__user1__', value: '__userId1__' }
        }));
    });
    describe('and the request is successful', () => {
        it('should return a resolved promise with a user', async () => {
            expect.assertions(2);

            await getUsers().then((payload: User[]) => {
                expect(axios.get).toHaveBeenCalledTimes(1);
                expect(payload).toStrictEqual(
                    { label: '__user1__', value: '__userId1__' }
                );
            });
        });
    });

    describe('and the request fails', () => {
        it('should return a resolved promise with the team object', async () => {
            jest.spyOn(axios, 'get').mockReturnValue(Promise.reject(new Error('__error__')));
            expect.assertions(2);

            await getUsers().catch((error: Error) => {
                expect(axios.get).toHaveBeenCalledTimes(1);
                expect(error.message).toEqual('__error__');
            });
        });
    });
});

describe('when the addUserToTeam method is called', () => {
    describe('and the request is sucessful', () => {
        it('should return a resolved promise with the users collection', async () => {
            expect.assertions(2);

            await addUsersToTeam([{ label: '__user1__', value: '__userId1__' }], '__teamId__').then((payload: User[]) => {
                expect(axios.post).toHaveBeenCalledTimes(1);
                expect(payload).toStrictEqual({ label: '__user1__', value: '__userId1__' });
            });
        });
    });

    describe('and the request fails', () => {
        it('should return a resolved promise with the team object', async () => {
            jest.spyOn(axios, 'post').mockReturnValue(Promise.reject(new Error('__error__')));
            expect.assertions(3);

            await addUsersToTeam([
                { label: '__user1__', value: '__userId1__' },
                { label: '__user2__', value: '__userId2__' }
            ], '__teamId__').catch((error: AddUserError) => {
                expect(axios.post).toHaveBeenCalledTimes(1);
                expect(error.message).toEqual('__error__');
                expect(error.usersToAdd).toStrictEqual([
                    { label: '__user1__', value: '__userId1__' },
                    { label: '__user2__', value: '__userId2__' }
                ]);
            });
        });
    });
});

describe('when the deleteUserFromTeam method is called', () => {
    describe('and the request is sucessful', () => {
        it('should return a resolved promise with the users collection', async () => {
            expect.assertions(2);

            await deleteUserFromTeam('__userId1__', '__teamId__').then((payload: User[]) => {
                expect(axios.delete).toHaveBeenCalledTimes(1);
                expect(payload).toStrictEqual({ label: '__user1__', value: '__userId1__' });
            });
        });
    });

    describe('and the request fails', () => {
        it('should return a resolved promise with the team object', async () => {
            jest.spyOn(axios, 'delete').mockReturnValue(Promise.reject(new Error('__error__')));
            expect.assertions(2);

            await deleteUserFromTeam('__userId1__', '__teamId__').catch((error: AddUserError) => {
                expect(axios.delete).toHaveBeenCalledTimes(1);
                expect(error.message).toEqual('__error__');
            });
        });
    });
});

describe('when the addUser method is called', () => {
    describe('and the request is successful', () => {
        it('should return a resolved promise with userUUID', async () => {
            const userId = 'xyz';
            jest.spyOn(axios, 'post').mockReturnValue(Promise.resolve({ data: { userUUID: userId } } ));
            const userFormData = new FormData();
            await addUser(userFormData).then((userUUID: string) => {
                expect(axios.post).toBeCalledWith('/api/users', userFormData);
                expect(userUUID).toStrictEqual(userId);
            });
        });
    });

    describe('and the request fails', () => {
        it('should return a rejected promise with the error from the failed post', async () => {
            const errorMessage = '__error__';
            jest.spyOn(axios, 'post').mockReturnValue(Promise.reject(new Error(errorMessage)));
            const userFormData = new FormData();
            await addUser(userFormData).catch((error: Error) => {
                expect(error.message).toEqual(errorMessage);
            });
        });
    });
});

describe('when the updateUser method is called', () => {
    describe('and the request is successful', () => {
        it('should return a resolved promise with userUUID', async () => {
            const userId = 'x-x-x-x';
            jest.spyOn(axios, 'put').mockReturnValue(Promise.resolve());
            const updateRequest = { uuid: userId, firstName: 'a', lastName: 'b', enabled: true };
            await updateUser(updateRequest).then((userUUID: string) => {
                expect(axios.put).toBeCalledWith('/api/users/' + userId, updateRequest);
            });
        });
    });

    describe('and the request fails', () => {
        it('should return a rejected promise with the error from the failed post', async () => {
            const userId = 'x-x-x-x';
            const errorMessage = '__error__';
            jest.spyOn(axios, 'put').mockReturnValue(Promise.reject(new Error(errorMessage)));
            const updateRequest = { uuid: userId, firstName: 'a', lastName: 'b', enabled: true };
            await updateUser(updateRequest).catch((error: Error) => {
                expect(error.message).toEqual(errorMessage);
            });
        });
    });
});


