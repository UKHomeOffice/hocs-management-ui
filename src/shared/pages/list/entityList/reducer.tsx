import { State } from './state';
import { Action } from './actions';

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'PopulateEntities':
            return { ...state, entities: action.payload, entitiesLoaded: true };
    }
    return state;
};
