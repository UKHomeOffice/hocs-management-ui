import { initialState } from '../initialState';
import { reducer } from '../reducer';

describe('when an action is dispatched', () => {
    describe('and it is an AddToSelection action', () => {
        it('will add the user to the selected users collection', () => {

            const { selectedUsers: initialSelectedUsers, ...initialOtherState } = initialState;
            const state = reducer(initialState, { type: 'AddToSelection', payload: { label: '__label1__', value: '__value1__' } });

            expect(state.selectedUsers).toHaveLength(1);
            expect(state.selectedUsers[0]).toStrictEqual({ label: '__label1__', value: '__value1__' });

            const newState = reducer(state, { type: 'AddToSelection', payload: { label: '__label2__', value: '__value2__' } });
            const { selectedUsers, ...otherState } = newState;

            expect(newState.selectedUsers).toHaveLength(2);
            expect(newState.selectedUsers[0]).toStrictEqual({ label: '__label1__', value: '__value1__' });
            expect(newState.selectedUsers[1]).toStrictEqual({ label: '__label2__', value: '__value2__' });

            expect(otherState).toStrictEqual(initialOtherState);
        });
    });
    describe('and it is a ClearSelectedUser action', () => {
        it('will clear any previous errors', () => {

            const { selectedUser: initialSelectedUser, ...initialOtherState } = initialState;
            const state = reducer(initialState, { type: 'ClearSelectedUser' });
            const { selectedUser, ...otherState } = state;

            expect(selectedUser).toBe(undefined);
            expect(otherState).toStrictEqual(initialOtherState);
        });
    });
    describe('and it is an RemoveFromSelection action', () => {
        it('will remove the user from the selected users collection', () => {

            initialState.selectedUsers = [{ label: '__label1__', value: '__value1__' }, { label: '__label2__', value: '__value2__' }];
            const { selectedUsers: initialSelectedUsers, ...initialOtherState } = initialState;

            const state = reducer(initialState, { type: 'RemoveFromSelection', payload: { label: '__label1__', value: '__value1__' } });
            const { selectedUsers, ...otherState } = state;

            expect(state.selectedUsers).toHaveLength(1);
            expect(state.selectedUsers[0]).toStrictEqual({ label: '__label2__', value: '__value2__' });

            expect(otherState).toStrictEqual(initialOtherState);
        });
    });
    describe('and it is a SetTeamName action', () => {
        it('will clear any previous errors', () => {

            const { teamName: initialTeamName, ...initialOtherState } = initialState;
            const state = reducer(initialState, { type: 'SetTeamName', payload: '__teamName__' });
            const { teamName, ...otherState } = state;

            expect(teamName).toBe('__teamName__');
            expect(otherState).toStrictEqual(initialOtherState);
        });
    });
});
