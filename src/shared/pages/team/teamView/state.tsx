import Item from '../../../models/item';

export interface State {
    teamMembers: Item[];
    teamMembersLoaded: boolean;
    teamName: string;
}
