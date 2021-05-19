import { initialState } from '../initialState';
import { reducer } from '../reducer';

describe('Given the SetCurrentTeamName action is dispatched', () => {
    it('it will set the currentDisplayName', () => {
        const state = reducer(initialState, { type: 'SetCurrentTeamName', payload: '__someTeamName__' });

        const expectedState = {
            currentDisplayName: '__someTeamName__',
            newDisplayName: '__someTeamName__'
        };
        expect(state).toStrictEqual(expectedState);
    });
});

describe('Given the SetNewTeamName action is dispatched', () => {
    it('it will set the newDisplayName', () => {
        const state = reducer(initialState, { type: 'SetNewTeamName', payload: '__someTeamName__' });

        const expectedState = {
            currentDisplayName: '',
            newDisplayName: '__someTeamName__'
        };
        expect(state).toStrictEqual(expectedState);
    });
});
