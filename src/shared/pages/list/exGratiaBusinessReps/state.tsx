import EntityListItem from '../../../models/entityListItem';

export interface State {
    representatives: EntityListItem[];
    representativesLoaded: boolean;
}
