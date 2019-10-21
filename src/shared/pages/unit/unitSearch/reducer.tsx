import { State } from './state';
import { Action } from './actions';

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SetUnits':
            return { ...state, units: action.payload, unitsLoaded: true };
    }
    return state;
};
