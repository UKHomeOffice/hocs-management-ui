import EntityListItem from '../../../models/entityListItem';

export interface State {
    entities: EntityListItem[];
    entitiesLoaded: boolean;
    entitiesToDisplay: EntityListItem[];
    showInactive: boolean;
    inactiveCount: number;
}
