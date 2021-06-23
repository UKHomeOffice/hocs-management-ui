import { State } from './state';
import { Action } from './actions';

export const reducer = (state: State, action: Action): State => {

    switch (action.type) {
        case 'SetCurrentTeamName':
            return {
                ...state,
                currentDisplayName: action.payload,
                newDisplayName: action.payload
            };
        case 'SetUnit':
            return { ...state, unit: action.payload };
        case 'SetUnitInitial':
            return { ...state, unit: action.payload, initialUnit: action.payload };
        case 'SetNewTeamName':
            return { ...state, newDisplayName: action.payload };
    }
};
