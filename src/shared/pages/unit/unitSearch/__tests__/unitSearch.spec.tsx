import React from 'react';
import { createBrowserHistory, History } from 'history';
import { act, wait, render, RenderResult } from '@testing-library/react';
import UnitSearch from '../unitSearch';
import * as UnitsService from '../../../../services/unitsService';
import { State } from '../state';
import { MemoryRouter } from 'react-router-dom';

let history: History<any>;
let mockState: State;

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

const renderComponent = () => render(
    <MemoryRouter>
        <UnitSearch history={history}></UnitSearch>
    </MemoryRouter>
);

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
    xit('should render with default props', async () => {

        let wrapper: RenderResult;
        act(() => {
            wrapper = renderComponent();
        });

        await wait(() => {
            expect(getUnitsSpy).toHaveBeenCalled();
            expect(wrapper.container).toMatchSnapshot();
        });
    });
});
