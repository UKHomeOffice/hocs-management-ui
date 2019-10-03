import Item from '../../../models/item';

export type SetTeams = {
    type: 'SetTeams';
    payload: Item[];
};

export type AddTeamUUID = {
    type: 'AddTeamUUID'
    payload: string;
};

export type Action =
    SetTeams |
    AddTeamUUID;