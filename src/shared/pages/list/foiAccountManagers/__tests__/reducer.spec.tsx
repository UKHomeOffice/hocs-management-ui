import { initialState } from '../initialState';
import { reducer } from '../reducer';

describe('when an action is dispatched', () => {
    describe('and it is a PopulateCampaigns action', () => {
        it('it will add campaigns to the campaigns collection', () => {

            const { accountManagers: initialCampaigns, accountManagersLoaded: initialCampaignsLoaded, ...otherInitialState } = initialState;
            const state = reducer(initialState, {
                type: 'PopulateAccountManagers', payload: [
                    { simpleName: 'simpleName1', title: 'title1', uuid: 'uuid1' },
                    { simpleName: 'simpleName2', title: 'title2', uuid: 'uuid2' }
                ]
            });
            const { accountManagers, accountManagersLoaded, ...otherState } = state;

            expect(accountManagers).toStrictEqual([
                { simpleName: 'simpleName1', title: 'title1', uuid: 'uuid1' },
                { simpleName: 'simpleName2', title: 'title2', uuid: 'uuid2' }
            ]);
            expect(accountManagersLoaded).toEqual(true);
            expect(otherState).toStrictEqual(otherInitialState);
        });
    });
});
