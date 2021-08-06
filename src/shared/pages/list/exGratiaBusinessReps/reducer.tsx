import { State } from './state';
import { Action } from './actions';

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'PopulateRepresentatives':
            return { ...state, representatives: action.payload, representativesLoaded: true };
    }
    return state;
};
