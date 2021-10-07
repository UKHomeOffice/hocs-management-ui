import { Action } from './actions';
import { State } from './amendCampaignState';

export const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'SetItemDetails':
            return { ...state, Enquiry: action.payload.title, originalTitle: action.payload.title, simpleName: action.payload.simpleName, uuid: action.payload.uuid };
        case 'SetEnquiryReasonName':
            return { ...state, enquiryReasonName: action.payload };
        case 'SetSimpleName':
            return { ...state, simpleName: action.payload };
    }
    return state;
};
