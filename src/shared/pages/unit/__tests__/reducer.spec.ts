import { reducer } from '../reducer';
import { InputEventData } from '../../../common/components/forms/text';

describe('when an action is dispatched', () => {
    it('will add the value to the state', () => {

        const eventData: InputEventData = { name: 'displayName', value: '__testValue__' };
        const unit = reducer({
            displayName: '',
            shortCode: '',
            value: ''
        }, eventData);
        expect(unit).toStrictEqual({ displayName: '__testValue__', shortCode: '', value: '' });
    });
});
