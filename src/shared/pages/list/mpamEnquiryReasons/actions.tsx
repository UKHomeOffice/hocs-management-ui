import EntityListItem from 'shared/models/entityListItem';

export type SetEntityDetails = {
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

export type SetActive = {
    type: 'SetActive';
    payload: boolean;
};

export type Action =
    SetEntityDetails |
    SetTitle |
    SetActive |
    SetSimpleName;
