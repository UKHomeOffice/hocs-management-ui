import { State } from './state';
import { Action } from './actions';

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'PopulateAccountManagers':
            return { ...state, accountManagers: action.payload, accountManagersLoaded: true };
    }
    return state;
};
