import EntityListItem from '../../../models/entityListItem';
import InputEventData from '../../../models/inputEventData';

export const reducer = (state: EntityListItem, inputEventData: InputEventData) => {
    state.simpleName = inputEventData.value.toString();
    const newState = { ...state, [inputEventData.name]: inputEventData.value };
    return newState;
};
