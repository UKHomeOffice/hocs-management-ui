import { initialState } from '../initialState';
import { reducer } from '../reducer';

describe('when an action is dispatched', () => {
    describe('and it is a PopulateEntities action', () => {
        it('it will add campaigns to the populated entities collection', () => {

            const { entities: initialCampaigns, entitiesLoaded: initialCampaignsLoaded, ...otherInitialState } = initialState;
            const state = reducer(initialState, {
                type: 'PopulateEntities', payload: [
                    { simpleName: 'simpleName1', title: 'title1', uuid: 'uuid1',active: false },
                    { simpleName: 'simpleName2', title: 'title2', uuid: 'uuid2', active: false }
                ]
            });
            const { entities, entitiesLoaded, ...otherState } = state;

            expect(entities).toStrictEqual([
                { simpleName: 'simpleName1', title: 'title1', uuid: 'uuid1', active: false  },
                { simpleName: 'simpleName2', title: 'title2', uuid: 'uuid2', active: false  }
            ]);
            expect(entitiesLoaded).toEqual(true);
            expect(otherState).toStrictEqual(otherInitialState);
        });
    });
});
