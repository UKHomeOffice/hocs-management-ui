import EntityListItem from 'shared/models/entityListItem';

export type SetItemDetails = {
    type: 'SetItemDetails';
    payload: EntityListItem;
};

export type SetSimpleName = {
    type: 'SetSimpleName';
    payload: string;
};

export type SetTitle = {
    type: 'SetTitle';
    payload: string;
};

export type PopulateParties = {
    payload: EntityListItem[];
    type: 'PopulateParties';
};

export type Action =
    SetItemDetails |
    PopulateParties |
    SetTitle |
    SetSimpleName;
