import { Action } from './actions';
import { State } from './amendEnquiryReasonState';

export const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'SetItemDetails':
            return { ...state, title: action.payload.title, originalTitle: action.payload.title, simpleName: action.payload.simpleName, uuid: action.payload.uuid };
        case 'SetTitle':
            return { ...state, title: action.payload };
        case 'SetSimpleName':
            return { ...state, simpleName: action.payload };
    }
    return state;
};
