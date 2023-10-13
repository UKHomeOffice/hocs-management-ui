import { State } from './state';
import { Action } from './actions';

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'PopulateEntities': {
            return {
                ...state,
                entities: action.payload,
                entitiesLoaded: true,
                entitiesToDisplay: state.showInactive ? action.payload : action.payload.filter(entity => entity.active),
                inactiveCount: action.payload.filter(entity => !entity.active).length,
            };
        }
        case 'ToggleShowInactive': {
            return {
                ...state,
                showInactive: action.payload,
                entitiesToDisplay: action.payload ? state.entities : state.entities.filter(entity => entity.active),
            };
        }
    }
    return state;
};
