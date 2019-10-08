import ErrorMessage from '../../../models/errorMessage';
import Item from 'shared/models/item';

export type SetUnits = {
    type: 'SetUnits';
    payload: Item[];
};

export type AddUnitUUID = {
    type: 'AddUnitUUID'
    payload: string;
};

export type SetGeneralError = {
    type: 'SetGeneralError';
    payload: ErrorMessage;
};

export type Action =
    SetUnits |
    AddUnitUUID |
    SetGeneralError;
