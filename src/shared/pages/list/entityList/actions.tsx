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

export type PopulateEntities = {
    payload: EntityListItem[];
    type: 'PopulateEntities';
};

export type ToggleShowInactive = {
    payload: boolean;
    type: 'ToggleShowInactive';
};

export type Action =
    SetEntityDetails |
    PopulateEntities |
    SetTitle |
    SetSimpleName |
    ToggleShowInactive;
