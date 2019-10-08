import Item from 'shared/models/item';

export interface State {
    errorDescription: string;
    errorTitle: string;
    units: Item[];
    unitsLoaded: boolean;
    unitUUID: string;
}
