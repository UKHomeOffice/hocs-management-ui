import Item from '../../../models/item';
import { User } from '../../../models/user';

// state
export const initialState: State = {
    user: undefined,
    selectedTeam: undefined,
    selectedTeams: []
};
export interface State {
    user?: User;
    selectedTeam?: Item | undefined;
    selectedTeams: Item[];
}

// actions
type AddToSelectedTeams = {
    payload: Item;
    type: 'AddToSelectedTeams';
};
type SetUser = {
    payload?: User;
    type: 'SetUser';
};
type ClearSelectedTeam = {
    type: 'ClearSelectedTeam';
};
type RemoveFromSelectedTeams = {
    payload: Item;
    type: 'RemoveFromSelectedTeams';
};

export type Action =
    AddToSelectedTeams |
    SetUser |
    ClearSelectedTeam |
    RemoveFromSelectedTeams;

// reducer
export const reducer = (state: State, action: Action) => {
    switch (action.type){
        case 'AddToSelectedTeams':
            return { ...state, selectedTeams: [...state.selectedTeams, action.payload] };
        case 'SetUser':
            return { ...state, user: action.payload  };
        case 'ClearSelectedTeam':
            return { ...state, selectedTeam: undefined };
        case 'RemoveFromSelectedTeams':
            return { ...state, selectedTeams: [...state.selectedTeams.filter(team => team.value !== action.payload.value)] };
    }
    return state;
};
