import EntityListItem from '../../../models/entityListItem';
import InputEventData from '../../../models/inputEventData';

export const reducer = (state: EntityListItem, inputEventData: InputEventData) => {
    state.simpleName = state.title;
    const newState = { ...state, [inputEventData.name]: inputEventData.value };
    return newState;
};
