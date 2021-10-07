import EntityListItem from '../../../models/entityListItem';

export interface State {
    parties: EntityListItem[];
    partiesLoaded: boolean;
}
