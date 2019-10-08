import { reducer } from '../reducer';
import { InputEventData } from '../../../common/components/forms/text';
import { initialState } from '../initialState';
import { VALIDATION_ERROR_TITLE, GENERAL_ERROR_TITLE, ADD_UNIT_ERROR_DESCRIPTION } from '../../../models/constants';

describe('when an action is dispatched', () => {
    describe('and it is an AddError action', () => {
        it('will add the error to the state', () => {

            const { errorDescription: initialErrorDescription, errorTitle: initialErrorTitle, errors: initialErrors, ...initialOtherState } = initialState;
            const state = reducer(initialState, { type: 'AddValidationError', payload: { key: '__key__', value: '__value__' } });
            const { errorDescription, errorTitle, errors, ...otherState } = state;

            expect(errorDescription).toBe('');
            expect(errorTitle).toBe(VALIDATION_ERROR_TITLE);
            expect(errors).toHaveLength(1);
            expect(errors![0]).toStrictEqual({ key: '__key__', value: '__value__' });

            expect(otherState).toStrictEqual(initialOtherState);
        });
    });
    describe('and it is a BeginSubmit action', () => {
        it('will clear any previous errors', () => {

            const { errors: initialErrors, ...initialOtherState } = initialState;
            const state = reducer(initialState, { type: 'BeginSubmit' });
            const { errors, ...otherState } = state;

            expect(errors).toBeUndefined();
            expect(otherState).toStrictEqual(initialOtherState);
        });
    });
    describe('and it is an SetGeneralError action', () => {
        it('will add the error to the state', () => {

            const { errorDescription: initialErrorDescription, errorTitle: initialErrorTitle, errors: initialErrors, ...initialOtherState } = initialState;
            const state = reducer(initialState, { type: 'SetGeneralError', payload: { description: ADD_UNIT_ERROR_DESCRIPTION, title: GENERAL_ERROR_TITLE } });
            const { errorDescription, errorTitle, errors, ...otherState } = state;

            expect(errorDescription).toBe(ADD_UNIT_ERROR_DESCRIPTION);
            expect(errorTitle).toBe(GENERAL_ERROR_TITLE);
            expect(errors).toHaveLength(0);

            expect(otherState).toStrictEqual(initialOtherState);
        });
    });
    describe('and it is a SetUnitValues action', () => {
        it('will add the value to the state', () => {

            const eventData: InputEventData = { name: 'displayName', value: '__testValue__' };
            const { unit: initialUnit, ...initialOtherState } = initialState;
            const { unit, ...otherState } = reducer(initialState, { type: 'SetUnitValues', payload: eventData });
            expect(unit).toStrictEqual({ displayName: '__testValue__', shortCode: '', value: '' });
            expect(otherState).toStrictEqual(initialOtherState);
        });
    });
    describe('and it is not handled by the reducer', () => {
        it('will return the original state', () => {

            // @ts-ignore - this case shouldn't be possible unless typescript is ignored or an action is defined without being added to the reducer.
            const state = reducer(initialState, { type: '__unknown__', payload: '__teamName__' });

            expect(state).toStrictEqual(initialState);
        });
    });
});
