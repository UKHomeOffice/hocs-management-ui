import { initialState } from '../initialState';
import { reducer } from '../reducer';

describe('when an action is dispatched', () => {
    describe('and it is a PopulateCampaigns action', () => {
        it('it will add campaigns to the campaigns collection', () => {

            const { parties: initialCampaigns, partiesLoaded: initialCampaignsLoaded, ...otherInitialState } = initialState;
            const state = reducer(initialState, {
                type: 'PopulateParties', payload: [
                    { simpleName: 'simpleName1', title: 'title1', uuid: 'uuid1' },
                    { simpleName: 'simpleName2', title: 'title2', uuid: 'uuid2' }
                ]
            });
            const { parties, partiesLoaded, ...otherState } = state;

            expect(parties).toStrictEqual([
                { simpleName: 'simpleName1', title: 'title1', uuid: 'uuid1' },
                { simpleName: 'simpleName2', title: 'title2', uuid: 'uuid2' }
            ]);
            expect(partiesLoaded).toEqual(true);
            expect(otherState).toStrictEqual(otherInitialState);
        });
    });
});
