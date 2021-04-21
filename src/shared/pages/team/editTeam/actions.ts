export type SetCurrentTeamName = {
    payload: string
    type: 'SetCurrentTeamName';
};

export type SetNewTeamName = {
    payload: string
    type: 'SetNewTeamName';
};

export type Action =
    SetCurrentTeamName |
    SetNewTeamName;
