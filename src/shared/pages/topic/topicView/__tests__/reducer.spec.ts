import { initialState } from '../initialState';
import { reducer } from '../reducer';

describe('when an action is dispatched', () => {
    describe('and it is an SetPrivateMinisterTeam action', () => {
        it('will add the team to the private minister team', () => {

            const { privateMinisterTeam: initialPrivateMinisterTeam, ...initialOtherState } = initialState;
            const state = reducer(initialState, { type: 'SetPrivateMinisterTeam', payload: { label: '__label__', value: '__value__' } });

            expect(state.privateMinisterTeam).toStrictEqual({ label: '__label__', value: '__value__' });

            const newState = reducer(state, { type: 'SetPrivateMinisterTeam', payload: { label: '__label__', value: '__value__' } });
            const { privateMinisterTeam, ...otherState } = newState;

            expect(otherState).toStrictEqual(initialOtherState);
        });
    });
    describe('and it is an draftQaTeam action', () => {
        it('will add the team to the draft/QA team', () => {

            const { draftQATeam: initialDraftQaTeam, ...initialOtherState } = initialState;
            const state = reducer(initialState, { type: 'SetDraftQATeam', payload: { label: '__label__', value: '__value__' } });

            expect(state.draftQATeam).toStrictEqual({ label: '__label__', value: '__value__' });

            const newState = reducer(state, { type: 'SetDraftQATeam', payload: { label: '__label__', value: '__value__' } });
            const { draftQATeam, ...otherState } = newState;

            expect(otherState).toStrictEqual(initialOtherState);
        });
    });
    describe('and it is a SetTopic action', () => {
        it('will set the topic state', () => {

            const { topic: initialTopic, ...initialOtherState } = initialState;
            const state = reducer(initialState, { type: 'SetTopic', payload: { label: '__label__', value: '__value__' } });

            expect(state.topic).toStrictEqual({ label: '__label__', value: '__value__' });

            const newState = reducer(state, { type: 'SetTopic', payload: { label: '__label__', value: '__value__' } });
            const { topic, ...otherState } = newState;

            expect(otherState).toStrictEqual(initialOtherState);
        });
    });
});
