import React from 'react';
import { createBrowserHistory, History } from 'history';
import { act, wait, fireEvent, getByText, render, RenderResult } from '@testing-library/react';
import UnitSearch from '../unitSearch';
import * as UnitsService from '../../../../services/unitsService';
import { State } from '../state';

let history: History<any>;
let mockState: State;

// create appropriate tests for units
jest.mock('../../../../services/unitsService', () => ({
    __esModule: true,
    getUnits:jest.fn().mockReturnValue(Promise.resolve({
        data: [{
            displayName: 'Home Office General Property',
            permissions: [
                {
                    caseTypeCode: 'DTEN',
                    accessLevel: 'OWNER'
                },
                {
                    caseTypeCode: 'MIN',
                    accessLevel: 'OWNER'
                },
                {
                    caseTypeCode: 'TRO',
                    accessLevel: 'OWNER'
                }
            ],
            letterName: null,
            type: '1aa9055d-0572-436b-a69d-4a97588f4ce4',
            active: true
        }, {
            displayName: 'Home Office General Property',
            permissions: [
                {
                    caseTypeCode: 'DTEN',
                    accessLevel: 'OWNER'
                },
                {
                    caseTypeCode: 'MIN',
                    accessLevel: 'OWNER'
                },
                {
                    caseTypeCode: 'TRO',
                    accessLevel: 'OWNER'
                }
            ],
            letterName: null,
            type: '1aa9055d-0572-436b-a69d-4a97588f4ce4',
            active: true
        }
        ]
    }))
}));

const getUnitsSpy = jest.spyOn(UnitsService, 'getUnits');
const useReducerSpy = jest.spyOn(React, 'useReducer');
const dispatch = jest.fn();

beforeEach(() => {
    history = createBrowserHistory();
    mockState = {
        errorDescription: '',
        errorTitle: '',
        units: [{
            label: '__unitName1__',
            value: '__unitsValue1__'
        }, {
            label: '__unitName2',
            value: '__unitsValue2__'
        }
        ],
        unitsLoaded: true,
        unitUUID: '__unitName__'
    };
    useReducerSpy.mockImplementationOnce(() => [mockState, dispatch]);
    dispatch.mockReset();
});

describe('when the unitView component is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(2);
        let wrapper: RenderResult;
        act(() => {
            wrapper = render(<UnitSearch history={history}></UnitSearch>);
        });

        await wait(() => {
            expect(getUnitsSpy).toHaveBeenCalled();
            expect(wrapper.container).toMatchSnapshot();
        });
    });
});

describe('when the back button is clicked', () => {
    it('should push a new page into the history', async () => {
        history.push = jest.fn();
        let wrapper: RenderResult;
        act(() => {
            wrapper = render(<UnitSearch history={history}></UnitSearch>);
        });

        await wait(async () => {
            const backButton = getByText(wrapper.container, 'Back');
            fireEvent.click(backButton);
        });

        expect(history.push).toHaveBeenCalledWith('/');
    });
});

describe('when the unit drop down selection is changed', () => {
    it('should add the UnitUUID of the selection', async () => {
        history.push = jest.fn();
        let wrapper: RenderResult;
        act(() => {
            wrapper = render(<UnitSearch history={history}></UnitSearch>);
        });

        await wait(async () => {
            const unitDropDown = getByText(wrapper.container, 'Back');
            fireEvent.click(unitDropDown);
        });

        expect(history.push).toHaveBeenCalledWith('/');
    });
});
