import { State } from './state';
import { Action } from './actions';

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'PopulateCampaigns':
            return { ...state, campaigns: action.payload, campaignsLoaded: true };
    }
    return state;
};
