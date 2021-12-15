import EntityListItem from '../../../models/entityListItem';
import InputEventData from '../../../models/inputEventData';

export const reducer = (state: EntityListItem, inputEventData: InputEventData) => {
    const newState = { ...state, [inputEventData.name]: inputEventData.value, simpleName: inputEventData.value.toString() };
    return newState;
};
