import { State } from './state';
import { Action } from './actions';

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'AddToSelection':
            return { ...state, selectedUsers: [...[], ...state.selectedUsers.filter(x => x), action.payload] };
        case 'ClearSelectedUser':
            return { ...state, selectedUser: undefined };
        case 'RemoveFromSelection':
            return { ...state, selectedUsers: [...state.selectedUsers.filter(user => user.value !== action.payload.value)] };
        case 'RemoveAllFromSelection':
            return { ...state, selectedUsers: [...state.selectedUsers = []] };
        case 'SetTeamName':
            return { ...state, teamName: action.payload };
    }
    return state;
};
