import axios from 'axios';
import {
    getTeam, getTeams, getTeamMembers, getTeamsForUser, addTeam, updateTeamName
} from '../teamsService';
import Team from '../../models/team';
import { User } from '../../models/user';
import Item from '../../models/item';

jest.mock('axios');

let axiosGetSpy: jest.SpyInstance;
const axiosPostSpy: jest.SpyInstance = jest.spyOn(axios, 'post');
const axiosPutSpy: jest.SpyInstance = jest.spyOn(axios, 'put');

beforeEach(() => {
    jest.resetAllMocks();
    axiosGetSpy = jest.spyOn(axios, 'get').mockReturnValue(Promise.resolve({
        data: [
            { label: '__user1__', value: '__userId1__' },
            { label: '__user2__', value: '__userId2__' }
        ]
    }));
});

describe('when the getTeam method is called', () => {
    describe('and the request is sucessful', () => {
        it('should return a resolved promise with the team object', async () => {
            jest.spyOn(axios, 'get').mockReturnValue(Promise.resolve({ data: { displayName: '__displayName__' } }));
            expect.assertions(1);

            await getTeam('__teamId__').then((payload: Team) => {
                expect(payload).toStrictEqual({ displayName: '__displayName__' });
            });
        });
    });

    describe('and the request fails', () => {
        it('should return a rejected promise', async () => {
            jest.spyOn(axios, 'get').mockReturnValue(Promise.reject(new Error('__error__')));
            expect.assertions(1);

            await getTeam('__teamId__').catch((error: Error) => {
                expect(error.message).toEqual('__error__');
            });
        });
    });
});

describe('when the getTeamMembers method is called', () => {
    describe('and the request is sucessful', () => {
        it('should return a resolved promise with the users collection', async () => {
            expect.assertions(2);

            await getTeamMembers('__teamId__').then((payload: User[]) => {
                expect(axios.get).toHaveBeenCalledTimes(1);
                expect(payload).toStrictEqual([
                    { label: '__user1__', value: '__userId1__' },
                    { label: '__user2__', value: '__userId2__' }
                ]);
            });
        });
    });

    describe('and the request fails', () => {
        it('should return a rejected promise', async () => {
            jest.spyOn(axios, 'get').mockReturnValue(Promise.reject(new Error('__error__')));
            expect.assertions(2);

            await getTeamMembers('__teamId__').catch((error: Error) => {
                expect(axios.get).toHaveBeenCalledTimes(1);
                expect(error.message).toEqual('__error__');
            });
        });
    });
});

describe('when the getTeams method is called', () => {

    beforeEach(() => {
        axiosGetSpy.mockReturnValue(Promise.resolve({
            data: [
                { label: '__team1__', value: '__teamId1__' },
                { label: '__team2__', value: '__teamId2__' }
            ]
        }));
    });
    describe('and the request is sucessful', () => {
        it('should return a resolved promise with the teams collection', async () => {
            expect.assertions(2);

            await getTeams().then((payload: Item[]) => {
                expect(axios.get).toHaveBeenCalledTimes(1);
                expect(payload).toStrictEqual([
                    { label: '__team1__', value: '__teamId1__' },
                    { label: '__team2__', value: '__teamId2__' }
                ]);
            });
        });
    });

    describe('and the request fails', () => {
        it('should return a rejected promise', async () => {
            jest.spyOn(axios, 'get').mockReturnValue(Promise.reject(new Error('__error__')));
            expect.assertions(2);

            await getTeams().catch((error: Error) => {
                expect(axios.get).toHaveBeenCalledTimes(1);
                expect(error.message).toEqual('__error__');
            });
        });
    });
});

