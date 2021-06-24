import Item from '../../../models/item';
export interface State {
    inputValue: string;
    selectedUser?: Item;
    selectedUsers: Item[];
    teamName?: string;
}
