import { initialState } from '../initialState';
import { reducer } from '../reducer';

describe('Given the setTeamName action is dispatched', () => {
    it('it will set the displayName & letterName on the state', () => {

        const state = reducer(initialState, { type: 'SetTeamName', payload: '__someTeamName__' });
        const expectedState = {
            team: {
                displayName: '__someTeamName__',
                permissions: [
                    {
                        accessLevel: 'OWNER',
                        caseTypeCode: 'DTEN'
                    },
                    {
                        accessLevel: 'OWNER',
                        caseTypeCode: 'TRO'
                    },
                    {
                        accessLevel: 'OWNER',
                        caseTypeCode: 'MIN'
                    }
                ],
                letterName: '__someTeamName__',
                type: '',
                active: true,
                unitUUID: ''
            }
        };
        expect(state).toStrictEqual(expectedState);
    });
});

describe('Given the setUnit action is dispatched', () => {
    it('it will set the unitUUID on the state', () => {

        const state = reducer(initialState, { type: 'SetUnit', payload: '__someUUID__' });
        const expectedState = {
            team: {
                displayName: '',
                permissions: [
                    {
                        accessLevel: 'OWNER',
                        caseTypeCode: 'DTEN'
                    },
                    {
                        accessLevel: 'OWNER',
                        caseTypeCode: 'TRO'
                    },
                    {
                        accessLevel: 'OWNER',
                        caseTypeCode: 'MIN'
                    }
                ],
                letterName: '',
                type: '',
                active: true,
                unitUUID: '__someUUID__'
            }
        };
        expect(state).toStrictEqual(expectedState);
    });
});
