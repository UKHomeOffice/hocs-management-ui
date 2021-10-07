import { State } from './state';
import { Action } from './actions';

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'PopulateParties':
            return { ...state, parties: action.payload, partiesLoaded: true };
    }
    return state;
};
