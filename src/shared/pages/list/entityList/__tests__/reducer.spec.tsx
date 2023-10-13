import { initialState } from '../initialState';
import { reducer } from '../reducer';
import { State } from '../state';

const EXAMPLE_ENTITIES = [
    { simpleName: 'simpleName1', title: 'title1', uuid: 'uuid1', active: true  },
    { simpleName: 'simpleName2', title: 'title2', uuid: 'uuid2', active: false  },
    { simpleName: 'simpleName3', title: 'title3', uuid: 'uuid3', active: false  }
];

describe('when an action is dispatched', () => {
    describe('and it is a PopulateEntities action', () => {
        it('it will add campaigns to the populated entities collection', () => {

            const {
                entities: initialCampaigns,
                entitiesLoaded: initialCampaignsLoaded,
                entitiesToDisplay: initialEntitiesToDisplay,
                inactiveCount: initialInactiveCount,
                ...otherInitialState
            } = initialState;

            const state = reducer(initialState, {
                type: 'PopulateEntities',
                payload: EXAMPLE_ENTITIES
            });
            const {
                entities,
                entitiesLoaded, entitiesToDisplay,
                inactiveCount,
                ...otherState
            } = state;


            expect(entities).toStrictEqual(EXAMPLE_ENTITIES);
            expect(entitiesLoaded).toEqual(true);
            expect(entitiesToDisplay).toStrictEqual([
                { simpleName: 'simpleName1', title: 'title1', uuid: 'uuid1', active: true  },
            ]);
            expect(inactiveCount).toEqual(2);

            expect(otherState).toStrictEqual(otherInitialState);
        });
    });

    describe('and it is a ToggleShowInactive action', () => {
        it('when show inactive is true, all entities are shown', () => {
            const staticState = {
                entities: EXAMPLE_ENTITIES,
                entitiesLoaded: true,
                inactiveCount: 2,
            };

            const stateWithEntities: State = {
                ...staticState,
                entitiesToDisplay: [EXAMPLE_ENTITIES[0]],
                showInactive: false,
            };

            const { entitiesToDisplay, showInactive, ...otherState } = reducer(stateWithEntities, {
                type: 'ToggleShowInactive',
                payload: true
            });

            expect(entitiesToDisplay).toStrictEqual(EXAMPLE_ENTITIES);
            expect(showInactive).toEqual(true);
            expect(otherState).toStrictEqual(staticState);
        });

        it('when show inactive is false, only inactive entities are shown', () => {
            const staticState = {
                entities: EXAMPLE_ENTITIES,
                entitiesLoaded: true,
                inactiveCount: 2,
            };

            const stateWithEntities: State = {
                ...staticState,
                entitiesToDisplay: EXAMPLE_ENTITIES,
                showInactive: true,
            };

            const { entitiesToDisplay, showInactive, ...otherState } = reducer(stateWithEntities, {
                type: 'ToggleShowInactive',
                payload: false
            });

            expect(entitiesToDisplay).toStrictEqual([EXAMPLE_ENTITIES[0]]);
            expect(showInactive).toEqual(false);
            expect(otherState).toStrictEqual(staticState);
        });
    });
});
