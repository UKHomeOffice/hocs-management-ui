import { reducer } from '../addEntityReducer';
import InputEventData from '../../../../models/inputEventData';

describe('when an action is dispatched', () => {
    it('will add the value to the state', () => {

        const eventData: InputEventData = { name: 'simpleName', value: '__testValue__' };
        const campaign = reducer({
            simpleName: '',
            title: '',
            uuid: '' ,
            active: false
        }, eventData);
        expect(campaign).toStrictEqual({ simpleName: '__testValue__', title: '', uuid: '', active: false });
    });
});
