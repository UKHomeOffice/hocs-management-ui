import { State } from './state';
import { Action } from './actions';

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SetCurrentTeamName':
            return {
                ...state,
                currentDisplayName: action.payload
            };
        case 'SetNewTeamName':
            return {
                ...state,
                newDisplayName: action.payload
            };
    }
};
