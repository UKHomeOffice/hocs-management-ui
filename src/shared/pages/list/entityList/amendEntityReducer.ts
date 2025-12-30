import { Reducer } from 'react';
import { Action } from './actions';
import { State } from './amendEntityState';

export const reducer: Reducer<State, Action> = (state: State, action: Action) => {
    switch (action.type) {
        case 'SetItemDetails':
            return {
                ...state,
                title: action.payload.title,
                originalTitle: action.payload.title,
                simpleName: action.payload.simpleName,
                uuid: action.payload.uuid,
                active: action.payload.active,
            };
        case 'SetTitle':
            return { ...state, title: action.payload };
        case 'SetActive':
            return { ...state, active: action.payload };
        case 'SetSimpleName':
            return { ...state, simpleName: action.payload };
    }
    return state;
};
