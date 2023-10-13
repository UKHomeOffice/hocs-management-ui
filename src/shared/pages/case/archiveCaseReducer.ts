import ArchiveCaseModel from '../../models/archiveCaseModel';
import InputEventData from '../../models/inputEventData';

export const reducer = (state: ArchiveCaseModel, inputEventData: InputEventData) => {
    const newState = { ...state, [inputEventData.name]: inputEventData.value };
    return newState;
};
