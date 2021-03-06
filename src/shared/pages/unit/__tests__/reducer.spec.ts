import { reducer } from '../reducer';
import InputEventData from '../../../models/inputEventData';

describe('when an action is dispatched', () => {
    it('will add the value to the state', () => {

        const eventData: InputEventData = { name: 'displayName', value: '__testValue__' };
        const unit = reducer({
            displayName: '',
            shortCode: '',
            value: '',
            type: ''
        }, eventData);
        expect(unit).toStrictEqual({ displayName: '__testValue__', shortCode: '', value: '', type: '' });
    });
});
