import { State } from './state';
import { Action } from './actions';

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SetUnits':
            return { ...state, units: action.payload, unitsLoaded: true };
        case 'AddUnitUUID':
            return { ...state, unitUUID: action.payload };
        case 'SetGeneralError':
            return { ...state, errorDescription: action.payload.description, errorTitle: action.payload.title };
    }
    return state;
};
