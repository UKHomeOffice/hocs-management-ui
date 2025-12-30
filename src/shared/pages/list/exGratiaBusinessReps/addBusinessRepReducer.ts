import EntityListItem from '../../../models/entityListItem';
import InputEventData from '../../../models/inputEventData';

export const reducer = (state: EntityListItem, inputEventData: InputEventData) => {
    switch (inputEventData.name) {
        case 'title': {
            return {
                ...state,
                simpleName: inputEventData.value.toString().replace(/[^A-Za-z0-9]+]/, ''),
                title: inputEventData.value.toString(),
            };
        }
        default:
            return {
                ...state,
                [inputEventData.name]: inputEventData.value.toString(),
            };
    }
};
