import Item from '../../../models/item';

export type AddToSelection = {
    payload: Item;
    type: 'AddToSelection';
};
export type ClearSelectedUser = {
    type: 'ClearSelectedUser';
};
export type RemoveContact = {
    payload: Item;
    type: 'RemoveFromSelection';
};
export type SetTeamName = {
    type: 'SetTeamName';
    payload?: string;
};
export type RemoveAllFromSelection = {
    type: 'RemoveAllFromSelection';
};

export type Action =
    AddToSelection |
    ClearSelectedUser |
    RemoveContact |
    SetTeamName |
    RemoveAllFromSelection;
