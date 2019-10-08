import { initialState } from '../initialState';
import { reducer } from '../reducer';

describe('when an action is dispatched', () => {
    describe('and it is a SetUnits action', () => {
        it('it will add units to the unit collection', () => {

            const { units: initialUnits, unitsLoaded: initialUnitsLoaded, ...otherInitialState } = initialState;
            const state = reducer(initialState, {
                type: 'SetUnits', payload: [
                    { label: '__unit1__', value: '__unitValue1__' },
                    { label: '__unit2__', value: '__unitValue2__' }]
            });
            const { units, unitsLoaded, ...otherState } = state;

            expect(units).toStrictEqual([
                { label: '__unit1__', value: '__unitValue1__' },
                { label: '__unit2__', value: '__unitValue2__' }
            ]);
            expect(unitsLoaded).toEqual(true);
            expect(otherState).toStrictEqual(otherInitialState);
        });
    });
    describe('and it is a SetUnitName action', () => {
        it('it will set the unit name in state', () => {

            const { unitUUID: initialUnitName, ...initialOtherState } = initialState;
            const state = reducer(initialState, { type: 'AddUnitUUID', payload: '__unitName__' });
            const { unitUUID, ...otherState } = state;

            expect(unitUUID).toBe('__unitName__');
            expect(otherState).toStrictEqual(initialOtherState);
        });
    });
});
