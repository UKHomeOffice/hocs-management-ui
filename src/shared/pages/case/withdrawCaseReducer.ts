import WithdrawCaseModel from '../../models/withdrawCaseModel';
import InputEventData from '../../models/inputEventData';

export const reducer = (state: WithdrawCaseModel, inputEventData: InputEventData) => {
    const newState = { ...state, [inputEventData.name]: inputEventData.value };
    return newState;
};
