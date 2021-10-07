import EntityListItem from '../../../models/entityListItem';

export interface State {
    accountManagers: EntityListItem[];
    accountManagersLoaded: boolean;
}
