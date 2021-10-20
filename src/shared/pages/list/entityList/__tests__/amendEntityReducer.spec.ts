import { State } from '../../entityList/amendEntityState';
import { reducer } from '../../entityList/amendEntityReducer';

describe('when an action is dispatched', () => {
    describe('and it is a SetItemDetails action', () => {
        it('it will update the base state with simpleName, title, originalTitle and uuid', () => {
            const inputState: State = { simpleName: 'testSimpleName', title: 'testTitle', originalTitle: 'testOriginalTitle', uuid: 'testUUID' };
            const state = reducer(inputState, {
                type: 'SetItemDetails', payload: { simpleName: 'testSimpleName2', title: 'testTitle2', uuid: 'testUUID2' }

            });
            const { simpleName, title, originalTitle, uuid } = state;
            expect(simpleName).toEqual('testSimpleName2');
            expect(title).toEqual('testTitle2');
            expect(originalTitle).toEqual('testTitle2');
            expect(uuid).toEqual('testUUID2');
        });
    });

    describe('and it is a SetTitle action', () => {
        it('it will update the base state with title', () => {
            const inputState: State = { simpleName: 'testSimpleName', title: 'testTitle', originalTitle: 'testOriginalTitle', uuid: 'testUUID' };
            const state = reducer(inputState, {
                type: 'SetTitle', payload: 'testTitle2'

            });
            const { simpleName, title, originalTitle, uuid } = state;
            expect(simpleName).toEqual('testSimpleName');
            expect(title).toEqual('testTitle2');
            expect(originalTitle).toEqual('testOriginalTitle');
            expect(uuid).toEqual('testUUID');
        });
    });

    describe('and it is a SetSimpleName action', () => {
        it('it will update the base state with simpleName', () => {
            const inputState: State = { simpleName: 'testSimpleName', title: 'testTitle', originalTitle: 'testOriginalTitle', uuid: 'testUUID' };
            const state = reducer(inputState, {
                type: 'SetSimpleName', payload: 'testSimpleName2'

            });
            const { simpleName, title, originalTitle, uuid } = state;
            expect(simpleName).toEqual('testSimpleName2');
            expect(title).toEqual('testTitle');
            expect(originalTitle).toEqual('testOriginalTitle');
            expect(uuid).toEqual('testUUID');
        });
    });
});
