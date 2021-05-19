import Item from '../../../models/item';

export type SetCurrentTeamName = {
    payload: string
    type: 'SetCurrentTeamName';
};

export type SetNewTeamName = {
    payload: string
    type: 'SetNewTeamName';
};

export type SetUnitInitial = {
    type: 'SetUnitInitial';
    payload?: Item;
};

export type SetUnit = {
    type: 'SetUnit';
    payload?: Item;
};

export type Action =
    SetCurrentTeamName |
    SetNewTeamName |
    SetUnitInitial |
    SetUnit;
