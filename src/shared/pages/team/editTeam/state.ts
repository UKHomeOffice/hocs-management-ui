import Item from '../../../models/item';

export interface State {
    currentDisplayName: string,
    newDisplayName: string
    unit?: Item;
    initialUnit?: Item;
}
