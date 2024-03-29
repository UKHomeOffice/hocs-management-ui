import Item from '../../../models/item';

export type SetTeamName = {
    type: 'SetTeamName';
    payload?: string;
};

export type SetTeamUnitName = {
    type: 'SetTeamUnitName';
    payload?: string;
};

export type PopulateTeamMembers = {
    payload: Item[];
    type: 'PopulateTeamMembers';
};

export type SetTeamActive = {
    payload: boolean;
    type: 'SetTeamActive';
};

export type Action =
    SetTeamName |
    SetTeamUnitName |
    PopulateTeamMembers |
    SetTeamActive;