describe('when the getTeams method is called', () => {

    beforeEach(() => {
        axiosGetSpy.mockReturnValue(Promise.resolve({
            data: [
                { label: '__team1__', value: '__teamId1__' },
                { label: '__team2__', value: '__teamId2__' }
            ]
        }));
    });
    describe('and the request is sucessful', () => {
        it('should return a resolved promise with the teams collection', async () => {
            expect.assertions(2);

            await getTeams().then((payload: Item[]) => {
                expect(axios.get).toHaveBeenCalledTimes(1);
                expect(payload).toStrictEqual([
                    { label: '__team1__', value: '__teamId1__' },
                    { label: '__team2__', value: '__teamId2__' }
                ]);
            });
        });
    });

    describe('and the request fails', () => {
        it('should return a rejected promise', async () => {
            jest.spyOn(axios, 'get').mockReturnValue(Promise.reject(new Error('__error__')));
            expect.assertions(2);

            await getTeams().catch((error: Error) => {
                expect(axios.get).toHaveBeenCalledTimes(1);
                expect(error.message).toEqual('__error__');
            });
        });
    });
});

describe('when the getTeamsForUser method is called', () => {
    const userId = 'userId';
    beforeEach(() => {
        axiosGetSpy.mockReturnValue(Promise.resolve({
            data: [
                { label: '__team1__', value: '__teamId1__' },
                { label: '__team2__', value: '__teamId2__' }
            ]
        }));
    });
    describe('and the request is sucessful', () => {
        it('should return a resolved promise with the teams collection', async () => {
            expect.assertions(2);

            await getTeamsForUser(userId).then((payload: Item[]) => {
                expect(axios.get).toHaveBeenCalledTimes(1);
                expect(payload).toStrictEqual([
                    { label: '__team1__', value: '__teamId1__' },
                    { label: '__team2__', value: '__teamId2__' }
                ]);
            });
        });
    });

    describe('and the request fails', () => {
        it('should return a rejected promise', async () => {
            jest.spyOn(axios, 'get').mockReturnValue(Promise.reject(new Error('__error__')));
            expect.assertions(2);

            await getTeamsForUser(userId).catch((error: Error) => {
                expect(axios.get).toHaveBeenCalledTimes(1);
                expect(error.message).toEqual('__error__');
            });
        });
    });
});

describe('when the addTeam function is called', () => {
    const team: Team = {
        displayName: '__someDisplayName__',
        permissions: [
            {
                accessLevel: 'OWNER',
                caseTypeCode: 'MPAM'
            }
        ],
        letterName: '__someLetterName__',
        type: '__someType__',
        active: true,
        unitUUID: '__someUnitUUID__'
    };

    describe('and the post request is successful', () => {
        it('should return a resolved promise', async () => {
            expect.assertions(1);
            axiosPostSpy.mockReturnValue(Promise.resolve({ data: {} }));

            await addTeam(team).then(() => {
                expect(axiosPostSpy).toHaveBeenCalledWith(
                    '/api/teams/unit/__someUnitUUID__',
                    team
                );
            });
        });
    });

    describe('and the request fails', () => {
        it('should return a rejected promise with the error', async () => {
            axiosPostSpy.mockReturnValue(Promise.reject(new Error('__someError__')));
            expect.assertions(1);

            await addTeam(team).catch((error: Error) => {
                expect(error.message).toEqual('__someError__');
            });
        });
    });
});

describe('when the updateTeamName function is called', () => {
    const teamId = '__teamId__';
    const newTeamName = '__newTeamName__';

    describe('and the put request is successful', () => {
        it('should return a resolved promise', async () => {
            expect.assertions(1);
            axiosPutSpy.mockReturnValue(Promise.resolve({ data: {} }));

            await updateTeamName(teamId, newTeamName).then(() => {
                expect(axiosPutSpy).toHaveBeenCalledWith(
                    '/api/teams/__teamId__',
                    { displayName: newTeamName }
                );
            });
        });
    });

    describe('and the request fails', () => {
        it('should return a rejected promise with the error', async () => {
            axiosPutSpy.mockReturnValue(Promise.reject(new Error('__someError__')));
            expect.assertions(1);

            await updateTeamName(teamId, newTeamName).catch((error: Error) => {
                expect(error.message).toEqual('__someError__');
            });
        });
    });
});
